/**
 * @ Author: 伟龙-willon
 * @ Create Time: 2019-07-30 10:39:21
 * @ Modified by: 伟龙-willon
 * @ Modified time: 2021-05-17 17:44:17
 * @ Description:
 */
const path = require('path');
module.exports = {
    mysql:{
        client: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: 'root',
            database: 'abtest',
        },
        app:true, 
        agent:true, // 实例挂载到agent进程上
    },
    redis:{
        client:{
            port:6379,
            host:'localhost',
            password:'',
            db:0
        }
    },
    security:{
        csrf: {
            enable:false,
            ignore:ctx=>ctx.url === '/upload'
            // type: 'ctoken',             // can be ctoken or referer or all, default to ctoken
            // useSession: false,          // if useSession set to true, the secret will keep in session instead of cookie
            // ignoreJSON: false,          // skip check JSON requests if ignoreJSON set to true
            // cookieName: 'csrfToken',    // csrf token's cookie name
            // sessionName: 'csrfToken',   // csrf token's session name
            // headerName: 'x-csrf-token', // request csrf token's name in header
            // bodyName: '_csrf',          // request csrf token's name in body
            // queryName: '_csrf',         // request csrf token's name in query
            // refererWhiteList: [],       // referer white list
        },
        //domainWhiteList: [ 'http://cms-web-local.100bt.com:8080' ]
    },
    cors:{
        credentials: true, // 允许跨域请求携带cookies
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
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
        enable:false,
        appid: '81594',
        secret: 'e28f335f57f6e1f2e4df527d3c798d337ab94296',
    },
    // acl:{
    //     enable:true,
    // },
    logger:{
        dir:path.resolve(__dirname,'../logs/abtest-server'),
        consoleLevel: 'WARN',
    },
    export_api_prefix:{
        default:'https://abtest-api-local.100bt.com/app/',
        oversea:'https://abtest-api-local.ubeejoy.com/app/'
    }
}