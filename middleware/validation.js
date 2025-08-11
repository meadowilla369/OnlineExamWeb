const Joi = require('joi');

const validateThiSinh = (req, res, next) => {
  const schema = Joi.object({
    SBD: Joi.string().min(1).max(20).required(),
    ho_va_ten: Joi.string().min(2).max(100).required(),
    nam_sinh: Joi.date().iso().required(),
    nghe_nghiep: Joi.string().min(1).max(50).required(),
    chuc_vu: Joi.string().min(1).max(50).required(),
    don_vi_cong_ty: Joi.string().min(1).max(100).required(),
    bo_phan: Joi.string().min(1).max(50).required(),
    MK: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    SBD: Joi.string().required(),
    MK: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};

module.exports = {
  validateThiSinh,
  validateLogin
};