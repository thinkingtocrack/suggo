const express=require('express')
const router=express.Router()
const users=require('../model/users')
const bcrypt=require('bcrypt')
const {otp,sendMail}=require('../controller/otp/otpcontroller')



async function otpsend(a,otpx){
    const params = {
        to: a,
        OTP: otpx
    }
    await sendMail(params)
}


router.post('/user', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await users.findOne({ email: email }).select('password status otp')
        if (user) {
            const check = await bcrypt.compare(password, user.password)
            if (check && user.status) {
                req.session.user = true
                req.session.email = email
                if (!user.otp.status) {
                    res.redirect(`/otpverification/user/${user._id}`)
                }else{
                    res.redirect('/')
                }
            } else {
                res.redirect('/user/user_signin?error=true')
            }
        } else {
            res.redirect('/user/user_signin?error=true')
        }
    } catch (error) {
        res.send(error)
    }
})



router.post('/admin_login',async(req,res)=>{
try {
    const { email, password } = req.body
    const admin={email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD}
    const adminpass= await bcrypt.hash(admin.password,10)
    if (admin.email==email) {
        const check = await bcrypt.compare(password,adminpass )
        if (check) {
            req.session.admin=true
            res.redirect('/admin')
        } else {
            req.session.err=true
            res.redirect('/admin/admin_login')
        }
    } else {
        req.session.err=true
        res.redirect('/admin/admin_login')
    }
} catch (error) {
    
}
})


router.post('/forgetpassword',async(req,res)=>{
    try {
        const {email}=req.body
        const user= await users.findOne({email:email}).select('email otp status')
        if(user.email && user.status){
            otpadmin = otp()
            await otpsend(email, otpadmin)
            req.session.otpadmin = true
            res.render('otpverify')
        } else {
            res.redirect('/user/forgot_password?error=true')
        }
    } catch (error) {
        res.send(error)
    }
})




module.exports=router