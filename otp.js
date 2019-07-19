var db = require('./db');
var md5 = require('md5');

exports.registerUser = function (req, res) {
    var body = {
        mobile_no: {
            value: req.body.mobile_no,
        },
        password: {
            value: req.body.password,
        },
        email: {
            value: req.body.email,
        },
        user_name: {
            value: req.body.user_name,
        }

    };
    var sql = `SELECT * FROM user_profile WHERE mobile_no = '${body.mobile_no.value}' OR email = '${body.email.value}'`;
    db.query(sql, function (err, get_record) {
        if (!get_record[0]) {
            var val = Math.floor(1000 + Math.random() * 9000);
            var hashed_password = md5(`${body.password.value}`)
            var sql = `INSERT INTO temp_data(otp, mobile_no, password, email, user_name) VALUES( '${val}', '${body.mobile_no.value}', '${hashed_password}','${body.email.value}', '${body.user_name.value}')`;
            db.query(sql, function (err) {
                res.status(200).send("OTP Sent");
            });

        } else {
            console.log("User already registered with the same numer or email");
            res.status(403).send("User already registered with the same numer or email");

        }
    });
}



exports.verifyOTP = function (req, res) {
    var body = {
        otp: {
            value: req.body.otp,
        },
        mobile_no: {
            value: req.body.mobile_no
        }
    };
    var sql = `SELECT * FROM temp_data WHERE mobile_no = ${body.mobile_no.value}`;
    db.query(sql, function (err, get_record) {
        var time_limit = (new Date().getTime() - get_record[0].last_updated.getTime()) / 1000

        if (get_record[0].otp == `${body.otp.value}` && time_limit <= 120) {
            var sql = `INSERT INTO user_profile( mobile_no, password, email, user_name) 
            SELECT mobile_no, password, email, user_name FROM temp_data WHERE mobile_no =  '${body.mobile_no.value}'`;
            db.query(sql, [], function (err) {});
            res.status(200).send("OTP verified! Please login with your mobile number and password");
        } else if (get_record[0].otp == `${body.otp.value}` && time_limit > 120) {
            res.status(402).send("OTP Expired");

        } else {
            res.status(403).send("Wrong OTP entered");

        }
    });
}


exports.forgotPassword = function (req, res) {
    var body = {
        mobile_no: {
            value: req.body.mobile_no,
        }
    };
    var sql = `SELECT * FROM temp_data WHERE mobile_no = ${body.mobile_no.value}`;
    db.query(sql, [], function (err, get_record) {
        if (get_record[0]) {
            var time_difference = ((new Date().getTime() - get_record[0].last_updated.getTime()) / 1000)
            if (get_record[0].retry <= 3) {
                var sql = ` UPDATE temp_data SET otp = ${val}, retry = retry + 1, last_updated = NOW() WHERE mobile_no = ${body.mobile_no.value} `;
                db.query(sql, function (err) {
                    console.log("New OTP Sent 1 ");
                });

            } else if (get_record[0].retry > 3 && time_difference < 86400) {
                console.log("Please try again after some time");

            } else if (get_record[0].retry > 3 && time_difference > 86400) {
                var val = OTP();
                var sql = `UPDATE temp_data SET otp = ${val}, retry = 1, last_updated = NOW() WHERE mobile_no = ${body.mobile_no.value}`;
                db.query(sql, function (err) {
                    console.log("New OTP Sent ");
                });
            }
            res.status(200).send("Got response");

        } else {
            if (err) throw err;
            res.status(403).send("This number is not registered");
        }
    });
}

exports.userLogin = function (req, res) {
    var body = {
        mobile_no: {
            value: req.body.mobile_no,
        },
        password: {
            value: req.body.password,
        }

    };
    var sql = `SELECT * FROM user_profile WHERE mobile_no = ${body.mobile_no.value}`;
    var entered_password = md5(`${body.password.value}`)
    db.query(sql, function (err, record) {
        if (record[0].password == entered_password && record[0].mobile_no == `${body.mobile_no.value}`)
            res.status(200).send("Login Successfull");
        else {
            res.status(404).send("Either password/email is wrong or may be this user is not registered.");
        }
    });
}