'use strict';


const authController = require('./authController');
const authentication = require('../../middleware/authentication');

module.exports = (router) => {

  router.route('/auth/login')
    .post(authController.login);
    
  router.route('/auth/register')
    .post(authController.createUser);

  router.route('/auth/me')
    .get(authentication.isLogged,
      authController.getMe);



  return router;
};