const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { registerUserController, loginUserController, logoutController, requestPasswordReset, resetPasswordController, changePasswordController } = require("../controllers/authController");


//register user
router.post('/register', registerUserController);

//login user
router.post('/login', loginUserController); 

//logout user
router.post('/logout', authMiddleware, logoutController);

router.post('/request-reset', requestPasswordReset);

router.post('/reset-password', resetPasswordController);

router.post('/change-password', authMiddleware, changePasswordController);

module.exports = router;