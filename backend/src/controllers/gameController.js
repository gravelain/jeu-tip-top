const Gain = require("../models/gainsModel");
const Ticket = require("../models/winningTicket");
const User = require("../models/usersModel");
const {
  sendAdminNotification,
  sendPlayerNotification,
  sendPlayerGrandWinnerNotification,
  sendAdminGrandWinnerNotification,
} = require("../config/emailService");

// Enregistrer le gain d'un utilisateur
const recordGameController = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const date = new Date();

    const validFrom = new Date("2025-03-01T00:00:00Z");
    const validUntil = new Date("2025-04-30T23:59:59Z");

    if (date < validFrom || date > validUntil) {
      return res.status(400).json({
        success: false,
        message: "Game is not available.",
      });
    }

    const { ticketNumber } = req.body;
    if (!ticketNumber) {
      return res.status(400).json({ success: false, message: "ticket number is required" });
    }

    const ticket = await Ticket.findOne({ ticketNumber });
    if (!ticket || ticket.isUsed) {
      return res.status(400).json({
        success: false,
        message: "Ticket invalide ou déjà utilisé.",
      });
    }

    const newGain = new Gain({
      userId,
      ticketNumber,
      prizeWon: ticket.prizeWon,
      prizeValue: ticket.prizeValue,
    });

    await newGain.save();
    ticket.isUsed = true;
    await ticket.save();

    await sendPlayerNotification({
      userName: user.userName,
      email: user.email,
      date,
      prizeWon: ticket.prizeWon,
      prizeValue: ticket.prizeValue,
    });

    await sendAdminNotification({
      userName: user.userName,
      email: user.email,
      date,
      prizeWon: ticket.prizeWon,
      prizeValue: ticket.prizeValue,
    });

    return res.status(200).json({
      success: true,
      message: `Congratulations, you won ${ticket.prizeWon} worth ${ticket.prizeValue} euros.`,
    });
  } catch (error) {
   
    return res.status(500).json({ success: false, message: "Error playing game." });
  }
};


const grandTirageController = async (req, res) => {
  try {
    // let date;
    // try {
    //   const response = await axios.get(
    //     "http://worldclockapi.com/api/json/utc/now"
    //   );
    //   date = new Date(response.data.currentDateTime);
    // } catch (error) {
    //   console.error(
    //     " Erreur lors de la récupération de la date :",
    //     error.message
    //   );
    //   return res.status(500).json({
    //     success: false,
    //     message: "Impossible de récupérer la date réelle. Réessayez plus tard.",
    //   });
    // }

    // const dateToPlay = "2025-04-30";
    // const date = new Date();

    // // Comparaison correcte des dates (en format YYYY-MM-DD)
    // if (date !== dateToPlay) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Game is not available.",
    //   });
    // }
    // get a random ticket number from gains collection
    const randomGain = await Gain.aggregate([{ $sample: { size: 1 } }]);
    if (randomGain.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No gains found.",
      });
    }
    //
    const bigWinner = await User.findById(randomGain[0].userId);
    if (!bigWinner) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }
    // send email to big winner
    await sendPlayerGrandWinnerNotification({
      userName: bigWinner.userName,
      email: bigWinner.email,
      date,
      prizeWon: "grand Lot",
      prizeValue: "360 euros",
    });
    // send email to admin
    await sendAdminGrandWinnerNotification({
      userName: bigWinner.userName,
      email: bigWinner.email,
      date,
      prizeWon: "grand Lot",
      prizeValue: "360 euros",
    });
    return res.status(200).json({
      success: true,
      message: `Congratulations, ${bigWinner.userName} is the big winner of the grand lot with 360 euros.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error playing game.",
    });
  }
};
module.exports = { recordGameController, grandTirageController };
