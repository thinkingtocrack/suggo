const user = require('../model/users')
const bcrypt = require('bcrypt')
const otpFunction=require('../controller/otp/otpcontroller')
const {validationResult}=require('../middleware/validation')
const product = require('../model/product')



const user_signin = (req, res) => {
    try {
        if (req.session.user) {
            res.redirect('/')
        } else {
            if (req.query.error == 'true') {
                res.render('./user/login.ejs', { error: true });
            } else {
                res.render('./user/login.ejs');
            }
        }
    } catch (error) {
        console.log(error)
    }
    
}

const user_account = (req, res) => {
    res.render('./user/userhome')
}

const user_registration = (req, res) => {
    try {
        if (req.query.user == 'exist') {
            res.render('./user/signup.ejs', { error: true })
        } else {
            res.render('./user/signup.ejs')
        }
    } catch (error) {
        console.log(error)
    }
}

const user_registrationpost = async (req, res) => {
    try {
        const result=validationResult(req)
        if(!result.isEmpty()){
            res.json('hai')   
        }else{
            const data = req.body
            data.password = await bcrypt.hash(data.password, 10)
            condition = await user.find({ email: req.body.email })
            if (condition[0]) {
                res.redirect('/user/user_registration?user=exist')
            } else { 
                const {_id}=await user.create(data)
                // try {
                //     const response = await fetch(`http://localhost:4000/otpverification/sendotp/${_id}`)
                //     var status=await response.json()
                //     if(status.otpsend!=='ok'){
                //         throw new Error('Otperror')
                //     }
                // } catch (error) {
                //     console.error(error)
                // }
                // res.render('./common/otpverify', { otpaddress: '/', id: _id, otpwait: Math.floor(status.wait)})
                res.redirect(`/otpverification/user/${_id}`)
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const user_logout = (req, res) => {
    try {
        if (req.session.user) {
            delete req.session.user
        }
        if (req.session.email) {
            delete req.session.email
        }
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

const user_forgotpassword = (req, res) => {
    res.render('./common/forgotpassword', { error: req.query.error })
}

const user_verify=async(req,res)=>{
    const data=await user.findById(req.params.id).select('otp status')
    if(req.body.otp==data.otp.otpcode){
        data.otp.status=true
        await data.save()
        res.json({
            otp:true
        })
    }else{
        res.json({
            otp:false
        })
    }
}


const user_wishlist=async(req,res)=>{
    try {
        const wishlist=await user.find({email:req.session.email}).select('wishlist')
        const productlist=await product.find({_id:{$in:wishlist[0].wishlist}}).select('productname img price _id')
        res.locals.wishlist=productlist
        res.render('./user/wishlist.ejs')
    } catch (error) {
        console.log(error)
    }
}
const user_wishlistadd=async(req,res)=>{
    try {
        let productid=req.params.id
        let b=await user.updateMany({email:req.session.email}, { $addToSet: { wishlist: productid } })
        res.json({
            added:true,
            exists:(b.modifiedCount==0)?true:false,
        })
    } catch (error) {
        res.json({
            added:false
        })
    }
}
const user_wishlistremove=async(req,res)=>{
    try {
        let productid=req.params.id
        let b=await user.updateOne({ email:req.session.email }, { $pull: { wishlist: productid } })
        res.json({
            added:true,
            exists:(b.modifiedCount==0)?true:false,
        })
    } catch (error) {
        res.json({
            added:false
        })
    }
}



const user_cart=async(req,res)=>{
    try {
        const cartlist=await user.find({email:req.session.email}).select('cart')
        const productlist=await product.find({_id:{$in:cartlist[0].cart}}).select('productname img price')
        res.locals.cartlist=productlist
        res.render('./user/cart.ejs')
    } catch (error) {
        console.log(error)
    }
}

const user_cartadd=async(req,res)=>{
    try {
        let productid=req.params.id
        let b=await user.updateMany({email:req.session.email}, { $addToSet: { cart: productid } })
        res.json({
            added:true,
            exists:(b.modifiedCount==0)?true:false,
        })
    } catch (error) {
        res.json({
            added:false
        })
    }
}

const user_cartremove=async(req,res)=>{
    try {
        let productid=req.params.id
        let b=await user.updateOne({ email:req.session.email }, { $pull: { cart: productid } })
        res.json({
            added:true,
            exists:(b.modifiedCount==0)?true:false,
        })
    } catch (error) {
        res.json({
            added:false
        })
    }
}



module.exports = {user_wishlistremove,user_cartremove,user_wishlist,user_cart,user_cartadd,user_wishlistadd, user_signin, user_account, user_registrationpost,user_registration,user_logout,user_forgotpassword,user_verify }