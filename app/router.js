'use strict';

/**
 * @param {Egg.Application} app - egg application
 * all restful api
 */
const Auth = '/admin';

module.exports = app => {
  const { router , controller } = app;
  router.resources('app',Auth + '/app',controller.app);
  router.resources('layer',Auth + '/layer',controller.layer);
  router.resources('experiment',Auth + '/experiment',controller.experiment);
  router.resources('user',Auth + '/user',controller.user);
  router.resources('launch',Auth + '/launch',controller.launch);
  router.post('/upload',controller.upload.create)
  router.post('/login',controller.user.login)
  router.get(Auth + '/logout',controller.user.logout)
  router.get(Auth + '/user_session',controller.user.getSession)
};
