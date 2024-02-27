const mongoose=require('mongoose')
const Schema=mongoose.Schema

const product=new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    productname:{type:String},
    brand:{type:String},
    description:{type:String},
    category:{type:String},
    price:{type:Number},
    saleprice:{type:Number},
    stock:{type:Number},
    status:{type:Boolean},
    img:{type:Array,data:Buffer,contentType:Array}
})

module.exports=mongoose.model('product',product)