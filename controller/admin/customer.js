const users=require('../../model/users')


const customer_home = async (req, res) => {
    const user=await users.find().select('_id name phone email address status')
    res.render('admin/admin_customers',{data:user,dark:2})
}
const customer_status=async(req,res)=>{
    try {
        const { statusid, status } = req.query
        const user = await users.findById(statusid).select('_id status')
        if (status == 'unblock') {
            user.status = true
            user.save()
        } else if (status == 'block') {
            user.status = false
            user.save()
        }
        res.redirect('/admin/customer')
    } catch (error) {
        console.log(error)
    }  
}

module.exports={customer_home,customer_status}