'use strict';


const teamController = require('./teamsController');
const authentication = require('../../middleware/authentication');

module.exports = (router) => {

  router.route('/teams')
    .get(authentication.isLogged,
      teamController.getList);
    
  router.route('/teams/')
    .post(authentication.isLogged,
      teamController.createItem);

  router.route('/teams/add')
    .post(authentication.isLogged,
      teamController.addUser);
  
    router.route('/teams/remove')
    .post(authentication.isLogged,
      teamController.removeUser);

  router.route('/teams/')
    .put(authentication.isLogged,
      teamController.updateItem);

  router.route('/teams')
    .delete(authentication.isLogged,
      teamController.deleteItem);

  router.route('/teams/:teamId')
    .get(authentication.isLogged,
      teamController.getItem);



  return router;
};