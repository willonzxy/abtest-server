/**
 * @ Author: 伟龙-willon
 * @ Create Time: 2019-09-09 17:51:19
 * @ Modified by: 伟龙-willon
 * @ Modified time: 2021-03-10 15:53:59
 * @ Description:
 */

 /** 以后可以优化：记录攻击者的来源信息，累计攻击语句等...等 */
module.exports = options =>{
    return async function(ctx,next){
        try {
            if(/'|;|>|<|%/i.test(decodeURIComponent(ctx.url))){
                // ctx.eclogger.info(new Error('like a sql inject attack'))
                return ctx.body = {
                    status:2,
                    msg:'搜索关键字含有非法字符'
                }
            }
        } catch (error) {
            //ctx.eclogger.error(error)
        }
        await next();
    }
}