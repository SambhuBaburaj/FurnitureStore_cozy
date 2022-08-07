const mongoConnection = require("../Connections/UserSchema");
const bcrypt = require("bcrypt");


//user sighnup post
const New_user = async (req, res) => {
  const duplicate = await mongoConnection.user_data.findOne({
    email: req.body.user_email,
  });
  console.log(req.body.user_email);
  if (duplicate) {
    res.render("user/User-login", { duplicate: "email already exist" });
  } else {

    const hashed = await secure_password(req.body.user_password);

    const new_user = new mongoConnection.user_data({
      username: req.body.username,
      email: req.body.user_email,
      password: hashed,
      phone: req.body.Phone,
      isBlocked:0
    }); 
    new_user.save();
    res.render("user/User-login",{logout:"account created"})
  }
};



//hashing password
const secure_password = async (password) => {
  try {
    const password_hash = await bcrypt.hash(password, 10);
    return password_hash;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  New_user,
};
