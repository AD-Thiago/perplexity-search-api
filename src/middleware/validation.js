const Joi = require('joi');

const searchSchema = Joi.object({
  query: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Query cannot be empty',
      'string.min': 'Query must be at least 1 character long',
      'string.max': 'Query cannot exceed 1000 characters',
      'any.required': 'Query is required'
    }),
  
  model: Joi.string()
    .valid(
      'llama-3.1-sonar-small-128k-online',
      'llama-3.1-sonar-large-128k-online',
      'llama-3.1-sonar-small-128k-chat',
      'llama-3.1-sonar-large-128k-chat'
    )
    .optional()
    .default('llama-3.1-sonar-small-128k-online')
    .messages({
      'any.only': 'Invalid model specified'
    }),

  max_tokens: Joi.number()
    .integer()
    .min(1)
    .max(4000)
    .optional()
    .default(1000)
    .messages({
      'number.base': 'max_tokens must be a number',
      'number.integer': 'max_tokens must be an integer',
      'number.min': 'max_tokens must be at least 1',
      'number.max': 'max_tokens cannot exceed 4000'
    }),

  temperature: Joi.number()
    .min(0)
    .max(2)
    .optional()
    .default(0.2)
    .messages({
      'number.base': 'Temperature must be a number',
      'number.min': 'Temperature must be at least 0',
      'number.max': 'Temperature cannot exceed 2'
    }),

  top_p: Joi.number()
    .min(0)
    .max(1)
    .optional()
    .default(0.9)
    .messages({
      'number.base': 'top_p must be a number',
      'number.min': 'top_p must be at least 0',
      'number.max': 'top_p cannot exceed 1'
    }),

  return_citations: Joi.boolean()
    .optional()
    .default(true),

  return_images: Joi.boolean()
    .optional()
    .default(false),

  recency_filter: Joi.string()
    .valid('hour', 'day', 'week', 'month', 'year')
    .optional()
    .default('month')
    .messages({
      'any.only': 'Invalid recency filter. Must be one of: hour, day, week, month, year'
    })
});

const validateSearch = (req, res, next) => {
  const { error, value } = searchSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      }
    });
  }

  req.validatedData = value;
  next();
};

module.exports = {
  validateSearch
};