require('dotenv').config();
const openai = require('./openai-api');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    var chat = await client.getChatById(msg.from);
    chat.sendStateTyping();

    var response = await openai.replyToMessage(msg.from, msg.body);
    chat.sendMessage(response);
});

client.initialize();