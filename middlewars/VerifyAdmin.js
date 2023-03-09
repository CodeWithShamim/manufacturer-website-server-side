const getDB = require("../utils/database");

module.exports = async (req, res, next) => {
  const email = req.params.email;
  const filter = { email: email };
  const db = await getDB();
  const user = await db.userCollection.findOne(filter);
  const isAdmin = user?.role === "admin";
  if (isAdmin) {
    next();
  } else {
    return res.send(false);
  }
};
