const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const axios = require('axios');

router.post('/webhook', express.json(), async (req, res) => {
    console.log("RAW TELEGRAM:", JSON.stringify(req.body, null, 2));
  if (req.body.callback_query) {
    const callbackData = req.body.callback_query.data;
    const chatId = req.body.callback_query.message.chat.id;

    const [action, orderId] = callbackData.split('_');

    const order = await Order.findById(orderId).populate('user');

    if (order) {
      if (action === "ACCEPT") {
        order.clientResponse = "Accepted";
        order.status = "Confirmed";
      } else if (action === "REJECT") {
        order.clientResponse = "Rejected";
        order.status = "Rejected";
      }

      await order.save();

      // Respond to client in Telegram
      await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: action === "ACCEPT" ? `✅ Order for ${order.user.username} Accepted` : `❌ Order for ${order.user.username} Rejected`
      });
    }
  }

  res.sendStatus(200);
});


module.exports = router;
