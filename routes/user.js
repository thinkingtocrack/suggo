var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
const user=require('../model/users')
const bcrypt=require('bcrypt')
const usercontroller=require('../controller/usercontroller')
const userMiddleware=require('../middleware/userMiddleware')
const cart = require('../controller/locals')
const {userRegistration}=require('../middleware/validation')


// constants
const seq = userMiddleware.seq


router.use(cart)



router.get('/user_signin',usercontroller.user_signin );
router.get('/user_account',seq,usercontroller.user_account)
router.get('/user_registration',usercontroller.user_registration)
router.post('/user_registration',userRegistration,usercontroller.user_registrationpost)
router.get('/user_logout',seq,usercontroller.user_logout)
router.get('/forgot_password',seq,usercontroller.user_forgotpassword)


module.exports = router;
