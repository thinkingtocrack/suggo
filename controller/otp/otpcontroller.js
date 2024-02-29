const user = require('../../model/users')


const otp=()=>{
    return String(Math.floor(Math.random()*9000+1000))
}


const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

sendMail = async (params) => {
    try {
        let info = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: params.to,
            subject: 'Hello ✔',
            html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome to the club.</h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
   </div>
    `,
        });
        return info;
    } catch (error) {
        console.log(error);
        return false;
    }
};


const send_otp=async(req,res)=>{
    const data=await user.findById(req.params.id).select('email otp')
    if(data.otp.createdAt==null){
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
    
}

renderotp=async(req,res)=>{
    const response = await fetch(`http://localhost:4000/otpverification/sendotp/${req.params.id}`)
    const otpres = await response.json()
    res.render('./common/otpverify', { otpaddress: '/', otpwait: Math.floor(otpres.wait), id: req.params.id })
}

module.exports={sendMail,otp,send_otp,renderotp}
