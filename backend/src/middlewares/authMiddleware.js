const jwt = require("jsonwebtoken");
const User = require("../models/usersModel"); 

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("📩 Token reçu dans authMiddleware :", token);
    console.log("🔍 Token décodé :", decoded);

    const allUsers = await User.find({}, "_id email");
    console.log("🧪 Tous les users en base :", allUsers);

    const user = await User.findById(decoded.userId).select("-password");
    console.log("👤 Utilisateur trouvé :", user);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
      error: error.message,
    });
  }
};



module.exports = { authMiddleware };
