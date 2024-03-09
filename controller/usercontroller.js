const user = require('../model/users')
const bcrypt = require('bcrypt')
const otpFunction=require('../controller/otp/otpcontroller')
const {validationResult}=require('../middleware/validation')
const product = require('../model/product')
const mongoose=require('mongoose')

async function otpsend(a,otpx){
    const params = {
        to: a,
        OTP: otpx
    }
    await otpFunction.sendMail(params)
}


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

const user_account = async(req, res) => {
    try {
        let address=await user.aggregate([{$match:{email:req.session.email}},{$unwind:'$address'},{$project:{address:1}}])
        res.locals.address=address
        res.render('./user/userhome')
    } catch (error) {
        res.send(error)
    }
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
    try {
        res.render('./common/forgotpassword', { error: req.query.error })
    } catch (error) {
        res.send('error')
    }
}

const user_forgotpasswordPOST=async(req,res)=>{
    try {
        const {email}=req.body
        const userx= await user.findOne({email:email}).select('email status')
        if(userx?.email && userx?.status){
        otpadmin = otpFunction.otp()
        await otpsend(email, otpadmin)
        req.session.forgotpassword=otpadmin
        req.session.email=email
        res.render('./common/forgotpasswordotp')
        }else {
        res.redirect('/user/forgot_password?error=true')
        }
    } catch (error) {
        res.send(error)
    }
}

