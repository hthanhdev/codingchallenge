'use strict'
const jwt = require('jsonwebtoken')
const configs = require('../config/config')
const response = require('../utils/response')
const authModel = require('../modules/auth/authModel')
exports.isLogged = async(req, res, next) =>{
    try {
        const nowInUnixSeconds = Math.floor(new Date() / 1000)
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null)
        return response.unauthorized(res,{message:'Unauthorized'});
        let tokenInfo
        await new Promise((resolve, reject) => {
         jwt.verify(token, configs.jwt.secret_key,(err, decoded) => {
            if (err) {
                return response.error(res,{message:'Token is invalid'})
              }
            if(decoded.exp <= nowInUnixSeconds) {
                return response.error(res,{message: 'Token is expired!' })
            }
            console.log('verify token done')
            console.log(decoded.sub)

           
            tokenInfo = decoded
            resolve(tokenInfo);
            
        })})
        let user = await authModel.findOneById(tokenInfo.sub);
        if(!user)         
        return response.unauthorized(res,{message:'Unauthorized'});
        req.user = user;
        next()
    } catch (error) {
        return response.error(res,{error});
    }
}

async function decodeJWT(idToken) {
    let tokenInfo;
    await new Promise((resolve, reject) => {
      jwt.verify(idToken, config.secret, (err, decoded) => {
        if (err) {
          reject(err);
        }
        tokenInfo = decoded;
        resolve(tokenInfo);
      });
    });
    return tokenInfo;
  }