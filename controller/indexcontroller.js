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
        console.log(query)
        const products = await product.find(query).select('productname price _id img category');
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
        const item = await product.findById(id)
        res.render('./user/view', { item: item })
    } catch (error) {
        res.send(error)
    }
}

module.exports={homepage,shop,productpage}