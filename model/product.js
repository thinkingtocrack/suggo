const mongoose=require('mongoose')
const Schema=mongoose.Schema

const product=new Schema({
    productname:{type:String},
    brand:{type:String},
    category:{type:String},
<<<<<<< HEAD
    varient:{type:Array},
=======
    varient:{type:Object},
>>>>>>> f3d783c091eea06ab81e7c8683486219bd7e2451
    status:{type:Boolean},
    description:{type:String},
    productId: { type: String}
})

module.exports=mongoose.model('product',product)