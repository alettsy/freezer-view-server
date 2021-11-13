'use strict'

const Joi = require('joi');
const coreSchema = require('./core');

module.exports = {
    new: Joi.object({
        name: Joi.string().min(1).required(),
        expiry: Joi.date().required(),
        inDate: Joi.date().required(),
        count: Joi.number().integer().min(1).required(),
        category: coreSchema.id.required()
    })
}