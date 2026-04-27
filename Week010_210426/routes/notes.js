const express = require("express");
const router  = express.Router();
const Note    = require("../models/Note");

// ➕ CREATE
router.post("/", async (req, res) => {
    try {
        const note = await Note.create({ text: req.body.text });
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📖 READ ALL
router.get("/", async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📄 READ ONE
router.get("/:id", async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✏️ UPDATE
router.put("/:id", async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            { text: req.body.text },
            { new: true, runValidators: true }
        );
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🗑️ DELETE ONE
router.delete("/:id", async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.json({ message: "Deleted", id: req.params.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🧹 DELETE ALL
router.delete("/", async (req, res) => {
    try {
        await Note.deleteMany({});
        res.json({ message: "All notes deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;