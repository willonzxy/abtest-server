const RestfulController = require('./restful_controller/index.js');

class AppController extends RestfulController {
    constructor(ctx){
        /** context与指定服务名称 */    
        super(ctx,{service:'app'});
        this.service_name = 'app'
    }
    /** @override */
    async index(){
        const { ctx,service_name } = this;
        const result = await ctx.service[service_name].find({order_by:'modified_date',...ctx.query});
        ctx.body = {status:1,data:result,msg:'success'}
    }
    // async checkRepeat(){
    //     const { ctx,service_name } = this;
    //     const {id,name} = ctx.request.body;
    //     let res = await ctx.service[service_name].find({id})
    //     if(res.list.length > 0){
    //         return { status:2,msg:'该id已存在'}
    //     }
    //     res = await ctx.service[service_name].find({name})
    //     if(res.list.length > 0){
    //         return { status:2,msg:'该名称已存在'}
    //     }
    //     return {status:1}
    // }
}

module.exports = AppController