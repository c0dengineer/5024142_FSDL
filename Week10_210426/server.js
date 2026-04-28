require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const connectDB  = require("./db");
const noteRoutes = require("./routes/notes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARE ────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ── DB ────────────────────────────────────────────────
connectDB();

// ── ROUTES ────────────────────────────────────────────
app.use("/api/notes", noteRoutes);

// ── ROOT HEALTH CHECK ─────────────────────────────────
app.get("/", (req, res) => res.send("🌸 Petal Notes API is running"));

// ── START ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});