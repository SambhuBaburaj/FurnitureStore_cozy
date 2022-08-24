const ProductStore = require("../Connections/AdminSchema").Products;
const MongoCategory = require("../Connections/AdminSchema").MainCategory;
const MongoCart = require("../Connections/UserSchema").CartData;
const MongoOrder = require("../Connections/UserSchema").OrderDetails;
const MongoUser = require("../Connections/UserSchema").user_data;
const session = require("express-session");
const { ObjectId } = require("mongodb");

const CategoryList = async () => {
  return await MongoCategory.find();
};

const MainProfile = async (req, res) => {
  const user = await MongoUser.findOne({ email: req.session.user });
  const UserOrder = await MongoOrder.find({ userId: user._id });
  console.log(UserOrder);
  res.render("user/User-profile", {
    Category: await CategoryList(),
    Orders: UserOrder,
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
      }
    },{$project:{Quantity: 1,product: { $arrayElemAt: ['$productdata',0]}}}

  ]);
  console.log(orderDetails);

  res.render("user/YourOrders", { Category: await CategoryList(),productdata:ProductDetails,orderDetails:orderDetails });
};

module.exports = {
  SingleOrder,
  MainProfile,
};
