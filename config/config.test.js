/**
 * @ Author: 伟龙-willon
 * @ Create Time: 2019-07-30 10:39:21
 * @ Modified by: 伟龙-willon
 * @ Modified time: 2021-05-17 17:43:59
 * @ Description:
 */
const path = require('path')
module.exports = {
    mysql:{
        client: {    // 请运维填写生产环境时mysql的配置信息
            host: '10.17.2.212',
            port: '3306',
            user: 'oss',
            password: '000000',
            database: 'abtest',
        },
        app:true,
        agent:true,
    },
    security:{
        csrf:{
            enable:false,
            ignore:ctx=>ctx.url === '/upload'
        },
    },
    btqiniu:{
        client:{
            AK:'bd9WBtNpvxrMlb0-cDK-JvB6zF5vn_gv_RQDNQ4c',
            SK:'59_fYP04NsXOrjZ3IGSdCb78oWzvq-TfxT2W878X',
            BN:'eclanding-test',
            SERVER:'eclanding-server.100bt.com',
            PROTOCOL:'https',
            OVERSEA_BN:'eclanding-oversea-test',
            OVERSEA_SERVER:'eclanding-server.ubeejoy.com',
            OVERSEA_PROTOCOL:'https',
        },
        app:true,
    },
    alinode:{
        enable:true,
        appid: '81597',
        secret: 'b258cd56a7d3958483a91b2547d78fbe87625991',
    },
    logger:{
        dir:path.resolve(__dirname,'../logs/abtest-server'),
        consoleLevel: 'NONE',
    },
    export_api_prefix:{
        default:'https://abtest-api-test.100bt.com/app/',
        oversea:'https://abtest-api-test.ubeejoy.com/app/'
    }
}