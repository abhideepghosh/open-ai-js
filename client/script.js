import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

// Creating Loader Of Chat Container
const loader = (element) => {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
};

// Text Typing Functionality By AI
const typeText = (element, text) => {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
};

// Generate Unique ID
const generateUniqueId = () => {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timeStamp}-${hexadecimalString}`;
};

// Message By User Or AI
const chatStripe = (isAi, value, uniqueId) => {
  return `
      <div class="wrapper ${isAi && "ai"}">
        <div class="chat">
          <div class="profile">
            <img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}"/>
          </div>
          <div class="message" id="${uniqueId}">${value}</div>
        </div>
      </div>
    `;
};

// Send Message To AI
const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // User's ChatStripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  form.reset();

  // Bot's ChatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // Scroll Down To The Current Message
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  // Fetch Data From The Server -> Bot's Response
  const response = await fetch("https://ai-codewizard.onrender.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";
  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
