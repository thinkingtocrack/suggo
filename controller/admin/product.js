const products = require('../../model/product')
const categorys = require('../../model/category')
const category = require('../../model/category')



const product_home = async (req, res) => {
    try {
        const data = await categorys.find().select('category')
        const items = await products.find()
        res.render('./admin/admin_product', { data: items ,dark:1,category:data})
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

const product_new_post=async(req,res)=>{
    try {
        let data = req.body
        data.status = Boolean(Number(req.params.id))
        let arrayimage = req.files.map((a) => {
            return {
                data: a.buffer.toString('base64'),
                contentType: a.mimetype,
            }
        })
        data.img = arrayimage
        await products.create(data)
        res.redirect('/admin/product')
    } catch (error) {
        res.send(error)
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