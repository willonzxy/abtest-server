// 动态路由及菜单
// const getRawRouter = require('../fe_router.js');
// const getRawMenu = require('../fe_menu.js');
module.exports = options =>{
    return async function(ctx,next){
        try {
            if(!ctx.session.is_login){
                return ctx.body = { status:2,msg:'禁止访问'}
            }
            await next()
            /** 判断用户角色，返回，菜单，路由 */
            // if(ctx.path === '/admin/user_session'){
            //     let role = ctx.session.role || 'op'
            //     if(role === 'super_admin'){
            //         let access_menu = getRawMenu();
            //         access_menu = await getActivityAuditIframe.call(ctx,access_menu);
            //         ctx.body.access_menu = setMenuKey(access_menu)
            //         ctx.body.access_router = getRawRouter();
            //     }else{
            //         let access_menu = getAccessMenu(role,getRawMenu());
            //         access_menu = await getActivityAuditIframe.call(ctx,access_menu);
            //         ctx.body.access_menu = setMenuKey(access_menu)
            //         ctx.body.access_router = getAccessRouter(role,getRawRouter()); 
            //     }
            // }
        } catch (error) {
            //ctx.eclogger.error(error)
            ctx.body = { status:2,msg:error.message}
        }
    }
}

function getAccessMenu(role,data){
    return data.filter(i=>!!i[role])
}

// 有活动审计菜单权限的话，加载对应的页面配置
async function getActivityAuditIframe(access_menu){
    if(!access_menu.some( i => i.name === 'activity-audit-manage' )){
        return access_menu
    }
    const res = await this.service.activityaudit.find({pageSize:10000});
    let list = res.list;
    if(!list.length){
        return access_menu;
    }
    for(let item of access_menu){
        if(item.name === 'activity-audit-manage'){
            let num = 0;
            item.children = [];
            for(let i of list){
                item.children.push({
                    label:i.page_title || '页面未命名',
                    query:{
                        iframe_url:i.page_url || '未有对应网址'
                    },
                    name:'audit-iframe'
                })
            }
        }
    }
    return access_menu
}


function getAccessRouter(role,raw_data){
    (function loop(data){
        for(let [index,item] of data.entries()){
            if(!item[role]){
                data[index] = '';
                continue
            }
            if(Array.isArray(item.children)){
                loop(item.children)
            }
        }
        for(let i = 0 ; i < data.length ; i++){
            if(!data[i]){
                data.splice(i,1)
                i--
            }
        }
    })(raw_data);
    return raw_data;
}

/** 添加菜单唯一属性-由于活动数据管理菜单的特殊性以及使用name来做路由跳转 */
function setMenuKey(raw_menu){
    for(let item of raw_menu){
        item.key = Math.random()*1e6+'';
        if(!item.children.length){
            continue
        }
        for(let sub of item.children){
            sub.key = ~~(Math.random()*1e6)+'';
        }
    }
    return raw_menu
}