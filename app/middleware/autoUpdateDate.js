/**
 * @ Author: 伟龙-willon
 * @ Create Time: 2019-08-08 19:55:50
 * @ Modified by: 伟龙-willon
 * @ Modified time: 2021-03-10 16:30:32
 * @ Description:
 */
const dayJs = require('dayjs');

module.exports = options =>{
    return async function(ctx,next){
        try {
            let date = dayJs().format('YYYY-MM-DD HH:mm:ss');
            let { user_id } = ctx.session || {};
            if(ctx.method === 'POST'){
                ctx.request.body = {
                    ...ctx.request.body,
                    created_date:date,
                    modified_date:date,
                    creator_id:user_id,
                    modifier_id:user_id
                }
            }
            if(ctx.method === 'PUT'){
                ctx.request.body = {
                    ...ctx.request.body,
                    modified_date:date,
                    modifier_id:user_id
                }
            }
        } catch (error) {
            //ctx.eclogger.error(err)
        }
        await next();
    }
}