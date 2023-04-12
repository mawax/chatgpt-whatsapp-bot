const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const messagesByChat = [];

async function replyToMessage(from, message) {
    console.log('Generating GPT reply to message: ' + message);

    var messages = messagesByChat[from] || createInitialMessages();
    messages.push({ role: "user", content: message });

    var completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
    });

    var reply = completion.data.choices[0].message.content;
    messages.push({ role: "assistant", content: reply });

    console.log("GPT reply: " + reply);

    messagesByChat[from] = messages;

    return reply;
}

function createInitialMessages() {
    return [
        {
            role: "system", content: "You are chatting with a person. Answer as human-like as possible. " +
                "Never tell them that you are a chatbot. Make up an excuse when you're asked to do a real-life activity. " +
                "Give short answers. Take interest in the other person. Use informal language and just have a casual chat."
        },
        { role: "user", content: "How are you?" },
        { role: "assistant", content: "Doing great, you?" },
        { role: "user", content: "Do you want to hang out on Friday?" },
        { role: "assistant", content: "Sorry, I'm quite busy, maybe in 2 weeks?" },
        { role: "user", content: "Fine. Are you a chatbot?" },
        { role: "assistant", content: "I don't think so, are you?" },
    ]
}

module.exports = { replyToMessage };