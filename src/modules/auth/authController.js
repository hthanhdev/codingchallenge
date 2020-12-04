"use strict";

const response = require("../../utils/response");
const jwt = require("jsonwebtoken");
const configs = require("../../config");
const bcrypt = require("bcrypt");
const AuthService = require("../auth/authService");
const {checkEmail , pagination} = require("../../utils/helper");
const authModel = require("./authModel");

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return response.ok(res, { message: "Please type email , password" });
    
    if(!checkEmail(email))
      return response.ok(res, {message: "Please re-type email (example@xyz.com)"})

    if(password.length < 4 || password.length > 20 )
    return response.ok(res, {message: "Please re-type password have length (4-20)"})

    const user = await authModel.findOneByEmail(email);

    if (!user) return response.ok(res, { message: "Not found user" });

    const checkUser = await AuthService.checkUserPassword(user,password);
    if(!checkUser) return response.ok(res,{message:"Wrong Password"})
    console.log(user)

    const token = await AuthService.createToken(user)

    return response.ok(res, { data: {token,user} });
  } catch (error) {
    return response.ok(res, { error });
  }
};


exports.getMe = async (req, res) =>{
  try {
    let user = req.user
    if(!user) return response.ok(res,{message:'User not found'});

    delete user.password
    return response.ok(res, {data:user})
  } catch (error) {
    return error;
  }
}

exports.createUser = async(req, res)=>{
  try {
    let {email, name, phone, password} = req.body
    
    if(!email || !name || !password) return response.ok(res, {data: ' Please type email, name, password'})

    if(!checkEmail(email))
      return response.ok(res, {message: "Please re-type email (example@xyz.com)"})

    let user = await authModel.findOneByEmail(email)

    if(user)
      return response.ok(res, {message: "Account exists"})

    
    let defaultData = {
      email,
      name,
      phone,
      password
    }

    let rs = await AuthService.createUser(defaultData)

    if(!rs) return response.ok(res,{data:'Can\'t create user'})

    return response.ok(res, {data:rs})

  } catch (error) {
    return error
  }
}