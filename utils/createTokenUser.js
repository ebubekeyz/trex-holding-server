const createTokenUser = (user) => {
  return {
    fullName: user.fullName,
    username: user.username,
    country: user.country,
    email: user.email,
    phone: user.phone,
    userId: user._id,
    role: user.role,
  };
};

module.exports = createTokenUser;
