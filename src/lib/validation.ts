import Joi from 'joi';

export const registerSchema = Joi.object({
  firstname: Joi.string().min(3).required().messages({
    'string.min': 'First name must be at least 3 characters',
    'string.empty': 'First name is required',
  }),
  lastname: Joi.string().min(3).required().messages({
    'string.min': 'Last name must be at least 3 characters',
    'string.empty': 'Last name is required',
  }),
  email: Joi.string().pattern(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')).required().messages({
    'string.pattern.base': 'Email must be a valid email',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required',
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password must match password',
    'any.required': 'Confirm password is required',
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')).required().messages({
    'string.pattern.base': 'Email must be a valid email',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required',
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().pattern(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')).required().messages({
    'string.pattern.base': 'Email must be a valid email',
    'string.empty': 'Email is required',
  })
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required',
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password must match password',
    'any.required': 'Confirm password is required',
  }),
  token: Joi.string().required().messages({
    'string.empty': 'Token is required',
  })
});