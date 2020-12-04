'use strict'
exports.pagination = (page = 1, perPage = 1500)=>{
    const take = perPage;
  const skip = perPage * (page >= 1 ? page - 1 : page);
  return { skip, take };
}


exports.checkEmail = (email) => {
  const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!filter.test(email)) {
    return false;
  }
  return true;
}