const user_checkforgotpasswordPOST=async(req,res)=>{
    try {
        if(req.body.otp==req.session.forgotpassword){
            let newpassword=await bcrypt.hash(req.body.password, 10)
            let userx= await user.find({email:req.session.email}).select('password')
            console.log(userx)
            userx[0].password=newpassword
            await userx[0].save()
            res.json({
                otp:true
            })
        }else{
            res.json({
                otp:false
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            error:error
        })
    }
}

const user_verify=async(req,res)=>{
    try {
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
    } catch (error) {
        res.send(error)
    }
}


const user_wishlist=async(req,res)=>{
    try {
<<<<<<< HEAD
        const wishlist=await user.findOne({email:req.session.email}).select('wishlist')
        let productid=[]
        let varientid=[]
        wishlist.wishlist.forEach(element=>{
            productid.push(element.productid)
            varientid.push(Number(element.varientid))
        })
        const productlist=await product.aggregate([{$match:{_id:{$in:productid.map(id => new mongoose.Types.ObjectId(id))}}},{$unwind:'$varient'},{$match:{'varient.id':{$in:varientid}}}])
=======
        const wishlist=await user.find({email:req.session.email}).select('wishlist')
        const productlist=await product.find({_id:{$in:wishlist[0].wishlist}}).select('productname varient')
>>>>>>> f3d783c091eea06ab81e7c8683486219bd7e2451
        res.locals.wishlist=productlist
        res.render('./user/wishlist.ejs')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const user_wishlistadd=async(req,res)=>{
    try {
        let productid=req.params.id
        let varientid=req.params.v
        let b=await user.updateMany({email:req.session.email}, { $addToSet: { wishlist: {productid:productid ,varientid:varientid}} })
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
        const varientid=req.params.v
        let b=await user.updateOne({ email:req.session.email }, { $pull: { wishlist: {productid:productid,varientid:varientid}} })
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
<<<<<<< HEAD
        const varientidlist=[]
        const cartlistid=cartlist[0].cart.map((a)=>{
            varientidlist.push(Number(a.varientid))
            return a.productid
        })
        const cartlistqty=cartlist[0].cart.map(a=>a.qty)
        const productlist=await product.aggregate([{$match:{_id:{$in:cartlistid.map(id => new mongoose.Types.ObjectId(id))}}},{$unwind:'$varient'},{$match:{'varient.id':{$in:varientidlist}}}])
=======
        const cartlistid=cartlist[0].cart.map((a)=>{
            return a.productid
        })
        const cartlistqty=cartlist[0].cart.map(a=>a.qty)
        const productlist=await product.find({_id:{$in:cartlistid}}).select('productname varient')
>>>>>>> f3d783c091eea06ab81e7c8683486219bd7e2451
        res.locals.cartlist=productlist
        res.locals.cartqtylist=cartlistqty
        res.render('./user/cart.ejs')
    } catch (error) {
        console.log(error)
    }
}

const user_cartadd=async(req,res)=>{
    try {
        let productid=req.params.id
        let qty=req.params.qty
<<<<<<< HEAD
        let varientid=req.params.v
        let existingProduct = await user.updateMany(
            {
                email: req.session.email,
                cart: { $elemMatch: { productid: productid ,varientid:varientid} }
=======
        let existingProduct = await user.updateMany(
            {
                email: req.session.email,
                cart: { $elemMatch: { productid: productid } }
>>>>>>> f3d783c091eea06ab81e7c8683486219bd7e2451
            },
            {
                $set: { "cart.$.qty": qty }
            }
        );
        if(existingProduct.modifiedCount === 0){
<<<<<<< HEAD
            var b=await user.updateMany({email:req.session.email}, { $addToSet: { cart: {productid:productid,qty:qty,varientid:varientid}} })
=======
            var b=await user.updateMany({email:req.session.email}, { $addToSet: { cart: {productid:productid,qty:qty}} })
>>>>>>> f3d783c091eea06ab81e7c8683486219bd7e2451
        }
        res.json({
            added:true,
            exists:(b?.modifiedCount==0)?true:false,
        })
    } catch (error) {
        console.log(error)
        res.json({
            added:false
        })
    }
}

const user_cartremove=async(req,res)=>{
    try {
        let productid=req.params.id
<<<<<<< HEAD
        let varientid=req.params.v
        let b=await user.updateOne({ email:req.session.email }, { $pull: { cart: {productid:productid ,varientid:varientid}} })
=======
        let b=await user.updateOne({ email:req.session.email }, { $pull: { cart: {productid:productid }} })
>>>>>>> f3d783c091eea06ab81e7c8683486219bd7e2451
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

const user_rateproduct=async(req,res)=>{
    const {id,v}=req.params
    await product.updateMany(
        {
            productId:id,
            varient: { $elemMatch: { id: Number(v)} }
        },
        {
            $addToSet: { "varient.$.review": {rate:Number(req.query.rate),review:req.query.review,user:req.session.email} }
        }
    
    )
    res.redirect(`/shop/view/${id}/${v}`)
}




const user_addnewaddress=async (req,res)=>{
    try {
        let data={
            fullname:`${req.body.firstname} ${req.body.lastname}`,
            address:req.body.address,
            city:req.body.city,
            state:req.body.state,
            zip:req.body.zip
        }
        await user.updateOne({email:req.session.email}, { $push: { address: data } })
        res.redirect('/user/user_account')
    } catch (error) {
        res.send(error)
    }
}

const user_changepassword=async (req,res)=>{
    try {
        let data = req.body
        let userx = await user.findOne({ email: req.session.email }) 
        const check = await bcrypt.compare(data.old, userx.password)
        if(check){
            data.new =await bcrypt.hash(data.new,10)
            userx.password=data.new
            await userx.save()
            res.locals.passwordchanged=true
            res.redirect('/user/user_account')
        }else{
            res.locals.passworderror=true
            res.redirect('/user/user_account')
        }
    } catch (error) {
        console.log(error)
    }
}


module.exports = {user_changepassword,user_addnewaddress,user_rateproduct,user_checkforgotpasswordPOST,user_forgotpasswordPOST,user_wishlistremove,user_cartremove,user_wishlist,user_cart,user_cartadd,user_wishlistadd, user_signin, user_account, user_registrationpost,user_registration,user_logout,user_forgotpassword,user_verify }