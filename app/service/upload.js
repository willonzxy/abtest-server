/**
 * @ Author: 伟龙-willon
 * @ Create Time: 2019-08-06 10:09:30
 * @ Modified by: 伟龙-willon
 * @ Modified time: 2021-03-11 20:29:51
 * @ Description:
 */

const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const img_temp_dir = path.join(__dirname,'../../img_tmp');
!fs.existsSync(img_temp_dir) && mkdirp.sync(img_temp_dir);
class UploadService extends Service{
    async putStream(){
        const { app,ctx } = this;
        // 默认使用100bt的存储桶
        let use_oversea_uploader = ctx.session ? !!ctx.session.is_oversea_website : false;
        let use_tiny_png = ctx.session ? !!ctx.session.use_tiny_png : false;
        const file_stream = await ctx.getFileStream();
        let file_name = getFileName(file_stream.filename);
        let attr = file_stream.fieldname;
        let suffix_name = Array.prototype.slice.call(/(\..+)$/.exec(file_name) || '')[1];
        // 不是图片类型，或者不想使用tinypng压缩的都直接上传到七牛云服务
        if(!/(\.png|\.jpg|\.jpeg|\.ico)$/.test(suffix_name) || !use_tiny_png){
            let info = {};
            if(use_oversea_uploader){
                info = await app.btqiniu['ubeejoy'].putStream(file_name,file_stream);
            }else{
                info = await app.btqiniu['100bt'].putStream(file_name,file_stream);
            }
            let {statusCode,uri,data} = info;
            return { ...info , attr , suffix_name }
        }
        // 要将图片暂时落地先
        let temp_path = path.join(img_temp_dir + file_name);
        const wStream = fs.createWriteStream(temp_path);
        file_stream.pipe(wStream);
        return await new Promise(async reslove1 => {
            wStream.on('error', err => {
                ctx.eclogger.error(err)
                reslove1({status:2})
            });
            await new Promise(reslove2=>{
                wStream.on('finish', () => {
                    reslove2();
                    wStream.close();
                });
            })
            let landing_file_stream = await ctx.helper.readFileAsync(temp_path);
            // 上传到tinypng
            let res = await ctx.helper.tinypngApiMock(file_name,landing_file_stream);
            // 返回优化后的url
            let fetch_url = res.output.url;
            if(!fetch_url){
                reslove1({status:2})
            }
            let { status } = await ctx.helper.httpsUrl2file(temp_path,fetch_url);
            if(status === 2){
                reslove1({status:2})
            }
            let info = {};
            if(use_oversea_uploader){
                info = await app.btqiniu['ubeejoy'].putFile(file_name,temp_path);
            }else{
                info = await app.btqiniu['100bt'].putFile(file_name,temp_path);
            }
            reslove1({ ...info,attr,suffix_name,reduceRatio: (Math.floor((1 - res.output.ratio) * 100).toFixed(2))  + '%' })
            // 删除落地图片
            setImmediate(()=>{
                fs.unlinkSync(temp_path);
            })
        })
    }
}

function getFileName(file_name){
    return Date.now() + '_' + ( ~~( Math.random() * 1e6 ) ) + Array.prototype.slice.call(/(\..+)$/.exec(file_name) || '')[1];
}

module.exports = UploadService;