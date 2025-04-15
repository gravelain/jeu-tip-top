const transporter = require('./transporter');

/**
 * @param {Object} mailOptions - Options de l'email (from, to, subject, text, html, envelope)
 * @returns {Promise} - La promesse renvoyée par transporter.sendMail.
 */
const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email envoyé à ${mailOptions.to} :`, info.response);
    return info;
  } catch (error) {
    console.error(`Erreur lors de l'envoi d'un email à ${mailOptions.to} :`, error);
    throw error;
  }
};

/**
 * Envoie un email de notification à l'administrateur.
 * @param {Object} params - Paramètres nécessaires pour configurer l'email.
 * @param {string} params.userName - Nom du participant.
 * @param {string} params.email - Email du participant.
 * @param {string} params.date - Date de participation.
 * @param {string} params.prizeWon - Lot gagné.
 * @param {string|number} params.prizeValue - Valeur du lot.
 * @returns {Promise}
 */
const sendAdminNotification = async ({ userName, email, date, prizeWon, prizeValue }) => {
  const mailOptions = {
    from: `${userName} <${email}>`,   // Affiché dans l'en-tête "From:"
    to: 'thierry.temgoua98@gmail.com',     // Email de l'administrateur
    subject: `Nouveau participant au concours Thé Tip Top : ${userName}`,
    text: `Bonjour,

Un nouveau participant vient de jouer le ${date} dans le concours Thé Tip Top.
Détails :
- Nom : ${userName}
- Email : ${email}
- Lot gagné : ${prizeWon}
- Valeur du lot : ${prizeValue} euros

Cordialement,
L'équipe Thé Tip Top`,
    html: `
      <h3>Nouveau participant au concours Thé Tip Top</h3>
      <p><strong>Date de participation :</strong> ${date}</p>
      <p><strong>Nom :</strong> ${userName}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Lot gagné :</strong> ${prizeWon}</p>
      <p><strong>Valeur du lot :</strong> ${prizeValue} euros</p>
      <p>Cordialement,<br>L'équipe Thé Tip Top</p>
    `,
    envelope: {
      from: process.env.EMAIL_USER,
      to: 'thierry.temgoua98@gmail.com'
    }
  };

  return sendEmail(mailOptions);
};

/**
 * Envoie un email de félicitations au participant.
 * @param {Object} params - Paramètres nécessaires pour configurer l'email.
 * @param {string} params.userName - Nom du participant.
 * @param {string} params.email - Email du participant.
 * @param {string} params.date - Date de participation.
 * @param {string} params.prizeWon - Lot gagné.
 * @param {string|number} params.prizeValue - Valeur du lot.
 * @returns {Promise}
 */
const sendPlayerNotification = async ({ userName, email, date, prizeWon, prizeValue }) => {
  const mailOptions = {
    from: `Thé Tip Top <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Félicitations, vous avez gagné dans le concours Thé Tip Top !',
    text: `Bonjour ${userName},

Félicitations ! Vous venez de gagner dans le concours Thé Tip Top.
Détails de votre gain :
- Date de participation : ${date}
- Lot : ${prizeWon}
- Valeur : ${prizeValue} euros

Merci pour votre participation.

Cordialement,
L'équipe Thé Tip Top`,
    html: `
      <p>Bonjour ${userName},</p>
      <p>Félicitations ! Vous venez de gagner dans le concours <strong>Thé Tip Top</strong>.</p>
      <p><strong>Date de participation :</strong> ${date}</p>
      <p><strong>Lot :</strong> ${prizeWon}</p>
      <p><strong>Valeur :</strong> ${prizeValue} euros</p>
      <p>Merci pour votre participation.</p>
      <p>Cordialement,<br>L'équipe Thé Tip Top</p>
    `,
    envelope: {
      from: process.env.EMAIL_USER,
      to: email
    }
  };

  return sendEmail(mailOptions);
};

/**
 * Envoie un email de bienvenue à un nouvel utilisateur après inscription.
 * @param {Object} params - Informations de l'utilisateur.
 * @param {string} params.userName - Nom de l'utilisateur.
 * @param {string} params.email - Email de l'utilisateur.
 * @returns {Promise}
 */
