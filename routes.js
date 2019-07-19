const otp = require("./otp");
const routes = require("express").Router();


routes.post("/forgot_password", otp.forgotPassword);
routes.post("/register_user", otp.registerUser);
routes.post("/verify_otp", otp.verifyOTP);

routes.post("/user_login", otp.userLogin);



module.exports = routes;

