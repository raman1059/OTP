const otp = require("./common");
const routes = require("express").Router();


routes.post("/forgot_password", otp.forgotPassword);
routes.post("/register_user", otp.registerUser);
routes.post("/verify_otp", otp.verifyOTP);

routes.post("/user_login", otp.userLogin);
routes.post("/reset_password", otp.passwordReset);



module.exports = routes;

