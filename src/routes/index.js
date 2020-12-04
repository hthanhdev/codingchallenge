'use strict';

const fs = require('fs');
const modules = ['auth','users','teams','rooms']
const router = require('express').Router();


module.exports = (app) => {
    for (let module of modules) {
        app.use(`/`, require(`../modules/${module}/${module}Route`)(router));
    }
};