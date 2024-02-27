const users=require('../model/users')



const cart=async(req,res,next)=>{
    if(req.session.user){
        const data = await users.findOne({ email: req.session.email }).select('cart')
        res.locals.cartnum=data.cart.length
        res.locals.auth=true
        res.locals.email = req.session.email
        next()
    }else{
        next()
    }
}


module.exports=cart