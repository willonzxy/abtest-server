const RestfulController = require('./restful_controller/index.js');
const md5 = require('md5')
class LaunchController extends RestfulController {
    constructor(ctx) {
        /** context与指定服务名称 */
        super(ctx, {
            service: 'launch'
        });
        this.service_name = 'launch'
    }
    /** @override */
    async index(){
        const ctx = this.ctx;
        const app = this.app;
        const KEYS = app.config.keys;
        let data = [],res_obj = {};
        let cache_app_info = {};
        try {
            data = await ctx.service[this.service_name].find(ctx.query);
            for(let i of data.list||[]){
                let {app_id} = i;
                // console.log(app_id)
                if(cache_app_info[app_id]){
                    i.api = cache_app_info[app_id]
                }else{
                    i.api = cache_app_info[app_id] = `${app.config.export_api_prefix.default}${app_id}?sign=${md5(app_id + KEYS)}`
                }
            }
            res_obj = {status:1,data,msg:'success'};
        } catch (err) {
            //ctx.eclogger.error(err)
            res_obj = {status:2,data,msg:'error'};
        }
        ctx.body = res_obj;
    }
    // status 1启动 2更新 3暂停 4推全 5结束
    /** @override */
    async create() {
        this.addConfig(1)
    }

    /** @override */
    async update(){
        this.addConfig(2)
    }

    /** @override */
    async destroy() {
        const {
            ctx,
            app
        } = this;
        let id = ctx.params.id;
        // 找出app_id 及 layer_id
        const result = await ctx.service[this.service_name].findOne({id});
        let { app_id,layer_id } = result;
        if(!app_id || !layer_id){
            return ctx.body = {
                status:2,
                msg:'param invaild'
            }
        }
        // 插入一条新的
        result.status = 5;
        delete result.id;
        result.version = await this.appendVersionAttr({app_id,layer_id});
        let res = await ctx.service[this.service_name].create(result);
        if(res.status === 2){
            return ctx.body = res;
        }
        let redis_result = await app.redis.get(app_id);
        redis_result = JSON.parse(redis_result);
        // redis_result.version = res.id;
        redis_result = redis_result.filter(i=>i.layer_id!==layer_id);
        let insert_data = JSON.stringify(redis_result);
        await app.redis.set(app_id,insert_data);
        await app.mysql.update('shunt_model_config', {config:insert_data}, {where:{app_id}});
        ctx.body = {
            status:1,
            msg:'success'
        }
    }
    async appendVersionAttr(query){
        let count = await this.app.mysql.count(this.service_name,query);
        // console.log(count)
        count = count || 1;
        return count
    }

    async addConfig(status = 1){
        const {
            ctx,
            app
        } = this;
        let req_body = ctx.request.body;
        let {
            app_id,
            layer_id,
            exp_set
        } = req_body;
        try {
            let check_res = this.configCheck();
            if(check_res && check_res.status === 2){
                return ctx.body = check_res;
            }
            req_body.status = check_res.data || status;
            req_body.exp_set = typeof exp_set === 'object' ? JSON.stringify(exp_set) : exp_set;
            req_body.version = await this.appendVersionAttr({ app_id,layer_id });
            let result = await ctx.service[this.service_name].create(req_body);
            if(result.status === 2){
                return ctx.body = result;
            }
            // req_body.version = result.id;
            // 查询在应用在redis下的所有场景配置
            let ans = await app.redis.get(app_id);
            ans = JSON.parse(ans || "[]");
            // 删除当前场景配置
            ans = ans.filter(i=>i.layer_id !== layer_id);
            // 重新置入当前场景配置
            ans.push(req_body)
            // 更新插入redis
            let insert_data = JSON.stringify(ans);
            await app.redis.set(app_id,insert_data);
            // 更新插入mysql的配置表中shunt_model_config
            let shunt_model_config = await this.app.mysql.get('shunt_model_config',{app_id});
            // console.log({shunt_model_config});
            if(shunt_model_config){
                await app.mysql.update('shunt_model_config', {config:insert_data}, {where:{app_id}});
            }else{
                await app.mysql.insert('shunt_model_config',{app_id,config:insert_data});
            }
            ctx.body = {
                status: 1,
                data: {},
                msg: 'success'
            }
        } catch (error) {
            ctx.body = {
                status: 2,
                data: {},
                msg: error.message
            }
        }
        

        
    }
    configCheck(){
        const {
            ctx,
        } = this;
        let req_body = ctx.request.body;
        let {
            hit,
            exp_set,
            ref_exp_id,
            layer_id,
            app_id
        } = req_body;
        let id_reg = /^[0-9a-z-]+$/;
        if(!id_reg.test(layer_id) || !id_reg.test(app_id) || !exp_set.every(i=>id_reg.test(i.exp_id))){
            return {
                status: 2,
                data: {},
                msg: 'app_id或layer_id或exp_id含有非法字符'
            }
        }
        // 检测数量
        if (exp_set.length <= 1) {
            return {
                status: 2,
                data: {},
                msg: '该场景下的实验配置数量小于2，请求新增该场景下的实验个数'
            }
        }
        // 检测分流占比
        let weight = exp_set.reduce((perv, current) => perv._weight + current._weight)
        if (weight != 1) {
            return {
                status: 2,
                data: {},
                msg: '该场景下所有实验的分流比例不等于100%'
            }
        }

        if(exp_set.some(i=>i.exp_id === ref_exp_id)){
            return {
                status:2,
                msg:'对照组ID与实验组ID出现重复'
            }
        }

        if(new Set(exp_set.map(i=>i.exp_id)).size !== exp_set.length){
            return {
                status:2,
                msg:'实验组ID出现重复'
            }
        }

        // 暂停
        if(hit === 0){
            return {
                status:1,
                // 分流配置为状态3
                data:3
            }
        }
        // 推全
        if(exp_set.some(i=>i._weight === 1)){
            return {
                status:1,
                // 分流配置为状态4 推全
                data:4
            }
        }
        
        return {
            status:1
        }
    }
}

module.exports = LaunchController