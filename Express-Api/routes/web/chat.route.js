//chatbot --> static(rule based chatbot)
const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/chat.controller');
const userMiddleware = require('../../middlewares/user.middleware');

//rule based chatbot
router.post("/chat" ,chatController.StaticBot);

//ai based chatbot
router.post("/chat/ai" ,userMiddleware.authUser ,chatController.AIBot);


module.exports = router;