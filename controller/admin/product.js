const products = require('../../model/product')
const categorys = require('../../model/category')
const category = require('../../model/category')
const product = require('../../model/product')
const crypto = require("crypto");
<<<<<<< HEAD

=======
>>>>>>> f3d783c091eea06ab81e7c8683486219bd7e2451



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
        const data = await products.findById(req.params.id).select('productname category brand description varient productId')
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
<<<<<<< HEAD
        do{
            var productId = crypto.randomInt(1000000,10000000);
            var vid=crypto.randomInt(100,999);
            let z=await product.find({productId:productId})
=======
        let k=0
        let data={}
        n=0
        do{
            n = crypto.randomInt(1000000,10000000);
            let z=await product.find({productId:n})
>>>>>>> f3d783c091eea06ab81e7c8683486219bd7e2451
            if(z.length==0){
                break;
            }
        }while(true)
<<<<<<< HEAD
        let arrayimage = req.files.map((a) => {
            return a.filename
        })
        let data = {
            varient:[{
                id:vid,
                price:req.body.price,
                stock:req.body.stock,
                image:arrayimage,
                color:req.body.color,
                productdetails:req.body.productdetails.split(','),
                review:[]
            }],
            status:Boolean(Number(req.params.id)),
            productname:req.body.productname,
            productId:productId,
            description:req.body.description,
            brand:req.body.brand,
            category:req.body.category,
        }
        await products.create(data)
        res.redirect('/admin/product')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const product_new_varient=async(req,res)=>{
    try {
        do{
            var vid = crypto.randomInt(100,999);
            let z=await product.find({productId:req.params.id,varient: {$elemMatch: {id: vid}}})
            if(z.length==0){
                break;
            }
        }while(true)
        let arrayimage = req.files.map((a) => {
            return a.filename
        })
        let data = {
                id:vid,
                price:req.body.price,
                stock:req.body.stock,
                image:arrayimage,
                color:req.body.color,
                productdetails:req.body.productdetails.split(','),
                review:[]
            }
        await product.findByIdAndUpdate(req.params.id,{ $push: { varient: data } },{ new: true })
        res.redirect('/admin/product')
    } catch (error) {
        console.log(error)
        res.send(error)
=======
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
>>>>>>> f3d783c091eea06ab81e7c8683486219bd7e2451
    }
}



const product_edit_post=async(req,res)=>{
    const product = await products.findById(req.params.id)
    const data=req.body
    try {
        await products.findByIdAndUpdate(req.params.id,
            {
                productname: data?.productname == undefined ? product.productname : data.productname,
                category: data?.category == undefined ? product.category : data.category,
                brand: data?.brand == undefined ? product.brand : data.brand,
                description: data?.description == undefined ? product.description : data.description,
            }, { new: true, runValidators: true }
        )
        res.redirect('/admin/product')
    } catch (error) {
        res.redirect('/admin/product')
    }
}

const product_editvarient=async(req,res)=>{
    try {
        const {id}=req.params
        const {vid,color,price,stock,productdetails}=req.body
        let arrayimage = req.files.map((a) => {
            return a.filename
        })
        console.log(arrayimage)
        const updateObject = {
            ...(color !== undefined && { "varient.$.color": color }),
            ...(price !== undefined && { "varient.$.price": price }),
            ...(stock !== undefined && { "varient.$.stock": stock }),
            ...(productdetails !== undefined && { "varient.$.productdetails": productdetails.split(',') }),
            ...(arrayimage.length!==0 && {'varient.$.image':arrayimage}),
        };
        await products.findOneAndUpdate({productId:id,'varient.id':Number(vid)},{$set:updateObject},{ new: true })
        res.redirect('/admin/product')
    } catch (error) {
        
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

module.exports = { product_editvarient,product_new_varient,product_home ,product_edit,product_status,product_new_post,product_edit_post,product_delete}