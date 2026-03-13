var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { RegisterValidator, changePasswordValidator, handleResultValidator } = require('../utils/validatorHandler')
let bcrypt = require('bcrypt')
let {checkLogin} = require('../utils/authHandler')
let { GenerateJwt } = require('../utils/GenToken')
/* GET home page. */
router.post('/register', RegisterValidator, handleResultValidator, async function (req, res, next) {
    let newUser = userController.CreateAnUser(
        req.body.username,
        req.body.password,
        req.body.email,
        "69aa8360450df994c1ce6c4c"
    );
    await newUser.save()
    res.send({
        message: "dang ki thanh cong"
    })
});
router.post('/login', async function (req, res, next) {
    let { username, password } = req.body;
    let getUser = await userController.FindByUsername(username);
    if (!getUser) {
        res.status(403).send("tai khoan khong ton tai")
    } else {
        if (getUser.lockTime && getUser.lockTime > Date.now()) {
            res.status(403).send("tai khoan dang bi ban");
            return;
        }
        if (bcrypt.compareSync(password, getUser.password)) {
            await userController.SuccessLogin(getUser);
            let token = GenerateJwt({
                id: getUser._id
            })
            res.send(token)
        } else {
            await userController.FailLogin(getUser);
            res.status(403).send("thong tin dang nhap khong dung")
        }
    }

});
router.get('/me',checkLogin,function(req,res,next){
    res.send(req.user)
})

router.post('/changepassword', checkLogin, changePasswordValidator, handleResultValidator, async function (req, res, next) {
    let { oldpassword, newpassword } = req.body;

    if (!bcrypt.compareSync(oldpassword, req.user.password)) {
        res.status(403).send('oldpassword khong dung');
        return;
    }

    if (oldpassword === newpassword) {
        res.status(400).send('newpassword phai khac oldpassword');
        return;
    }

    req.user.password = newpassword;
    await req.user.save();

    res.send({
        message: 'doi mat khau thanh cong'
    });
})


module.exports = router;
