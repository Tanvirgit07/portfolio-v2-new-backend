export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {

    const data = await registerUserService({ name, email, password });
    generateResponse(res, 201, true, 'Registered user successfully!', data);
  }

  catch (error) {

    if (error.message === 'User already registered.') {
      generateResponse(res, 400, false, 'User already registered', null);
    }

    else {
      next(error)
    }
  }
};