const express = require("express");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const Tache = require("./models/Tache");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
//connection to db
mongoose.connect("mongodb://127.0.0.1:27017/taches");
const db = mongoose.connection;

db.on("error", () => {
  console.log("Error");
});

db.once("open", () => {
  console.log("Connection with success");
});
//la liste des taches
app.get("/tasks", async (req, res) => {
  try {
    const taches = await Tache.find().exec();
    return res.status(200).json({ message: "voila la liste \n ", taches });
  } catch (err) {
    //console.log(err)
    return res.status(500).json({
      message: "Error interne du serveur",
    });
  }
});
//ajouter une tache 
app.post("/tasks", [
    check("title", "Le titre de tache est  requis.").not().isEmpty(),
    check("description", "La description de tache est  requise.").not().isEmpty(),
    check("status", "Le statut de tache est  requis.").not().isEmpty(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { title, description, status } = req.body;
      const newTache = new Tache({ title, description, status });
      const savedTache = await newTache.save();
  
      return res
        .status(200)
        .json({ message: "tache  ajouté avec succès.", newTache: savedTache });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Erreur interne du serveur : " + err.message });
    }
  });
//chercher une tache avec son ID 
app.get("/tasks/:id", async (req, res) => {
  try {
    const tacheId = req.params.id;
    const tachechercher = await Tache.findById(tacheId);

    if (!tachechercher) {
      return res.status(404).json({ message: "Task not found" });
    }
    console.log(tachechercher);
    return res
      .status(200)
      .json({ message: "La tache cherché : ", task: tachechercher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//supprimer une tache 
app.delete("/tasks/:id", async (req, res) => {
  try {
    const idTask = req.params.id;
    const TaskDeleted = await Tache.findByIdAndDelete(idTask).exec();
    console.log("TaskDeleted:", TaskDeleted);

    if (!TaskDeleted) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }
    return res.status(200).json({ success: true, TaskDeleted });
  }catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal error." });
  }
});
//modifier une tache 
app.put("/tasks/:id", async (req, res) => {
    //create a object errors 
    const errors = validationResult(req);
    //test if the fields are empties 
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const id = req.params.id;
      const updatedTask = await Tache.findByIdAndUpdate(id, req.body, {
        new: true,
      }).exec();
      console.log("updatedTask:", updatedTask);
  
      if (!updatedTask) {
        return res.status(404).json({ success: false, message: "Task not found." });
      }
  
      return res.status(200).json({ success: true, updatedTask });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Internal error." });
    }
});
//authentification 
const ERROR_MESSAGE = 'L\'authentification a échoué';
const SUCCESS_MESSAGE = 'L\'authentification a réussi';
const secretKey = 'sab12345';
// Middleware pour gérer l'authentification
app.post('/login', (req, res) => {
 try {
 const { username, password } = req.body;
 // Validation des champs requis
 if (!username || !password) {
 throw new Error('Les champs "username" et "password" sont requis.');
 }
if (username === 'elife' && password === '0000') {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token, message: SUCCESS_MESSAGE });
    } else {
    res.status(401).json({ message: ERROR_MESSAGE });
    }
    } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
   });
//create server 
const port = 3000;
app.listen(port, () => {
  console.log(`Server runnig on port ${port}`);
});
