export const generateToken = async (user, message, statusCode, res) => {
  const token = await user.generateJsonWebToken();
  console.log("token jwt =", token);
  if (!token) {
    throw new Error("Token generation failed.");
  }
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() +
          (parseInt(process.env.COOKIES_EXPIRES, 10) || 7) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};
