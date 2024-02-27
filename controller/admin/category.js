const categorys=require('../../model/category')


const home = async(req, res) => {
    res.locals.data = await categorys.find()
    res.render('admin/admin_category',{dark:3})
}

const statusupdate=async(req,res)=>{
    const {statusid,status} = req.query
    try {
        const data = await categorys.findById(statusid)
        if (status == 'unblock') {
            data.status = true
            data.save()
        } else if (status == 'block') {
            data.status = false
            data.save()
        }
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error)
    }
}

const deletecategory=async(req,res)=>{
    try {
        await categorys.findByIdAndDelete(req.params.id)
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error)
    }
}

const newcategory=(req,res)=>{
    try {
        res.render('./admin/admin_newcategory',{dark:3})
    } catch (error) {
        console.log(error)
    }
}

const newcategorypost=async(req,res)=>{
    try {
        const data=req.body
        req.params.id==1?data.status=true:data.status=false
        await categorys.create(data)
        res.redirect('/admin/category')
    } catch (error) {
        res.redirect('/admin/category')
    }
}

const editcategory=async(req,res)=>{
    try {
        const {category}=await categorys.findById(req.params.id)
        res.render('./admin/admin_editcategory',{data:category,id:req.params.id,dark:3})
    } catch (error) {
        res.redirect('/admin/category')
    }
}

const categoryeditpost = async (req, res) => {
    try {
        const {id,status}=req.params
        const {category}=req.body
        const data=await categorys.findById(id)
        data.category=category
        req.params.status == 1 ? data.status = true : data.status = false
        data.save()
        res.redirect('/admin/category')
    } catch (error) {
        res.redirect('/admin/category')
    }
}


module.exports = { home, statusupdate, deletecategory, newcategory, newcategorypost, editcategory,categoryeditpost }