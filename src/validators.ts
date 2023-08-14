import { celebrate, Joi } from 'celebrate';

export const validateCreatedUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
  }).unknown(true),
});

export const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
  }).unknown(true),
});

export const validateUpdateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string(),
  }).unknown(true),
});

export const validatEmail = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
  }).unknown(true),
});

export const validatResetPasswordBody = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    token: Joi.string().uuid().required(),
  }).unknown(true),
});