/*
 * @Author: willon 伟龙 
 * @Date: 2019-08-03 23:41:40 
 * @Last Modified by: 伟龙
 * @Last Modified time: 2020-02-28 15:31:29
 */
const os = require('os');
const fs = require('fs');
const path = require('path');
const tinyImg = require('./tinyImg.js');
// const request = require('request');

module.exports = {
    deep_clone(obj){
        let target = Array.isArray(obj) ? [] : {};
        for(let k in obj){
            target[k] = !!obj[k] && isObject(obj[k]) ? deep_clone(obj[k]) : obj[k]
        }
        return target
    },
    getLocalIP(){
        let ip = '';
        return ip ? ip : (function(){
            try {
                const osType = os.type(); //系统类型
                const netInfo = os.networkInterfaces(); //网络信息
                if (osType === 'Windows_NT') {
                    for (let dev in netInfo) {
                        if (dev.includes('本地连接')){
                            for (let j = 0; j < netInfo[dev].length; j++) {
                                if (netInfo[dev][j].family === 'IPv4') {
                                    ip = netInfo[dev][j].address;
                                    break;
                                }
                            }
                        }
                    }
    
                } else if (osType === 'Linux') {
                    ip = netInfo.eth0[0].address;
                }
            } catch (error) {
                
            }
            return ip;
        })()
    },
    async readFileAsync(path){
        return new Promise((resolve,reject)=>{
            fs.readFile(path,(err,content) =>{
                if(err){
                    return reject(err)
                }
                resolve(content)
            })
        })
    },
    async tinypngApiMock(img,imgStream){
        return tinyImg.tinypngApiMock(img,imgStream)
    },
    async httpsUrl2file(target_path,url){
        return tinyImg.httpsUrl2file(target_path,url)
    },
    // async fetchUrl(url){
    //     return new Promise((resolve,reject)=>{
    //         request(url,(error,res,body)=>{
    //             if( error || (res && res.statusCode && res.statusCode !== 200)){
    //                 return reject(`请求${url}失败`)
    //             }
    //             resolve(body)
    //         })
    //     })
    // },
    /** 深度删除 */
    async rmdirPromise(filePath) {
        let that = this;
        return new Promise((resolve, reject) => {
            fs.stat(filePath, function (err, stat) {
                if(err){
                    reject(err)
                }
                if(stat.isFile()){
                    fs.unlink(filePath, function (err){
                        if(err){
                            reject(err)
                        }
                        resolve()
                    })
                }else{
                    fs.readdir(filePath, function (err, dirs) {
                        if (err){
                            reject(err)
                        }
                        dirs = dirs.map(dir => path.join(filePath, dir))
                        dirs = dirs.map(dir => that.rmdirPromise(dir))
                        Promise.all(dirs).then(() => {
                            fs.rmdir(filePath, resolve)
                        })
                    })
                }
            })
        })
    }
}

function isObject(obj){
    return typeof obj === 'object'
}