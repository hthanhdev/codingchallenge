const AuthModel = require("./authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const authModel = require("./authModel");
const { v4 } = require("uuid");


exports.createToken = async (user) => {
  try {
    const token = await jwt.sign(
      {
        sub: user.id,
      },
      config.jwt_secret,
      { expiresIn: config.jwt_expiration }
    );
    return token;
  } catch (error) {
    return error;
  }
};

exports.checkUserPassword = async (user, password) => {
  try {
    // let rs = await bcrypt.hash(password+user.email,2048)
    // console.log(rs)
    let inputPwd = password + user.email;
    let match = await bcrypt.compare(inputPwd, user.password);
    if (!match) return false;
    return true;
  } catch (error) {
    return error;
  }
};

function getRole(role) {
  let value = "employee";
  switch (role) {
    case 1:
      value = "boss";
      break;
    case 2:
      value = "leader";
      break;
    default:
      break;
  }

  return value;
}

exports.createUser = async (defaultData) => {
  try {
    let dataCreate = {
      id: v4(),
      email: defaultData.email,
      name: defaultData.name,
      birthday: defaultData.birthday || "0",
      password: defaultData.password,
      phone: defaultData.phone || "0",
      role: getRole(defaultData.role),
      status: 1,
      isdel: 0,
    };

    dataCreate.password = await bcrypt.hash(
      dataCreate.password + dataCreate.email,
      2048
    );

    await authModel.create(dataCreate.id, dataCreate);

    delete dataCreate.password;
    return dataCreate;
  } catch (error) {
    return error;
  }
};
