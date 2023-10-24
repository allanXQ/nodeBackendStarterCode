const formValidate = (schema) => async (req, res, next) => {
  const body = req.body;
  try {
    await schema.validate(body);
    next();
  } catch (error) {
    const YupValidationError = new Error(error.message);
    YupValidationError.name = "YupValidationError";
    next(YupValidationError);
  }
};

module.exports = formValidate;
