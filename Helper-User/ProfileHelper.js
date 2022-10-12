const ProductStore = require("../Connections/AdminSchema").Products;
const MongoCategory = require("../Connections/AdminSchema").MainCategory;
const MongoCart = require("../Connections/UserSchema").CartData;
const MongoOrder = require("../Connections/UserSchema").OrderDetails;
const MongoUser = require("../Connections/UserSchema").user_data;
const MongoUserData=require("../Connections/UserSchema").user_data
const MongoWallet=require("../Connections/UserSchema").UserWallet
const mongowalhis=require("../Connections/UserSchema").WalletHistory


const MongoAddress = require("../Connections/UserSchema").address;
const session = require("express-session");
const { ObjectId } = require("mongodb");
const { json } = require("body-parser");
const { address } = require("../Connections/UserSchema");
const { query } = require("express");
const MongoWishList = require("../Connections/UserSchema").UserWishlist;
const CategoryList = async () => {
  return await MongoCategory.find();
};


async function cartdata(user)
{
    console.log(user);
    const UserId=await MongoUserData.findOne({email:user});

   if(UserId)
   {
  // console.log(UserId._id);
  cartDetails=await MongoCart.findOne({UserId:UserId._id})
    
    
  //  const ProductId=cartDetails.product;
  //  const MatchCartUserId=await MongoCart.aggregate([{$match:{UserId:UserId._id}}])
   
   
   const CartProduct=await MongoCart.aggregate([{$match:{UserId:UserId._id}},{$unwind:'$product'},{$project:{ItemId:'$product.ItemId',
   Quantity:'$product.Quantity'}}, {
     $lookup:{
         from:'productdetails',
         localField:'ItemId', 
         foreignField:'_id',
         as:'product'
     }}, {$project:{
       ItemId: 1, Quantity: 1 ,product: { $arrayElemAt: ['$product',0]}
   }}])
console.log(CartProduct);
return CartProduct
   }
   else 
   return [];
  
}




const MainProfile = async (req, res) => {
  const user = await MongoUser.findOne({ email: req.session.user });
  const UserOrder = await MongoOrder.find({ userId: user._id });

  const Address = await MongoAddress.find({ UserId: user._id });
  console.log(user);
  const wallet=await MongoWallet.findOne({userId:user._id})
  console.log(wallet);

  res.render("user/User-profile", {name:user,user: req.session.user,
    Category: await CategoryList(),
    Orders: UserOrder,
    user: user,
    address: Address,cartdata:await cartdata(req.session.user)
    ,wallet:wallet.balance
  }); 
};

const SingleOrder = async (req, res) => {
  const OrderID = req.query.orderid;

  const orderDetails = await MongoOrder.findOne({ _id: ObjectId(OrderID) });

  const ProductDetails = await MongoOrder.aggregate([
    { $match: { _id: ObjectId(OrderID) } },
    { $unwind: "$products" },
    {
      $project: { ItemId: "$products.ItemId", Quantity: "$products.Quantity" },
    }, 
    {
      $lookup: {
        from: "productdetails", 
        localField: "ItemId",
        foreignField: "_id",
        as: "productdata",
      },
    },
    {
      $project: { Quantity: 1, product: { $arrayElemAt: ["$productdata", 0] } },
    },
  ]);
  console.log(orderDetails);
  const user =await MongoUserData.findOne({email:req.session.user})

  res.render("user/YourOrders", {name:user,user: req.session.user,
    Category: await CategoryList(),
    productdata: ProductDetails,
    orderDetails: orderDetails,cartdata:await cartdata(req.session.user)
  });
};

const cancelOrder = async (req, res) => {
  console.log("what i want", req.body);

  const details = await MongoOrder.findOne({ _id: ObjectId(req.body.id) });

  if (details.paymentMethod == "COD") {
    await MongoOrder.updateOne(
      { _id: ObjectId(req.body.id) },
      {
        $set: {
          CancelOrder: 1,
          DeliveryStatus: "canceled",
          PaymentStatus: "canceled",
        },
      },
      function (err, success) {
        if (success) {
          console.log(success);
        }
      }
    ).clone();
  } else {
    await MongoOrder.updateOne(
      { _id: ObjectId(req.body.id) },
      {
        $set: {
          CancelOrder: 1,
          DeliveryStatus: "canceled",
          PaymentStatus: "refund initiated",
        },
      },
      function (err, success) {
        if (success) {
          console.log(success);
        }
      }
    ).clone();
  }
  console.log(await MongoOrder.findOne({ _id: ObjectId(req.body.id) }));
  res.json(true);
};

