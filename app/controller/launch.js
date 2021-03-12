const RestfulController = require('./restful_controller/index.js');

class LaunchController extends RestfulController {
    constructor(ctx){
        /** context与指定服务名称 */    
        super(ctx,{service:'launch'});
        this.service_name = 'launch'
    }
    async launch(){
        const { ctx } = this;
        const layer_id = ctx.request.body.layer_id;
        if(!layer_id){
            return ctx.body = {status:2,data:{},msg:'场景id缺失'}
        }
        let result = await ctx.service['experiment'].find({pageSize:1000,layer_id});
        result = result.list;
        if(result.length <= 1){
            ctx.body = {status:2,data:{},msg:'该场景下的实验配置数量小于2，请求新增该场景下的实验个数'}
            return
        }
        let weight = result.reduce((perv,current)=>perv.weight + current.weight)
        if(weight < 100){
            ctx.body = {status:2,data:{},msg:'该场景下所有实验的分流比例小于100%'}
        }
        if(weight > 100){
            ctx.body = {status:2,data:{},msg:'该场景下所有实验的分流比例大于100%'}
        }
        
        if(weight === 100){
            let flag = result.some(i=>i.weight === 100);
            let layer_item = await ctx.service['layer'].findOne({id:layer_id});
            if(flag && layer_item.status === 1){
                // 修改场景状态，为推全，有100%占比
                await ctx.service['layer'].update({status:2},{id:layer_id});
                ctx.body = {status:1,data:{},msg:'正在推全该场景的流量'}
            }else{
                // 修改场景状态，为运行中
                await ctx.service['layer'].update({status:1},{id:layer_id});
                ctx.body = {status:1,data:{},msg:'正在同步更新该场景实验配置'}
            }
        }
    }
}

module.exports = LaunchController