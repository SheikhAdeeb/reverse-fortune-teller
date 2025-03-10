const QUESTION_URL = 'http://127.0.0.1:5000/question';
const FORTUNE_URL = 'http://127.0.0.1:5000/fortune';

const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");

// WORKS
// Utility function to create and append a message element
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

// Function to add a bot message to the chat
const addBotMessage = (messageContent) => {
    const botMessage = createMessageElement(
        `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
        </svg>
        <div class="message-text">${messageContent}</div>`,
        "bot-message"
    );
    chatBody.appendChild(botMessage);
};

// Fetch the personality question from the Python backend
const fetchQuestion = async () => {
    try {
        const response = await fetch(QUESTION_URL);
        const data = await response.json();
        return data.question;
    } catch (error) {
        console.error('Error fetching question:', error);
        return "Sorry, I'm having trouble finding a question right now.";
    }
};

// Send the user's answer to the Python backend and get the reverse fortune
const generateBotResponse = async (userAnswer) => {
    try {
        const response = await fetch(FORTUNE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_answer: userAnswer })
        });

        const data = await response.json();

        // Remove the "thinking" indicator and show the story
        const thinkingMessage = document.querySelector(".bot-message.thinking");
        if (thinkingMessage) {
            thinkingMessage.classList.remove("thinking");
            thinkingMessage.innerHTML = `<div class="message-text">${data.story}</div>`;
        } else {
            addBotMessage(data.story);
        }

        // Ask if the user wants to continue
        setTimeout(() => {
            addBotMessage("Do you want to continue? Type 'continue' or 'quit'.");
        }, 1000); // Delay slightly for a natural flow

    } catch (error) {
        console.error('Error fetching bot response:', error);
    }
};

// Handle the user sending a message
const handleOutgoingMessage = async (userMessage) => {
    // Display the user's message
    const userMsgElement = createMessageElement(`<div class="message-text">${userMessage}</div>`, "user-message");
    chatBody.appendChild(userMsgElement);

    // Clear the input field
    messageInput.value = "";

    // Handle special responses
    if (userMessage.toLowerCase() === "quit") {
        setTimeout(() => {
            addBotMessage("Goodbye! Have a great day! 😊");
        }, 500);
        return; // Stop further processing
    }

    if (userMessage.toLowerCase() === "continue") {
        setTimeout(async () => {
            const newQuestion = await fetchQuestion();
            addBotMessage(newQuestion);
        }, 1000);
        return;
    }

    // Append a temporary "thinking" indicator for the bot's response
    const thinkingContent = `<div class="message-text">
        <div class="thinking-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    </div>`;
    const thinkingMsgElement = createMessageElement(thinkingContent, "bot-message", "thinking");
    chatBody.appendChild(thinkingMsgElement);

    // Call the backend API with the user's message
    generateBotResponse(userMessage);
};

// Listen for the Enter key in the message input field
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();

        const userMessage = e.target.value.trim();
        if (userMessage) {
            handleOutgoingMessage(userMessage);
        }
    }
});

// On page load, greet the user and fetch the personality question
document.addEventListener("DOMContentLoaded", async () => {
    // Fetch and display the personality question from the Python backend
    const question = await fetchQuestion();
    addBotMessage(question);
});