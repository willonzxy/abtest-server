const RestfulController = require('./restful_controller/index.js');

class ExpController extends RestfulController {
    constructor(ctx){
        /** context与指定服务名称 */    
        super(ctx,{service:'experiment'});
        this.service_name = 'experiment'
    }
    /** @override */
    async index(){
        const { ctx,service_name } = this;
        const result = await ctx.service[service_name].find({order_by:'modified_date',...ctx.query});
        ctx.body = {status:1,data:result,msg:'success'}
    }
}

module.exports = ExpController