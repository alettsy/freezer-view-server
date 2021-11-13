const Joi = require('joi');

module.exports = {
    new: Joi.object({
        name: Joi.string().min(1).required(),
        defaultDate: Joi.number().integer().min(1).required()
    })
}