const express=require('express')
const router=express.Router()
const users=require('../model/users')
const products=require('../model/product')

const multer = require('multer')
const category = require('../controller/admin/category')
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })
const upload = multer({ dest: 'public/uploads/' })
const categorys=require('../model/category')
const login=require('../controller/admin/login')
const customer=require('../controller/admin/customer')
const product=require('../controller/admin/product')
const dashboard=require('../controller/admin/dashboard')



const seq=(req,res,next)=>{
    // if(req.session.admin){
    if(true){
        next()
    }else{
        res.redirect('/admin/admin_login')
    }
}


router.get('/admin_login',(req,res,next)=>{
    try {
        if(req.session.admin){
            res.redirect('/admin')
        }else{
            next()
        }
    } catch (error) {
        res.send(error)
    }
},login.admin_login)

router.get('/',seq,dashboard.dashboard_home)

router.get('/customer', seq,customer.customer_home)
router.post('/customer/status',seq,customer.customer_status)
router.get('/customer/deleteuser/:id',seq,customer.customer_delete)


router.get('/product', seq,product.product_home )
router.post('/product/new/:id', seq,upload.array('testImage', 24),product.product_new_post)
router.get('/product/deleteproduct/:id',seq,product.product_delete)
router.post('/product/status', seq, product.product_status)
router.get('/product/edit/:id',seq,product.product_edit)
router.post('/product/edit/:status/:id', seq, upload.array('testImage', 12),product.product_edit_post)


router.get('/category',seq,category.home)
router.post('/category/status',seq,category.statusupdate)
router.get('/category/deletecategory/:id',seq,category.deletecategory)
router.post('/category/new/:id',seq,category.newcategorypost)
router.get('/category/edit/:id',seq,category.editcategory)
router.post('/category/edit/:id/:status', seq, category.categoryeditpost)

router.get('/signout',(req,res)=>{
    try {
        req.session.admin=false
        res.redirect('/admin/admin_login')
    } catch (error) {
        res.send(error)
    }
})

module.exports=router