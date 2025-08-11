import Joi from 'joi';

export const registerSchema = Joi.object({
  names: Joi.string().min(3).required().messages({
    'string.min': 'Names must be at least 3 characters',
    'string.empty': 'Names are required',
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

export const addNewJobSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.min': 'Title must be at least 3 characters',
    'string.empty': 'Title is required',
  }),
  description: Joi.string().min(10).required().messages({
    'string.min': 'Description must be at least 10 characters',
    'string.empty': 'Description is required',
  }),
  company: Joi.string().min(2).required().messages({
    'string.min': 'Company name must be at least 2 characters',
    'string.empty': 'Company is required',
  }),
  location: Joi.string().min(2).required().messages({
    'string.min': 'Location must be at least 2 characters',
    'string.empty': 'Location is required',
  }),
  deadline: Joi.date().iso().required().messages({
    'date.base': 'Deadline must be a valid date',
    'date.format': 'Deadline must be in ISO format (YYYY-MM-DD)',
    'any.required': 'Deadline is required',
  }),
  type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'freelance').required().messages({
    'any.only': 'Type must be one of full-time, part-time, contract, internship, or freelance',
    'string.empty': 'Type is required',
  }),
});