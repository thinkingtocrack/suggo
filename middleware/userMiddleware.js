const users=require('../model/users')

const seq = async(req, res, next) => {
    const status=await users.findOne({email:req.session.email}).select('status')
    // if (req.session.user && status.status) {
    if (true) {
        next()
    } else {
        res.redirect('/')
    }
}

module.exports={seq}