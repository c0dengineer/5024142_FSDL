const API = "http://bookish-doodle-4j9wrwpx755c57g6-5000.app.github.dev/api/notes";


let allNotes = [];
let editingId = null;
const MAX_CHARS = 300;

// ── INIT ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
    initCharCounter();
    initTheme();
});

// ── CHAR COUNTER ──────────────────────────────────────
function initCharCounter() {
    const textarea = document.getElementById("noteInput");
    const counter  = document.getElementById("charCount");
    textarea.addEventListener("input", () => {
        const len = textarea.value.length;
        counter.textContent = `${len} / ${MAX_CHARS}`;
        counter.classList.toggle("over", len > MAX_CHARS);
    });
}

// ── SUBMIT (ADD or UPDATE) ────────────────────────────
async function submitNote() {
    const input = document.getElementById("noteInput");
    const text  = input.value.trim();

    if (!text) return showToast("✏️ Please write something first!");
    if (text.length > MAX_CHARS) return showToast("❌ Note is too long!");

    if (editingId) {
        // UPDATE existing note
        await fetch(`${API}/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });
        showToast("✅ Note updated!");
        cancelEdit();
    } else {
        // CREATE new note
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });
        showToast("🌸 Note added!");
    }

    input.value = "";
    document.getElementById("charCount").textContent = `0 / ${MAX_CHARS}`;
    loadNotes();
}

// ── LOAD NOTES ────────────────────────────────────────
async function loadNotes() {
    try {
        const res = await fetch(API);
        allNotes = await res.json();
        applyFilterAndSort();
    } catch {
        showToast("⚠️ Could not reach server");
    }
}

// ── APPLY FILTER + SORT ───────────────────────────────
function applyFilterAndSort() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const sort  = document.getElementById("sortSelect").value;

    let notes = allNotes.filter(n => n.text.toLowerCase().includes(query));

    if (sort === "oldest")      notes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sort === "az")     notes.sort((a, b) => a.text.localeCompare(b.text));
    else                        notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    renderNotes(notes);
}

// ── SEARCH ────────────────────────────────────────────
function searchNotes() {
    const query = document.getElementById("searchInput").value;
    document.getElementById("clearSearch").style.display = query ? "block" : "none";
    applyFilterAndSort();
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("clearSearch").style.display = "none";
    applyFilterAndSort();
}

// ── RENDER NOTES ─────────────────────────────────────
function renderNotes(notes) {
    const container = document.getElementById("notesContainer");
    const empty     = document.getElementById("emptyState");
    const countEl   = document.getElementById("noteCount");
    const delAllBtn = document.getElementById("deleteAllBtn");

    countEl.textContent = `${allNotes.length} note${allNotes.length !== 1 ? "s" : ""}`;
    delAllBtn.style.display = allNotes.length > 0 ? "inline-block" : "none";

    if (notes.length === 0) {
        container.innerHTML = "";
        empty.style.display = "flex";
        empty.style.flexDirection = "column";
        empty.style.alignItems = "center";
        return;
    }
    empty.style.display = "none";

    container.innerHTML = "";
    notes.forEach(note => {
        const age   = getAge(note.createdAt);
        const isNew = Date.now() - new Date(note.createdAt) < 60000;

        const div = document.createElement("div");
        div.className = "note";
        div.id = `note-${note._id}`;

        div.innerHTML = `
            <div class="note-body">
                <div class="note-text-wrap">
                    <div class="note-text" id="text-${note._id}">${escapeHtml(note.text)}</div>
                </div>
                <div class="note-actions">
                    <button class="icon-btn" onclick="startEdit('${note._id}')" title="Edit">✏️</button>
                    <button class="icon-btn" onclick="toggleDone('${note._id}')" title="Mark done">✅</button>
                    <button class="icon-btn delete" onclick="deleteNote('${note._id}')" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="note-meta">
                <span class="note-date">🕐 ${age}</span>
                ${isNew ? '<span class="note-badge">New ✨</span>' : ""}
            </div>
        `;
        container.appendChild(div);
    });
}

// ── INLINE EDIT ───────────────────────────────────────
function startEdit(id) {
    const note     = allNotes.find(n => n._id === id);
    if (!note) return;
    const noteEl   = document.getElementById(`note-${id}`);
    const textEl   = document.getElementById(`text-${id}`);

    // Replace text with textarea
    textEl.style.display = "none";
    noteEl.classList.add("editing");

    const area = document.createElement("textarea");
    area.className = "edit-area";
    area.value = note.text;
    area.rows  = Math.max(2, note.text.split("\n").length);
    area.id    = `edit-area-${id}`;
    textEl.parentNode.insertBefore(area, textEl.nextSibling);
    area.focus();

    const controls = document.createElement("div");
    controls.className = "edit-controls";
    controls.id = `edit-controls-${id}`;
    controls.innerHTML = `
        <button class="btn btn-ghost" onclick="cancelInlineEdit('${id}')">Cancel</button>
        <button class="btn btn-primary" onclick="saveInlineEdit('${id}')">Save 💾</button>
    `;
    noteEl.appendChild(controls);
}

async function saveInlineEdit(id) {
    const area = document.getElementById(`edit-area-${id}`);
    const text = area.value.trim();
    if (!text) return showToast("✏️ Note can't be empty");
    if (text.length > MAX_CHARS) return showToast("❌ Note is too long!");

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });
    showToast("💾 Saved!");
    loadNotes();
}

function cancelInlineEdit(id) {
    const noteEl   = document.getElementById(`note-${id}`);
    const textEl   = document.getElementById(`text-${id}`);
    const area     = document.getElementById(`edit-area-${id}`);
    const controls = document.getElementById(`edit-controls-${id}`);

    noteEl.classList.remove("editing");
    textEl.style.display = "";
    if (area)     area.remove();
    if (controls) controls.remove();
}

// ── TOP-FORM EDIT (alt path) ──────────────────────────
function cancelEdit() {
    editingId = null;
    document.getElementById("noteInput").value = "";
    document.getElementById("submitBtn").textContent = "+ Add Note";
    document.getElementById("cancelBtn").style.display = "none";
    document.getElementById("charCount").textContent = `0 / ${MAX_CHARS}`;
}

// ── TOGGLE DONE ───────────────────────────────────────
function toggleDone(id) {
    const textEl = document.getElementById(`text-${id}`);
    if (textEl) textEl.classList.toggle("strikethrough");
}

// ── DELETE ONE ────────────────────────────────────────
async function deleteNote(id) {
    if (!confirm("Remove this note? 🌸")) return;

    const noteEl = document.getElementById(`note-${id}`);
    if (noteEl) {
        noteEl.style.transition = "opacity .3s, transform .3s";
        noteEl.style.opacity    = "0";
        noteEl.style.transform  = "scale(.95)";
        await new Promise(r => setTimeout(r, 280));
    }

    await fetch(`${API}/${id}`, { method: "DELETE" });
    showToast("🗑️ Note deleted");
    loadNotes();
}

// ── DELETE ALL ────────────────────────────────────────
async function deleteAll() {
    if (!confirm(`Delete all ${allNotes.length} notes? This can't be undone 💔`)) return;
    await fetch(API, { method: "DELETE" });
    showToast("🧹 All notes cleared");
    loadNotes();
}

// ── THEME ─────────────────────────────────────────────
function initTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        document.querySelector(".theme-btn").textContent = "🌙";
    }
}
function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");
    document.querySelector(".theme-btn").textContent = isDark ? "🌙" : "☀️";
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

// ── TOAST ─────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

// ── HELPERS ───────────────────────────────────────────
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function getAge(dateStr) {
    const diff = Date.now() - new Date(dateStr);
    const s = Math.floor(diff / 1000);
    if (s < 60)   return "just now";
    const m = Math.floor(s / 60);
    if (m < 60)   return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24)   return `${h}h ago`;
    return new Date(dateStr).toLocaleDateString();
}

// ── KEYBOARD SHORTCUT (Ctrl+Enter to submit) ──────────
document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submitNote();
});