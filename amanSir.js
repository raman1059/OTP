otp_flow: async function (req, res, next) {
        try {
            let {
                contact_no,
                con_code
            } = req.body;
            let optExist = await req.connection$('SELECT otp_id,retry,unix_timestamp(send_on) AS send_on FROM `otp_report` where contact_no=?', [contact_no]);
            optExist = optExist.fields.length ? optExist.fields[0] : null;
            if (optExist && optExist.retry > 3) {
                let current_time = new Date().getTime();
                let last_time = parseInt(optExist.send_on) * 1000;

                if (current_time < (parseInt(last_time) + 86400000)) { //adding 24hrs check
                    throw new Error("You have succeeded your limit.Please retry after 24 hrs");
                }
                optExist.retry = 0;
            }

            let update_user_no = await opration.update({
                table: 'user',
                key: 'user_id',
                value: req.user.user_id,
                data: {
                    contact_no: contact_no,
                    con_code: con_code,
                    modified_by: 1
                },
                connection: req.connection$
            });
            if (!update_user_no.fields.affectedRows) {
                if (update_user_no.code == 'ER_DUP_ENTRY') {
                    return common.alreadyExists(req, res, {
                        message: "mobile exists"
                    });
                }

                throw new Error("updating db problem");
            }

            res.locals.template_name = 'OTP';
            res.locals.to = con_code + contact_no;
            res.locals.retry = (optExist && optExist.retry) || 0;
            res.locals.variable_to_replace = {
                random_number: common.randomPattern(2, 4, false)
            };
            console.log(res.locals);
            return next();
        } catch (e) {
            req.err = e;
            return common.error(req, res);
        }
    },
    verify_otp: async function (req, res) {
            try {
                let {
                    contact_no,
                    otp
                } = req.body;

                let otp_match = await req.connection$('SELECT otp,UNIX_TIMESTAMP(send_on) AS send_on FROM `otp_report` WHERE contact_no=?', [contact_no]);
                if (!otp_match.fields.length) {
                    return common.notFound(req, res);
                }
                otp_match = otp_match.fields[0];
                let current_time = new Date().getTime();
                let expiry_time = (parseInt(otp_match.send_on) * 1000) + 300000; //5 min check
                if (current_time < (parseInt(expiry_time))) {
                    if (otp == otp_match.otp) {
                        let user_update = await opration.update({
                            table: 'user',
                            key: 'contact_no',
                            value: contact_no,
                            connection: req.connection$,
                            data: {
                                mobile_verified: 1
                            }
                        });
                        if (!user_update.fields.affectedRows) {
                            throw new Error("USER not found");
                        }

                        common.success(req, res, {
                            mobile_verified: 1
                        });
                        return opration.update({
                            table: 'otp_report',
                            key: 'contact_no',
                            value: contact_no,
                            data: {
                                mobile_verified: 1
                            },
                            connection: req.connection$
                        });

                    }
                    throw new Error("wrong otp entered");

                } else {
                    throw new Error("otp expired.");
                }
            } catch (e) {
                req.err = e;
                return common.error(req, res);
            }
        },


