/**
 * @ Author: 伟龙-willon
 * @ Create Time: 2019-08-05 20:44:58
 * @ Modified by: 伟龙-willon
 * @ Modified time: 2019-08-23 18:00:02
 * @ Description:
 */
const Controller = require('egg').Controller;
class UploadController extends Controller {
    async create(){
        const { ctx } = this;
        let info = await ctx.service.upload.putStream();
        ctx.body = info;
    }
}

module.exports = UploadController