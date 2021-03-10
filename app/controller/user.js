/**
 * @ Author: 伟龙-willon
 * @ Create Time: 2019-07-30 11:15:47
 * @ Modified by: 伟龙-willon
 * @ Modified time: 2021-03-10 20:24:38
 * @ Description: user的resetful Controller
 */
const RestfulController = require('./restful_controller/index.js');
const md5 = require('md5')
class UserController extends RestfulController {
    constructor(ctx){
        /** context与指定服务名称 */    
        super(ctx,{service:'user'})
    }
    async getSession(){
        const {ctx} = this
        ctx.body = {
            status:1,
            msg:'success',
            data:{
                is_login:ctx.session.is_login,
                account:ctx.session.account,
                user_id:ctx.session.user_id,
                role:ctx.session.role
            }
        }
    }
    async logout(){
        const { ctx } = this;
        let account = ctx.session.account;
        ctx.session = {};
        ctx.body = { status:1,msg:'已注销' }
        ctx.userLogger.warn(account,'login out............')
    }
    async login(){
        const { ctx } = this;
        const body = ctx.request.body;
        const { account,password } = body;
        if(!account){
            return ctx.body = { status:2,msg:'用户名或者密码缺失' }
        }
        if(!password){
            return ctx.body = { status:2,msg:'用户名或者密码缺失' }
        }
        let res = await ctx.service.user.findOne({account,password:md5(password)})
        if(res){
            // if(ctx.session.is_login){
            //     return ctx.body = {status:1,msg:'该用户已在登录态'}
            // }
            // ctx.session.role = res.role_list;
            ctx.session.account = account;
            ctx.session.is_login = true;
            ctx.session.user_id = res.id;
            ctx.body = {status:1,msg:'登录成功',data:{
                user_id:res.id,
                account
            }}
            ctx.userLogger.warn(account,'login in success............')
        }else{
            ctx.body = {status:2,msg:'用户名或者密码错误'}
        }
    }
    /** @override */
    /** 出口前翻译字段,并过滤密码等敏感项 */
    async index(){
        const { ctx } = this;
        let user_data = await ctx.service.user.find(ctx.query);
        for(let item of user_data.list){
            item.password && ( delete item.password )
        }
        ctx.body = {status:1,data:user_data,msg:'success'}
    }
    /** @override */
    async create(){
        const { ctx } = this;
        const body = ctx.request.body;
        const { account,password } = body;
        let res = {};
        if(!account){
            return ctx.body = { status:2,msg:'用户名或者密码缺失' }
        }
        if(!password){
            return ctx.body = { status:2,msg:'用户名或者密码缺失' }
        }
        res = await ctx.service.user.findOne({account})
        if(res){
            return ctx.body = {status:2,msg:'此用户名已存在'}
        }
        body.password = md5(body.password)
        res = await ctx.service.user.create(body)
        ctx.body = res;
    }
}

module.exports = UserController