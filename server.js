const express = require("express");
const cors = require("cors");
const { randomUUID } = require("node:crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let tasks = [];

app.get("/", (req, res) => {
    res.json({
        service: "Task Management API",
        version: "1.0.0",
        status: "running"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        uptime: process.uptime()
    });
});

app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

app.get("/api/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
});

app.post("/api/tasks", (req, res) => {
    const { title, description = "" } = req.body || {};

    if (typeof title !== "string" || !title.trim() ||
        typeof description !== "string") {
        return res.status(400).json({
            error: "A valid title and description are required"
        });
    }

    const task = {
        id: randomUUID(),
        title: title.trim(),
        description,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    res.status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    const { title, description, completed } = req.body || {};

    if (title !== undefined &&
        (typeof title !== "string" || !title.trim())) {
        return res.status(400).json({ error: "Invalid title" });
    }

    if (description !== undefined &&
        typeof description !== "string") {
        return res.status(400).json({ error: "Invalid description" });
    }

    if (completed !== undefined &&
        typeof completed !== "boolean") {
        return res.status(400).json({ error: "Invalid status" });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;

    task.updatedAt = new Date().toISOString();

    res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
    const index = tasks.findIndex(t => t.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    tasks.splice(index, 1);
    res.status(204).end();
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`API running at http://localhost:${PORT}`);
});
