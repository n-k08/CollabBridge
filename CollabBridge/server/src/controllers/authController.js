const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.userId);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  // JWT is stateless; client just removes the token
  res.json({ success: true, message: 'Logged out' });
};

module.exports = { register, login, getMe, logout };
