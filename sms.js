const RC = require('ringcentral')

RECIPIENT = +19494324770

RINGCENTRAL_CLIENTID = 'K8j5BB_aT9ynoYZ1-e5P3A'
RINGCENTRAL_CLIENTSECRET = '7oTjAGYfQqqoN0TfBBL8TAr-8riCm1TA22N6mcLuJZmg'
RINGCENTRAL_SERVER = 'https://platform.devtest.ringcentral.com'

RINGCENTRAL_USERNAME = +12055120243
RINGCENTRAL_PASSWORD = "Bhtpl@123"
RINGCENTRAL_EXTENSION = 101

var rcsdk = new RC({
    server: "https://platform.devtest.ringcentral.com",
    appKey: "K8j5BB_aT9ynoYZ1-e5P3A",
    appSecret: "7oTjAGYfQqqoN0TfBBL8TAr-8riCm1TA22N6mcLuJZmg"
});
var platform = rcsdk.platform();
platform.login({
        username: '+12055120243',
        password: "Bhtpl@123",
        extension: "101"
    })
    .then(function (resp) {
        send_sms()
    });

function send_sms() {
    platform.post('/account/~/extension/~/sms', {
            from: {
                'phoneNumber': +12055120243
            },
            to: [{

                'phoneNumber': +19494324770
            }],
            text: 'Hello World from JavaScript'
        })
        .then(function (resp) {
            console.log("SMS sent. Message status: " + resp.JSON().messageStatus)
        });
}