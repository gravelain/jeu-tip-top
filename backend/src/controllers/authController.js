const userModel = require("../models/usersModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../config/emailService');
// Register a new user
const registerUserController = async (req, res) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  try {
    const { userName, email, password, googleId, facebookId, phone, address, userType, answer } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'all fields are required',
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long and include uppercase, lowercase letters and a digit.",
      });
    }
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await userModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'email already exists please login',
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      userName,
      email: normalizedEmail,
      password: hashedPassword,
      googleId,
      facebookId,
      phone,
      address,
      userType,
      answer,
    });

    await sendWelcomeEmail({ userName, email });
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'user created successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'error in register controller',
      error,
    });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'please provide Email OR Password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User Not Found',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.password = undefined;
    console.log("✅ Login réussi :", {
      email: user.email,
      userId: user._id,
      token,
    });

    res.status(200).json({
      success: true,
      message: 'login successful',
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'error in login controller',
      error,
    });
  }
};



// logout user controller
const logoutController = async (req, res) => {
  try {
    await res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'logout successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'error in logout controller',
      error
    });
  }
}

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Vérifier si l'utilisateur existe dans la base de données
    const user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Aucun utilisateur trouvé avec cet email."
      });
    }

    // Générer un token de réinitialisation avec JWT
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enregistrer le token JWT dans la base de données pour vérification ultérieure
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Le token expire dans 1 heure
    await user.save();

    // Construire l'URL de réinitialisation avec le token JWT
    const resetUrl = `http://localhost:4200/reset-password?token=${resetToken}`;

    // Envoyer l'email de réinitialisation
    await sendPasswordResetEmail({
      userName: user.userName,
      email: user.email,
      resetUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Un email de réinitialisation de mot de passe a été envoyé."
    });

  } catch (error) {
    console.error("Erreur dans le controller requestPasswordReset:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la réinitialisation du mot de passe.",
      error: error.message
    });
  }
}

const resetPasswordController = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { token } = req.params;  // Récupération du token depuis les paramètres d'URL

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Les mots de passe ne correspondent pas."
    });
  }

  try {
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token invalide ou expiré."
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Votre mot de passe a été modifié avec succès."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
      error: error.message
    });
  }
};

const changePasswordController = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Les mots de passe ne correspondent pas."
    });
  }

  try {
    const user = req.user; // L'utilisateur est déjà attaché à la requête par l'authMiddleware

    // Vérifier que l'ancien mot de passe est correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "L'ancien mot de passe est incorrect."
      });
    }

    // Hash du nouveau mot de passe
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Votre mot de passe a été changé avec succès."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
      error: error.message
    });
  }
};





module.exports = { registerUserController, loginUserController, logoutController, requestPasswordReset, resetPasswordController, changePasswordController };
