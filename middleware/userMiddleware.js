const users=require('../model/users')

const seq = async(req, res, next) => {
    const status=await users.findOne({email:req.session.email}).select('status')
    if (req.session.user && status.status) {
        next()
    } else {
        delete req.session.user
        delete req.session.email
        res.redirect('/')
    }
}

const shopseq=async(req, res, next) => {
    const status=await users.findOne({email:req.session.email}).select('status')
    if (req.session.user && status.status) {
    // if (true) {
        next()
    } else {
        delete req.session.user
        delete req.session.email
        next()
    }
}

module.exports={seq,shopseq}