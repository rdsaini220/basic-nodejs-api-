import Joi from 'joi';

const registerSchema =  Joi.object({
    name : Joi.string().min(4).max(50).required(),
    email : Joi.string().email().required(),
    password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}')).required(),
    confirm_password : Joi.ref('password')
});

export default  registerSchema;