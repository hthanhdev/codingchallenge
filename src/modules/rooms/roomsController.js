"use strict";

const response = require("../../utils/response");
const userModel = require('../users/usersModel')
const roomService = require("./roomsService");
const roomsModel = require("./roomsModel");
const { pagination } = require("../../utils/helper");
const { v4 } = require("uuid");

exports.getList = async (req, res) => {
  try {
    let { page, perPage } = req.query;

    let { skip, take } = await pagination(page, perPage);
    let listRoom = await roomsModel.findWhere([["isdel", "==", 0]], {
      limit: Number(take),
      offset: Number(skip),
    });
    console.log(listRoom)
    if (!listRoom) return response.ok(res, { message: "Not found list room" });

    return response.ok(res, { data: listRoom });
  } catch (error) {
    return response.ok(res, { error });
  }
};

exports.updateItem = async (req, res) => {
  try {
    let { id, uidLead, idRoom, name,status } = req.body;

    if (!id) return response.ok(res, { message: "Miss param id" });

    let room = await roomsModel.findOneById(id);
    if (!room) response.ok(res, { data: "Not found room" });
    let defaultData = {
      name: name || room.name,
      uidLead: uidLead || room.uidLead,
      idRooms: idRoom || room.idRoom,
      status: status || room.status,
    };

    let rs = await roomsModel.update(id, defaultData);

    if (!rs) return response.ok(res, { message: "Can't update room" });

    return response.ok(res, { data: "Update room success" });
  } catch (error) {
    return response.ok(res, { error });
  }
};

exports.createItem = async (req, res) => {
  try {
    let user = req.user


    let {name, uidLead} = req.body

    if(!name || !uidLead) 
        return response.ok(res,{data:'Please type name, uidLead, idRoom'})
    
    let userLead = user

    if(user.id !== uidLead){
        userLead = await userModel.findOneById(uidLead)
        if(!userLead) return response.ok(res,{data:'User not found'})
    }

    let dataCreate = {
      id: v4(),
      name,
      uidLead: userLead.id,
      teamcheck: [],
      status: 1,
      isdel: 0,
    };

    await roomsModel.create(dataCreate.id, dataCreate);
    return response.ok(res,{data:dataCreate});
  } catch (error) {
    return error;
  }
};
exports.deleteItem = async (req, res) => {
  try {
    let { id } = req.body;
    if (!id) return response.ok(res, { message: "Miss param id" });

    let rs = await roomsModel.update(id,{isdel:1});

    if (!rs) return response.ok(res, { message: "Can't delete room" });

    return response.ok(res, { data: "Delete room success" });
  } catch (error) {
    return response.ok(res, { error });
  }
};

exports.getItem = async (req, res) => {
  try {
    let uid = req.params.roomId;
    let room = await roomsModel.findOneById(uid);
    if (!room) response.ok(res, { message: "Room not found" });
    if (room.isdel == 1) response.ok(res, { message: "Room was deleted" });

    return response.ok(res, { data: room });
  } catch (error) {
    return response.ok(res, { error });
  }
};
