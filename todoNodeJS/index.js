const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
  })
  .catch((err) => console.error("Error connecting to database:", err));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const tasks = await TodoTask.find({}).exec();
    res.render("todo.ejs", { todoTasks: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
});

app
  .route("/edit/:id")
  .get(async (req, res) => {
    const id = req.params.id;
    try {
      const tasks = await TodoTask.find({}).exec();
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).send("Internal Server Error");
    }
  })
  .post(async (req, res) => {
    const id = req.params.id;
    try {
      await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
      res.redirect("/");
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).send("Internal Server Error");
    }
  });

app
    .route("/remove/:id")
    .get(async (req, res) => {
        const id = req.params.id;
        try {
            await TodoTask.findByIdAndDelete(id);
            res.redirect("/");
        } catch (error) {
            console.error("Error deleting task:", error);
            res.status(500).send("Internal Server Error");
        }
    })