const SaveAddress = async (req, res) => {
  const user = await MongoUser.findOne({ email: req.session.user });
  console.log(user);
  // console.log(req.body);

  console.log(await MongoAddress.findOne({ address: req.body }));
  if (await MongoAddress.findOne({ address: req.body })) {
    res.json("false");
  } else {
    const address = new MongoAddress({
      UserId: user._id,
      address: req.body,
    });
    address.save();
    res.json("true");
  }
};
const ReturnProduct = (req, res) => {
  console.log(req.body);
  MongoOrder.updateOne(
    { _id: ObjectId(req.body.orderid) },
    {
      $set: {
        CancelOrder: 1,
        DeliveryStatus: "canceled",
        PaymentStatus: "refund initiated",
      },
    },
    (s, e) => {
      if (s) console.log(s);
      else console.log(e);
    }
  );
  res.json(true);
};

const addreessdelete = async (req, res) => {
  console.log(req.body);

  await MongoAddress.remove({ _id: ObjectId(req.body.addressid) });

  res.json(true);
};
const addressEditer = async (req, res) => {
  const Address = await MongoAddress.findOne({
    _id: ObjectId(req.query.addressid),
  });
  console.log(Address);
  const user =await MongoUserData.findOne({email:req.session.user})

  res.render("user/EditAddress", {name:user,user: req.session.user,
    Category: await CategoryList(),
    Address: Address.address,
    id: Address,cartdata:await cartdata(req.session.user)
  });
};

const updateaddress = async (req, res) => {
  console.log(req.body);
  await MongoAddress.updateOne(
    { _id: ObjectId(req.body.addressid) },
    {
      "address.firstname": req.body.firstname,
      "address.lastname": req.body.lastname,
      "address.address": req.body.address,
      "address.country": req.body.country,
      "address.city": req.body.city,
      "address.state": req.body.state,
      "address.postcode": req.body.postcode,
      "address.phone": req.body.phone,
      "address.email": req.body.email,
      "address.extra": req.body.extra,
    }
  );
  res.json(true);
};

const wishlistView = async (req, res) => {
  const user = await MongoUser.findOne({ email: req.session.user });

  //   const wish= await MongoWishList.aggregate([{$match:{UserId:user._id}},{$unwind:'$products'},{$project:{product:'$Products'}},{$lookup:{
  //     from:'productdetails',
  //     localField:'Product',
  //     foreignField:'_id',
  //     as:'product'
  // }}])

  const wish = await MongoWishList.aggregate([
    { $match: { UserId: user._id } },
    {
      $lookup: {
        from: "productdetails",
        localField: "Products",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
  ]);
  console.log(wish);


  res.render("user/WishList", {name:user,user: req.session.user,
    Category: await CategoryList(),
    wishlist: wish,cartdata:await cartdata(req.session.user)
  });
};

const WishListControl = async (req, res) => {
  const user = await MongoUser.findOne({ email: req.session.user });
  console.log(req.body);
  const WishUser = await MongoWishList.findOne({ UserId: user._id });
  const wishproduct = await MongoWishList.findOne({
    $and: [{ UserId: user._id }, { Products: req.body.product }],
  });
  console.log(wishproduct);
  if (WishUser) {
    if (wishproduct) {
      await MongoWishList.updateOne(
        { UserId: user._id },
        { $pull: { Products: req.body.product } }
      );
      res.json({ status: "true" });
    } else {
      await MongoWishList.updateOne(
        { UserId: user._id },
        { $push: { Products: req.body.product } }
      );
      res.json({ status: "false" });
    }
  } else {
    const AddWishList = new MongoWishList({
      UserId: ObjectId(user._id),
      Products: req.body.product,
    });
    AddWishList.save();
    res.json({ status: "false" });
  }
};

const removewish = async (req, res) => {
  const user = await MongoUser.findOne({ email: req.session.user });

  await MongoWishList.updateOne(
    { UserId: user._id },
    { $pull: { Products: req.body.ProductId } }
  );

  res.json({
    status: "true",
  });
};


const WalletHistory=async(req,res)=>
{

  const user = await MongoUser.findOne({ email: req.session.user });
const History=await mongowalhis.find({UserId:user._id})
console.log(History);

  res.render("user/WalletHistory",{name:user,user: req.session.user,Category: await CategoryList(),
    cartdata:await cartdata(req.session.user),walhis:History.reverse()})

}




module.exports = {
  SingleOrder,
  MainProfile,
  cancelOrder,
  SaveAddress,
  ReturnProduct,
  addreessdelete,
  addressEditer,
  updateaddress,
  wishlistView,
  WishListControl,
  removewish,
  WalletHistory

};
