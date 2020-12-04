const userModel = require("./usersModel");

exports.getListUser = async (offset, limit) => {
  try {

    let listUser = await userModel.findWhere([["isdel", "==", 0]], {
      offset: Number(offset),
     limit:Number(limit)
    });
    console.log(listUser);
    if (!listUser) return false;
    return listUser;
  } catch (error) {
    return error;
  }
};


exports.deleteUser = async(id) =>{
  try {
    // delete soft 
    let rs = await userModel.update(id,{isdel:1})
    if(!rs) return false;
    return rs
  } catch (error) {
    return error;
  }
}