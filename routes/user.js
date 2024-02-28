var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
const user=require('../model/users')
const bcrypt=require('bcrypt')
const usercontroller=require('../controller/usercontroller')
const userMiddleware=require('../middleware/userMiddleware')
const cart = require('../controller/locals')
const {userRegistration}=require('../middleware/validation')


const seq = userMiddleware.seq


router.use(cart)



router.get('/user_signin',usercontroller.user_signin );
router.get('/user_account',(req,res,next)=>{
    if(!req.session.user){
        res.redirect('/user/user_signin')
    }else{
        next()
    }
},seq,usercontroller.user_account)
router.get('/user_registration',usercontroller.user_registration)
router.post('/user_registration',userRegistration,usercontroller.user_registrationpost)
router.get('/user_logout',seq,usercontroller.user_logout)
router.get('/cart',seq,usercontroller.user_cart)
router.get('/forgot_password',seq,usercontroller.user_forgotpassword)
router.get('/wishlist/addwishlist/:id',seq,usercontroller.user_wishlistadd)
router.get('/cart/addtocart/:id',seq,usercontroller.user_cartadd)


module.exports = router;
