"use strict";

const response = require("../../utils/response");
const userModel = require('../users/usersModel')
const teamService = require("./teamsService");
const teamsModel = require("./teamsModel");
const { pagination } = require("../../utils/helper");
const { v4 } = require("uuid");
const usersModel = require("../users/usersModel");
const _ = require("lodash")
exports.getList = async (req, res) => {
  try {
    let { page, perPage } = req.query;

    let { skip, take } = await pagination(page, perPage);
    let listTeam = await teamsModel.findWhere([["isdel", "==", 0]], {
      limit: Number(take),
      offset: Number(skip),
    });

    if (!listTeam) return response.ok(res, { message: "Not found list team" });

    return response.ok(res, { data: listTeam });
  } catch (error) {
    return response.ok(res, { error });
  }
};

exports.updateItem = async (req, res) => {
  try {
    let { id, uidLead, idRoom, name,status } = req.body;

    if (!id) return response.ok(res, { message: "Miss param id" });

    let team = await teamsModel.findOneById(id);
    if (!team) response.ok(res, { data: "Not found team" });
    let defaultData = {
      name: name || team.name,
      uidLead: uidLead || team.uidLead,
      idRooms: idRoom || team.idRoom,
      status: status || team.status,
    };

    let rs = await teamsModel.update(id, defaultData);

    if (!rs) return response.ok(res, { message: "Can't update team" });

    return response.ok(res, { data: "Update team success" });
  } catch (error) {
    return response.ok(res, { error });
  }
};

exports.createItem = async (req, res) => {
  try {
    let user = req.user


    let {name, uidLead, idRoom} = req.body

    if(!name || !uidLead || !idRoom) 
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
      users: [{name:userLead.name,id:userLead.id}],
      idRoom,
      status: 1,
      isdel: 0,
    };

    await teamsModel.create(dataCreate.id, dataCreate);
    return response.ok(res,{data:dataCreate});
  } catch (error) {
    return error;
  }
};
exports.deleteItem = async (req, res) => {
  try {
    let { id } = req.body;
    if (!id) return response.ok(res, { message: "Miss param id" });

    let rs = await teamsModel.update(id,{isdel:1});

    if (!rs) return response.ok(res, { message: "Can't delete team" });

    return response.ok(res, { data: "Delete team success" });
  } catch (error) {
    return response.ok(res, { error });
  }
};

exports.getItem = async (req, res) => {
  try {
    let uid = req.params.teamId;
    let team = await teamsModel.findOneById(uid);
    if (!team) return response.ok(res, { message: "Team not found" });
    if (team.isdel == 1) return response.ok(res, { message: "Team was deleted" });

    return response.ok(res, { data: team });
  } catch (error) {
    return response.ok(res, { error });
  }
};


exports.addUser = async(req, res) =>{
    try {
        let {id,uidAdd} = req.body;
        
        let team = await teamsModel.findOneById(id);
        if (!team) return response.ok(res, { message: "Team not found" });
        if (team.isdel == 1)return response.ok(res, { message: "Team was deleted" });
        
        if(!uidAdd) response.ok(res, { message: "Miss param uidAdd" });

        let userAdd = await usersModel.findOneById(uidAdd);

        if(!userAdd) return response.ok(res, { message: "User add not found " }); 

        team.users.push({id:userAdd.id,name:userAdd.name})

    
        return response.ok(res, { data: team , message: 'Add user success'});
      } catch (error) {
        return response.ok(res, { error });
      }
}

exports.removeUser = async(req, res) =>{
    try {
        let {id,uidRemove} = req.body;
        
        let team = await teamsModel.findOneById(id);
        if (!team) return response.ok(res, { message: "Team not found" });
        if (team.isdel == 1)return response.ok(res, { message: "Team was deleted" });

        if(!uidRemove) response.ok(res, { message: "Miss param uidRemove" });


        let users = _.remove(team.users,function (user) {
         return user.uid === uidRemove 
        })

        team = await teamsModel.update(id,{users})
        return response.ok(res, { data: team , message: 'Remove user success'});
      } catch (error) {
        return response.ok(res, { error });
      }
}