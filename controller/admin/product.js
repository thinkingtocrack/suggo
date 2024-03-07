const products = require('../../model/product')
const categorys = require('../../model/category')
const category = require('../../model/category')
const product = require('../../model/product')
const crypto = require("crypto");



const product_home = async (req, res) => {
    try {
        const data = await categorys.find().select('category')
        const items = await products.find()
        res.render('./admin/admin_product2', { data: items ,dark:1,category:data})
    } catch (error) {
        res.send(error)
    }
}


const product_edit=async(req,res)=>{
    try {
        const data = await products.findById(req.params.id).select('productname price category stock brand description')
        res.json({
            data:data,
        })
    } catch (error) {
        res.send(error)
    }
}

const product_status=async (req, res) => {
    const { statusid, status } = req.body
    try {
        const product = await products.findById(statusid).select('_id status')
        if (status) {
            product.status = status
            await product.save()
            res.json({
                productid:statusid,
                done:true,
            })
        }
    } 
    catch (error) {
        res.json({
            productid:statusid,
            done:false,
        })
    }
}

// const product_new_post=async(req,res)=>{
//     try {
//         let data = req.body
//         data.status = Boolean(Number(req.params.id))
//         let arrayimage = req.files.map((a) => {
//             return {
//                 data: a.buffer.toString('base64'),
//                 contentType: a.mimetype,
//             }
//         })
//         data.img = arrayimage
//         await products.create(data)
//         res.redirect('/admin/product')
//     } catch (error) {
//         res.send(error)
//     }
// }
const product_new_post=async(req,res)=>{
    try {
        let k=0
        let data={}
        n=0
        do{
            n = crypto.randomInt(1000000,10000000);
            let z=await product.find({productId:n})
            if(z.length==0){
                break;
            }
        }while(true)
        data.productId=n
        data.productname=req.body.productname
        data.category=req.body.category
        data.brand=req.body.brand
        data.description=req.body.description
        data.status= Boolean(Number(req.params.id))
        data.varient=[]
        for(i=0;i<req.body.color.length;i++){
            let img=req.files.slice(k,k+Number(req.body.imagenum[i]))
            let imgx=[]
            for(j=0;j<img.length;j++){
                imgx.push(img[j].filename)
            }
            console.log(imgx)
            data.varient={
                id:`${i}`,
                color:req.body.color[i],
                stock:req.body.stock[i],
                image:imgx,
                price:req.body.price[i],
            }
            k=k+Number(req.body.imagenum[i])
            await product.create(data)
        }
        res.redirect('/admin/product')
    } catch (error) {
        console.log(error)
    }
}



const product_edit_post=async(req,res)=>{
    const product = await products.findById(req.params.id)
    const status=Number(req.params.status)
    const data=req.body
    let arrayimage = req.files.length==0 ? undefined: req.files.map((a) => {
        return {
            data: a.buffer.toString('base64'),
            contentType: a.mimetype,
        }
    })
    try {
        await products.findByIdAndUpdate(req.params.id,
            {
                productname: data?.productname == undefined ? product.productname : data.productname,
                price: data?.price == undefined ? product.price : data.price,
                category: data?.category == undefined ? product.category : data.category,
                stock: data?.stock == undefined ? product.stock : data.stock,
                brand: data?.brand == undefined ? product.brand : data.brand,
                description: data?.description == undefined ? product.description : data.description,
                status: Boolean(status),
                img: arrayimage ==undefined ?product.img:arrayimage
            }, { new: true, runValidators: true }
        )
        res.redirect('/admin/product')
    } catch (error) {
        res.redirect('/admin/product')
    }
}

const product_delete=async(req,res)=>{
    try {
        await products.findByIdAndDelete(req.params.id)
        res.json({
            product:req.params.id,
            deleted:true,
        })
    } catch (error) {
        res.json({
            product:req.params.id,
            deleted:false,
        })
    }
}

module.exports = { product_home ,product_edit,product_status,product_new_post,product_edit_post,product_delete}