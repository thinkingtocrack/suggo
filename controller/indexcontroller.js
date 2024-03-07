const product = require('../model/product')
const category =require('../model/category')

const homepage = async (req, res) => {
    try {
        res.render('./user/index.ejs')    
    } catch (error) {
        res.send(error)
    }
    
}

const shop = async (req, res) => {
    try {
        const truecategory = await category.find({ status: true }).select('category');
        let categoryarray = [];
        if (req.query?.category) {
            categoryarray = req.query.category.split(',');
        }
        let query = {};
        if (req.query?.search) {
            query.productname = { $regex: new RegExp(req.query.search, 'i') };
        }
        if (categoryarray.length > 0) {
            query.category = { $in: categoryarray };
        }
        const products = await product.aggregate([{$match:query}])
        res.locals.filter=categoryarray
        res.locals.category=truecategory
        res.locals.products = products
        res.render('./user/shop.ejs')
    } catch (error) {
        res.send(error)
    } 
}

const productpage = async (req, res) => {
    try {
        const id = req.params.id
        res.locals.varient=Number(req.params.v)
        const item = await product.find({productId:id})
        res.render('./user/view', { item: item})
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

module.exports={homepage,shop,productpage}