const sendWelcomeEmail = async ({ userName, email }) => {
  const mailOptions = {
    from: `Thé Tip Top <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Bienvenue dans l’univers Thé Tip Top ! 🌿',
    text: `Bonjour ${userName},

        Nous vous souhaitons la bienvenue dans la communauté Thé Tip Top 🍵.

        Merci de votre inscription. Vous pouvez dès maintenant participer à nos concours, gagner des cadeaux, et profiter de nos offres exclusives !

        Restez connectés, et encore bienvenue parmi nous 😊

Cordialement,
L'équipe Thé Tip Top`,
    html: `
      <p>Bonjour <strong>${userName}</strong>,</p>
      <p>Nous vous souhaitons la bienvenue dans la communauté <strong>Thé Tip Top</strong> 🍵.</p>
      <p>Merci de votre inscription. Vous pouvez dès maintenant participer à nos concours, gagner des cadeaux, et profiter de nos offres exclusives !</p>
      <p>Restez connectés, et encore bienvenue parmi nous 😊</p>
      <p>Cordialement,<br><em>L'équipe Thé Tip Top</em></p>
    `,
    envelope: {
      from: process.env.EMAIL_USER,
      to: email
    }
  };

  return sendEmail(mailOptions); //
};




/**
 * Notifie l'administrateur qu'un utilisateur a envoyé un message via la page contact.
 * @param {Object} params - Les paramètres nécessaires.
 * @param {string} params.userName - Nom de l'utilisateur.
 * @param {string} params.email - Email de l'utilisateur.
 * @param {string} params.subject - Sujet du message.
 * @param {string} params.message - Le contenu du message.
 * @returns {Promise}
 */
const sendAdminContactNotification = async ({ userName, email, subject, message }) => {
  const mailOptions = {
    from: `${userName} <${email}>`,
    to: 'thierry.temgoua98@gmail.com', // email de l'administrateur
    subject: `Nouveau message de contact : ${subject}`,
    text: `Vous avez reçu un nouveau message de la part de ${userName} (${email}) :

Sujet : ${subject}

Message :
${message}

Cordialement,
Votre site.`,
    html: `
      <h3>Nouveau message de contact</h3>
      <p><strong>De :</strong> ${userName} (<em>${email}</em>)</p>
      <p><strong>Sujet :</strong> ${subject}</p>
      <p><strong>Message :</strong><br>${message}</p>
      <p>Cordialement,<br>Votre site.</p>
    `,
    envelope: {
      from: process.env.EMAIL_USER,
      to: 'thierry.temgoua98@gmail.com'
    }
  };

  return sendEmail(mailOptions);
};

/**
 * Envoie un email de confirmation à l'utilisateur après l'envoi de son message.
 * @param {Object} params - Les paramètres nécessaires.
 * @param {string} params.userName - Nom de l'utilisateur.
 * @param {string} params.email - Email de l'utilisateur.
 * @param {string} params.subject - Sujet du message envoyé.
 * @returns {Promise}
 */
const sendUserContactNotification = async ({ userName, email, subject }) => {
  const mailOptions = {
    from: `Thé Tip Top <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Nous avons bien reçu votre message',
    text: `Bonjour ${userName},

Nous confirmons la réception de votre message concernant : "${subject}".
Nous reviendrons vers vous dans les plus brefs délais.

Cordialement,
L'équipe Thé Tip Top`,
    html: `
      <p>Bonjour <strong>${userName}</strong>,</p>
      <p>Nous confirmons la réception de votre message concernant : "<strong>${subject}</strong>".</p>
      <p>Nous reviendrons vers vous dans les plus brefs délais.</p>
      <p>Cordialement,<br>L'équipe Thé Tip Top</p>
    `,
    envelope: {
      from: process.env.EMAIL_USER,
      to: email
    }
  };

  return sendEmail(mailOptions);
};

/**
 * Envoie un email de réinitialisation de mot de passe.
 * @param {Object} params - Les paramètres nécessaires.
 * @param {string} params.userName - Nom de l'utilisateur.
 * @param {string} params.email - Email de l'utilisateur.
 * @param {string} params.resetUrl - URL pour la réinitialisation du mot de passe.
 * @returns {Promise}
 */
const sendPasswordResetEmail = async ({ userName, email, resetUrl }) => {
  const mailOptions = {
    from: `Thé Tip Top <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    text: `Bonjour ${userName},

Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : ${resetUrl}

Si vous n'avez pas demandé la réinitialisation, veuillez ignorer cet email.

Cordialement,
L'équipe Thé Tip Top`,
    html: `
      <p>Bonjour <strong>${userName}</strong>,</p>
      <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : <a href="${resetUrl}">${resetUrl}</a></p>
      <p>Si vous n'avez pas demandé la réinitialisation, veuillez ignorer cet email.</p>
      <p>Cordialement,<br>L'équipe Thé Tip Top</p>
    `,
    envelope: {
      from: process.env.EMAIL_USER,
      to: email
    }
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendAdminNotification,
  sendPlayerNotification,
  sendWelcomeEmail,
  sendAdminContactNotification,
  sendUserContactNotification,
  sendPasswordResetEmail
};