const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

///Models
const User = require("./models/User");
const Task = require("./models/Task");

dotenv.config();

mongoose.connect(
    process.env.DATABASE_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
).then(() => console.log("MongoDB Connected!")).catch(err => console.error("Error connecting to MongoDB" + err));

//Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

///Routes
app.get("/", (req, res) => {
    res.send("Server is running");
});

//REGISTER
app.post("/api/auth/register", async (req, res) => {
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)
    }
});

//LOGIN
app.post("/api/auth/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password")

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
});

//New Task
app.post("/api/task", async (req, res) => {
    const newTask = new Task({
        user: req.body.userId,
        taskName: req.body.taskName,
        taskDetails: req.body.taskDetails,
        estimatedTime: req.body.estimatedTime,
    });

    try {
        const savedTask = await newTask.save();
        res.status(200).json(savedTask);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get all Tasks of a User
app.get("/api/task/:userId", async (req, res) => {
    try {
        const tasks = await Task.find({
            user: { $in: [req.params.userId] }
        });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json(err);
    }
});
