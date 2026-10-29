const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URL = "mongodb://mongodb:27017";
const DB_NAME = "task_app_manager";

const client = new MongoClient(MONGO_URL);

let tasksCollection;

async function startServer() {

  await client.connect();

  const db = client.db(DB_NAME);

  tasksCollection = db.collection("tasks");

  console.log("Connected to MongoDB");

  app.listen(5500, "0.0.0.0", () => {
    console.log("Task API running on port 5500");
  });

}

app.get("/", (req, res) => {
  res.send("Cloud Task Manager Backend");
});

app.get("/api/tasks", async (req, res) => {

  const tasks = await tasksCollection
    .find({})
    .toArray();

  res.json(tasks);

});

app.post("/api/tasks", async (req, res) => {

  const task = {
    id: Date.now(),
    title: req.body.title,
    completed: false
  };

  await tasksCollection.insertOne(task);

  res.json(task);

});

app.put("/api/tasks/:id", async (req, res) => {

  const id = Number(req.params.id);

  const task = await tasksCollection.findOne({ id });

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  const completed = !task.completed;

  await tasksCollection.updateOne(
    { id },
    { $set: { completed } }
  );

  res.json({
    ...task,
    completed
  });

});

app.delete("/api/tasks/:id", async (req, res) => {

  const id = Number(req.params.id);

  await tasksCollection.deleteOne({ id });

  res.json({
    message: "Task deleted"
  });

});

app.delete("/api/tasks", async (req, res) => {
    try {
        await tasksCollection.deleteMany({});

        res.json({
            message: "All tasks deleted"
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete all tasks"
        });
    }
});

startServer().catch(error => {

  console.error("Failed to start server:", error);

  process.exit(1);

});

