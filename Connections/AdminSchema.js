const mongoose=require("mongoose")


// category modelNames
const AddCategory=new mongoose.Schema({

    MainCategory:String,
    SubCategory:Array
})
const MainCategory=mongoose.model("MainCategory",AddCategory)



//adding product

const StoreCategory=new mongoose.Schema({
    ProductName:String,
    Category:String,
    SubCategory:String,
    Price:Number,
    Discount:Number,
    Disc:String,
    Images:Array


})
const Products=mongoose.model("ProductDetails",StoreCategory)





module.exports = {MainCategory,
Products}