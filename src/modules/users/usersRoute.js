"use strict";

const userController = require("./usersController");
const authentication = require("../../middleware/authentication");

module.exports = (router) => {
  router.route("/users").get(authentication.isLogged, userController.getList);

  router.route('/users')
    .put(authentication.isLogged,
      userController.updateUser);

  router.route('/users/:userId')
    .get(authentication.isLogged,
      userController.getUser);

  router
    .route("/users")
    .delete(authentication.isLogged, userController.deleteUser);

  return router;
};
