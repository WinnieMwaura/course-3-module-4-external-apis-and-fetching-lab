// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

// DOM elements
const input = document.getElementById("state-input");
const button = document.getElementById("fetch-alerts");
const display = document.getElementById("alerts-display");
const errorBox = document.getElementById("error-message");

// Fetch weather alerts from API
async function fetchWeatherData(state) {
  if (!state) {
    throw new Error("Please enter a state abbreviation.");
  }

  const response = await fetch(`${weatherApi}${state}`);

  if (!response.ok) {
    throw new Error("Failed to fetch weather alerts.");
  }

  const data = await response.json();
  return data;
}

// Display weather alerts
function displayWeather(data) {
  const state = input.dataset.lastState || input.value;
  const count = data.features ? data.features.length : 0;

  // Clear previous UI + errors
  display.innerHTML = "";
  errorBox.textContent = "";
  errorBox.classList.add("hidden");

  const title = document.createElement("h2");
  title.textContent = `Current watches, warnings, and advisories for ${state}: ${count}`;

  display.appendChild(title);

  // Optional: list alerts
  if (count > 0) {
    const list = document.createElement("ul");

    data.features.forEach((alert) => {
      const item = document.createElement("li");
      item.textContent = alert.properties?.headline || "No details available";
      list.appendChild(item);
    });

    display.appendChild(list);
  }
}

// Display error messages
function displayError(message) {
  display.innerHTML = "";
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

// Handle button click
button.addEventListener("click", async () => {
  const state = input.value.trim();

  // clear input immediately (required by tests)
  input.value = "";

  try {
    const data = await fetchWeatherData(state);

    // store last state for display use
    input.dataset.lastState = state;

    displayWeather(data);
  } catch (error) {
    displayError(error.message);
  }
});