const express=require('express')
const router=express.Router()
const user = require('../model/users')
const otpFunction = require('../controller/auth')
const usercontroller=require('../controller/usercontroller')


router.get('/sendotp/:id',async(req,res)=>{
    const data=await user.findById(req.params.id).select('email otp')
    if(data.otp.createdAt==null){
        const { otp, sendMail } = otpFunction
        const otpData = {
            to: data.email,
            OTP: otp()
        }
        data.otp.otpcode = otpData.OTP
        data.otp.createdAt=new Date()
        try {
            await sendMail(otpData)
        } catch (error) {

        }
        await data.save()
        res.json({
            otpsend: 'ok',
            wait:59
        })
    }else if((new Date().getTime()-data.otp.createdAt.getTime())/1000>=60){
        const { otp, sendMail } = otpFunction
        const otpData = {
            to: data.email,
            OTP: otp()
        }
        data.otp.otpcode = otpData.OTP
        data.otp.createdAt = new Date()
        try {
            await sendMail(otpData)
        } catch (error) {

        }
        await data.save()
        res.json({
            otpsend: 'ok',
            wait:60- ((new Date().getTime() - data.otp.createdAt.getTime())/1000)
        })
    }else{
        res.json({
            otpsend:'ok',
            wait: 60-(new Date().getTime()-data.otp.createdAt.getTime())/1000
        })
    }
    
})
router.post('/user/:id',usercontroller.user_verify)

module.exports=router