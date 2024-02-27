const express=require('express')
const router=express.Router()
const cart=require('../controller/locals')
const indexcontroller=require('../controller/indexcontroller')


router.use(cart)


router.get('/', indexcontroller.homepage)
router.get('/shop',indexcontroller.shop)
router.get('/shop/view/:id',indexcontroller.productpage)



module.exports=router