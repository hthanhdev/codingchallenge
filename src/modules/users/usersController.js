"use strict";

const response = require("../../utils/response");
const configs = require("../../config");
const userService = require("./usersService");
const {pagination} = require("../../utils/helper");
const userModel = require("./usersModel")

exports.getList = async (req, res) => {
  try {
    let user = req.user;

    let {page, perPage} = req.query

    let {skip, take} = await pagination(page, perPage)
    
    let listUser = await userService.getListUser(skip, take)

    if(!listUser) return response.ok(res, { message: 'Not found list user' });
    listUser.forEach(function(v){ delete v.password });

    return response.ok(res, { data: listUser });
  } catch (error) {
    return response.ok(res, { error });
  }
};


exports.deleteUser = async (req, res) =>{
  try {
    let {id} = req.body;
    if(!id) return response.ok(res, { message: 'Miss param id' });

    let rs = await userService.deleteUser(id)

    if(!rs) return response.ok(res, { message: 'Can\'t delete user' });

    return response.ok(res, { data: 'Delete user success' });

  } catch (error) {
    return response.ok(res, { error });
  }
}
exports.updateUser = async (req, res) =>{
  try {
    let {id,birthday, name, phone, status} = req.body;

    if(!id) return response.ok(res, { message: 'Miss param id' });

    let user = await userModel.findOneById(id);
    if(!user) 
    response.ok(res,{data:'Not found user'})

    let defaultData = {
      name: name || user.name,
      birthday: birthday || user.birthday,
      phone: phone || user.phone,
      status: status || user.status
    }


    let rs = await userModel.update(id, defaultData)

    if(!rs) return response.ok(res, { message: 'Can\'t update user' });

    return response.ok(res, { data: 'Update user success' });

  } catch (error) {
    return response.ok(res, { error });
  }
}


exports.getUser = async(req, res) =>{
  try {

    let uid = req.params.userId
    let user = await userModel.findOneById(uid);
    if(!user)
      response.ok(res, {message:'User not found'})
    if(user.isdel == 1)
      response.ok(res, {message:'User was deleted'})

    delete user.password
    return response.ok(res, {data:user})
  } catch (error) {
    return response.ok(res, { error });

  }
}