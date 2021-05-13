'use strict';

/**
 * @param {Egg.Application} app - egg application
 * all restful api
 */
const Auth = '/admin';

module.exports = app => {
  const { router , controller } = app;
  // 应用管理的接口
  router.resources('app',Auth + '/app',controller.app);
  
  // 场景管理的接口（层管理）
  router.resources('layer',Auth + '/layer',controller.layer);

  // 启动分流配置的路由
  router.resources('launch',Auth + '/launch',controller.launch);

  // router.resources('experiment',Auth + '/experiment',controller.experiment);

  router.post('/upload',controller.upload.create)
  router.post('/login',controller.user.login)
  router.get(Auth + '/logout',controller.user.logout)
  router.get(Auth + '/user_session',controller.user.getSession)
  router.resources('user',Auth + '/user',controller.user);
};
