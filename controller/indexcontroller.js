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
        let query = {status:true};
        if (req.query?.search) {
            query.productname = { $regex: new RegExp(req.query.search, 'i') };
        }
        if (categoryarray.length > 0) {
            query.category = { $in: categoryarray };
        }
        const products = await product.aggregate([{$match:query},{$unwind:'$varient'}])
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
        const item = await product.aggregate([{$match:{productId:id}},{$unwind:'$varient'},{ $match: { 'varient.id': Number(req.params.v) } }])
        const rate = await product.aggregate([
            { $match: { productId: id } },
            { $unwind: '$varient' },
            { $match: { 'varient.id': Number(req.params.v) } },
            {$unwind:'$varient.review'},
            {
              $group: {
                _id: '$varient.id',
                avgRate: { $avg: '$varient.review.rate' }
              }
            }
          ]);
        const similar=await product.aggregate([{$match:{category:item[0].category}},{$unwind:'$varient'},{$limit:5}])
        const varient =await product.aggregate([{$match:{productId:id}},{$unwind:'$varient'},{$project:{_id:0,'varient.id':1,'varient.color':1}}])
        res.locals.similar=similar
        res.locals.varient=varient
        res.locals.totalrate=rate
        res.render('./user/view', { item: item})
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

module.exports={homepage,shop,productpage}