/** @format */

module.exports = reqFilter = (req, res, next) => {
  //reqFilter ek function hai jo parms mai req,res,next leta ha next ek function hai jab tak next call nhi hoga code aage nhi bdega
  if (!req.query.age) {
    res.send("Please Enter tha age");
  } else if (req.query.age < 18) {
    res.send("you can't not Acess the Website");
  } else {
    next();
  }
  next();
  //use of middlewear pahle age put kro fir age 18 se kam hai to nhi acess hogi aur next ko else mai put krna hai nhi to error aayegi
};
