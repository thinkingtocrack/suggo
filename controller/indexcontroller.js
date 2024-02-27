const users = require('../model/users')
const product = require('../model/product')

const homepage = async (req, res) => {
    res.render('index')
}

const shop = async (req, res) => {
    try {
        const products = await product.find().select('productname price _id img category')
        res.locals.products = products
        res.render('shop')
    } catch (error) {
        console.log(error)
    } 
}

const productpage = async (req, res) => {
    try {
        const id = req.params.id
        const item = await product.findById(id)
        res.render('view', { item: item })
    } catch (error) {
        console.log(error)
    }
}

module.exports={homepage,shop,productpage}