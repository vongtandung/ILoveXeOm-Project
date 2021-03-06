var express = require('express');

var loginRepo = require('../repos/loginRepo');
var authRepo = require('../repos/authRepo');

var router = express.Router();

router.post('/',(req,res)=> {
    loginRepo.login(req.body)
    .then(rows => {
        if (rows.length > 0) {
            var userEntity = rows[0];
            var acToken = authRepo.generateAccessToken(userEntity);
            var rfToken = authRepo.generateRefreshToken();
            authRepo.updateRefreshToken(userEntity.id, rfToken)
                .then(value => {
                    res.json({
                        auth: true,
                        ID: userEntity.id,
                        Name: userEntity.Name,
                        PhoneNumber: userEntity.PhoneNumber,
                        Permission: userEntity.Permission,
                        access_token: acToken,
                        refresh_token: rfToken
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.statusCode = 500;
                    res.end('View error log on console');
                })
        } else {
            res.json({
                auth: false
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.statusCode = 20;
        res.end('View error log on console');
    })
})
router.post('/renewtoken', (req, res) => {
    var rToken = req.body.refreshToken;
    authRepo.verifyRefreshToken(rToken).then(rows => {
            if (rows.length === 0) {
                res.statusCode = 400;
                res.json({
                    msg: 'invalid refresh-token'
                });
                throw new Error('abort-chain'); // break promise chain

            } else {
                //console.log(rows[0]);
                return rows[0].UserId;
            }
        })
        .then(id => loginRepo.load(id))
        .then(rows => {
            var userObj = rows[0];
            var token = authRepo.generateAccessToken(userObj);
            res.json({
                access_token: token
            });
        })
        .catch(err => {
            if (err.message !== 'abort-chain') {
                console.log(err);
                res.statusCode = 500;
                res.end('View error log on console.');
            }
        });
});

module.exports= router;