'use strict';


const roomController = require('./roomsController');
const authentication = require('../../middleware/authentication');

module.exports = (router) => {

  router.route('/rooms')
    .get(authentication.isLogged,
      roomController.getList);
    
  router.route('/rooms/')
    .post(authentication.isLogged,
      roomController.createItem);

  router.route('/rooms/')
    .put(authentication.isLogged,
      roomController.updateItem);

  router.route('/rooms')
    .delete(authentication.isLogged,
      roomController.deleteItem);

  router.route('/rooms/:roomId')
    .get(authentication.isLogged,
      roomController.getItem);



  return router;
};