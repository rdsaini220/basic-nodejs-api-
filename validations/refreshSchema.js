import Joi from 'joi';

const refreshSchema =  Joi.object({
    refresh_token : Joi.string().required(),
});

export default refreshSchema;