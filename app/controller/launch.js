const RestfulController = require('./restful_controller/index.js');

class LaunchController extends RestfulController {
    constructor(ctx) {
        /** context与指定服务名称 */
        super(ctx, {
            service: 'launch'
        });
        this.service_name = 'launch'
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
        let res = await ctx.service[this.service_name].create(result);
        if(res.status === 2){
            return ctx.body = res;
        }
        let redis_result = await app.redis.get(app_id);
        redis_result = JSON.parse(redis_result);
        // redis_result.version = res.id;
        redis_result = redis_result.filter(i=>i.layer_id!==layer_id)
        await app.redis.set(app_id,JSON.stringify(redis_result));
        ctx.body = {
            status:1,
            msg:'success'
        }
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
            let result = await ctx.service[this.service_name].create(req_body);
            if(result.status === 2){
                return ctx.body = result;
            }
            req_body.version = result.id;
            // 查询在应用在redis下的所有场景配置
            let ans = await app.redis.get(app_id);
            ans = JSON.parse(ans || "[]");
            // 删除当前场景配置
            ans = ans.filter(i=>i.layer_id !== layer_id);
            // 重新置入当前场景配置
            ans.push(req_body)
            // 更新插入
            await app.redis.set(app_id,JSON.stringify(ans));
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
        let id_reg = /^[0-9a-z_]+$/;
        if(!id_reg.test(layer_id) || !id_reg.test(apo_id) || !exp_set.every(i=>id_reg.test(i.exp_id))){
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