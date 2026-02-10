// ================= VARIABLES & OPERATORS =================
let userName = "Guest";
let gamesCreated = 3;
let bonus = 2;
let totalGames = gamesCreated + bonus;

// ================= CONDITIONS =================
const heroText = document.getElementById("heroText");

if (totalGames >= 5) {
  heroText.innerText = "Welcome back, " + userName + "! You are a Pro Game Creator 🎮";
} else {
  heroText.innerText = "Welcome! Start creating or playing your first game 🚀";
}

// ================= LOOPS =================
let sampleGames = ["Dota 2", "Zombie Escape", "Pixel Racer", "Space Runner", "Alien Attack"];

for (let i = 0; i < sampleGames.length; i++) {
  console.log("Game " + (i + 1) + ": " + sampleGames[i]);
}

// ================= FUNCTIONS =================
function showFeature(featureName) {
  document.getElementById("featureMessage").innerText =
    "You selected: " + featureName + ". This feature makes game development easier and faster!";
}

function showPlatform(platform) {
  alert("You selected platform: " + platform);
}

function downloadGame() {
  alert("Downloading game engine... Please wait!");
}

function tryOnline() {
  alert("Launching online game editor...");
}

function visitSite() {
  window.open("https://gdevelop.io", "_blank");
}

function refreshPage() {
  location.reload();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// ================= EVENTS =================
document.getElementById("downloadHeroBtn").addEventListener("click", downloadGame);
document.getElementById("tryBtn").addEventListener("click", tryOnline);
document.getElementById("visitBtn").addEventListener("click", visitSite);
document.getElementById("refreshBtn").addEventListener("click", refreshPage);
document.getElementById("fullscreenBtn").addEventListener("click", toggleFullscreen);

// Feature cards click
document.querySelectorAll(".feature-card").forEach(card => {
  card.addEventListener("click", () => {
    const featureName = card.getAttribute("data-feature");
    showFeature(featureName);
  });
});

// Platform icons click
document.querySelectorAll(".store-icons img").forEach(icon => {
  icon.addEventListener("click", () => {
    const platform = icon.getAttribute("data-platform");
    showPlatform(platform);
  });
});

// ================= LOGIN SYSTEM =================
const loginForm = document.getElementById("loginForm");
const loginModal = document.getElementById("loginModal");
const authSection = document.getElementById("authSection");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username.length >= 3 && password.length >= 4) {
    userName = username;

    authSection.innerHTML = `
      <span class="text-light">Hi, ${userName}</span>
      <button class="btn btn-outline-light btn-sm rounded-pill px-3" id="logoutBtn">Logout</button>
    `;

    bootstrap.Modal.getInstance(loginModal).hide();
    heroText.innerText = "Welcome, " + userName + "! Ready to play some games? 🎮";

    document.getElementById("logoutBtn").addEventListener("click", logoutUser);
  } else {
    alert("Invalid login. Try again.");
  }
});

function logoutUser() {
  userName = "Guest";
  authSection.innerHTML = `
    <button class="btn btn-outline-light btn-sm rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#loginModal">
      Sign In
    </button>
  `;
  heroText.innerText = "You are logged out. Please sign in to play games.";
}

// ================= PLAY BUTTON LOGIC =================
document.querySelectorAll(".play-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (userName === "Guest") {
      alert("Please sign in to play this game!");
    } else {
      const gameName = btn.getAttribute("data-game");
      alert("Launching " + gameName + " for " + userName + " 🎮");
    }
  });
});

// ================= CLASSES & OBJECTS =================
class Game {
  constructor(name, genre, rating) {
    this.name = name;
    this.genre = genre;
    this.rating = rating;
  }

  displayInfo() {
    return `${this.name} | Genre: ${this.genre} | Rating: ${this.rating}/5`;
  }
}

let game1 = new Game("Dota 2", "MOBA", 4.8);
let game2 = new Game("Zombie Escape", "Action", 4.2);
let game3 = new Game("Pixel Racer", "Racing", 4.6);

let games = [game1, game2, game3];

games.forEach(game => {
  console.log(game.displayInfo());
});
