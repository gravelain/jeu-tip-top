const { sendAdminContactNotification, sendUserContactNotification } = require('../config/emailService');

const contactController = async (req, res) => {
  try {
    // Extraction des informations envoyées par le formulaire de contact
    const { userName, email, subject, message } = req.body;

    if (!userName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs (nom, email, sujet et message) sont requis."
      });
    }

    // Notifier l'administrateur
    await sendAdminContactNotification({ userName, email, subject, message });

    // Notifier l'utilisateur
    await sendUserContactNotification({ userName, email, subject });

    return res.status(200).json({
      success: true,
      message: "Votre message a bien été envoyé avec succès !"
    });
  } catch (error) {
    console.error("Erreur dans le controller contact:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du message.",
      error: error.message
    });
  }
};

module.exports = { contactController };
