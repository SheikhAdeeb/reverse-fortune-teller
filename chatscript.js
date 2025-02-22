const QUESTION_URL = 'http://127.0.0.1:5000/question';
const FORTUNE_URL = 'http://127.0.0.1:5000/fortune';

const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");

// Utility function to create and append a message element
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

// Function to add a bot message to the chat
const addBotMessage = (messageContent) => {
    const botMessage = createMessageElement(`<div class="message-text">${messageContent}</div>`, "bot-message");
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
        // Replace the temporary "thinking" indicator with the generated story
        const thinkingMessage = document.querySelector(".bot-message.thinking");
        if (thinkingMessage) {
            thinkingMessage.classList.remove("thinking");
            thinkingMessage.innerHTML = `<div class="message-text">${data.story}</div>`;
        } else {
            addBotMessage(data.story);
        }
    } catch (error) {
        console.error('Error fetching bot response:', error);
    }
};

// Handle the user sending a message
const handleOutgoingMessage = (userMessage) => {
    // Display the user's message
    const userMsgElement = createMessageElement(`<div class="message-text">${userMessage}</div>`, "user-message");
    chatBody.appendChild(userMsgElement);

    // Clear the input field
    messageInput.value = "";

    // Append a temporary "thinking" indicator for the bot's response
    const thinkingContent = `
        <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
        </svg>
        <div class="message-text">
            <div class="thinking-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `;
    const thinkingMsgElement = createMessageElement(thinkingContent, "bot-message", "thinking");
    chatBody.appendChild(thinkingMsgElement);

    // Call the backend API with the user's message
    generateBotResponse(userMessage);
};

// Listen for the Enter key in the message input field
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage) {
        handleOutgoingMessage(userMessage);
    }
});

// On page load, greet the user and fetch the personality question
document.addEventListener("DOMContentLoaded", async () => {

    // Fetch and display the personality question from the Python backend
    const question = await fetchQuestion();
    addBotMessage(question);
});



// const API_URL = 'http://127.0.0.1:5000/fortune';

// const messageInput = document.querySelector(".message-input");
// const chatBody = document.querySelector(".chat-body");

// const createMessageElement = (content, ...classes) => {
//     const div = document.createElement("div");
//     div.classList.add("message", ...classes);
//     div.innerHTML = content;
//     return div;
// };

// const generateBotResponse = async (userMessage) => {
//     try {
//         // Send the user's answer to the Python backend
//         const response = await fetch(API_URL, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ user_answer: userMessage })
//         });
//         const data = await response.json();
//         // Update the "thinking" message with the actual response
//         const thinkingMessage = document.querySelector(".bot-message.thinking");
//         if (thinkingMessage) {
//             thinkingMessage.classList.remove("thinking");
//             thinkingMessage.innerHTML = `<div class="message-text">${data.story}</div>`;
//         }
//     } catch (error) {
//         console.error('Error fetching bot response:', error);
//     }
// };

// const handleOutgoingMessage = (userMessage) => {
//     // Display the user's message
//     const messageContent = `<div class="message-text">${userMessage}</div>`;
//     const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
//     chatBody.appendChild(outgoingMessageDiv);

//     // Clear the input
//     messageInput.value = ""; 

//     // Add a temporary "thinking" message with a loading indicator
//     const thinkingContent = `
//         <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
//             <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
//         </svg>
//         <div class="message-text">
//             <div class="thinking-indicator">
//                 <div class="dot"></div>
//                 <div class="dot"></div>
//                 <div class="dot"></div>
//             </div>      
//         </div>
//     `;
//     const incomingMessageDiv = createMessageElement(thinkingContent, "bot-message", "thinking");
//     chatBody.appendChild(incomingMessageDiv);

//     // Call the backend API with the user's message
//     generateBotResponse(userMessage);
// };

// messageInput.addEventListener("keydown", (e) => {
//     const userMessage = e.target.value.trim();
//     if (e.key === "Enter" && userMessage) {
//         handleOutgoingMessage(userMessage);
//     }
// });


// // const messageInput = document.querySelector(".message-input");
// // const chatBody = document.querySelector(".chat-body");

// // const API_URL = '';

// // const createMessageElement = (content, ...classes) => {
// //     const div = document.createElement("div");
// //     div.classList.add("message", ...classes);
// //     div.innerHTML = content;
// //     return div;
// // };

// // const generateBotResponse = () => {

// // }

// // const handleOutgoingMessage = (userMessage) => {
// //     const messageContent = `<div class="message-text">${userMessage}</div>`;
// //     const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
// //     chatBody.appendChild(outgoingMessageDiv);

// //     setTimeout(() => {
// //         const messageContent = `<svg class = "bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
// //                     <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
// //                 </svg>
// //                 <div class = "message-text">
// //                     <div class = "thinking-indicator">
// //                         <div class="dot"></div>
// //                         <div class="dot"></div>
// //                         <div class="dot"></div>
// //                     </div>      
// //                 </div>`;

// //     const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
// //     chatBody.appendChild(incomingMessageDiv);
// //     generateBotResponse();
// //     }, 600);
// // }

// // messageInput.addEventListener("keydown", (e) => {
// //     const userMessage = e.target.value.trim();
// //     if (e.key === "Enter" && userMessage) {
// //         handleOutgoingMessage(userMessage);
// //         messageInput.value = ""; 
// //     }
// // });