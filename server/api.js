/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Image = require("./models/image");
const Data = require("./models/data");
const Title = require("./models/title");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socket = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socket.addUser(req.user, socket.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/imagemodel", (req, res) => {
  
  const imageModel = new Image({
    creator_id: req.user._id,
    creator_name: req.user.name,
    title: req.body.title,
    description: req.body.description,
    epochs: req.body.epochs,
    batchSize: req.body.batchSize,
    classes: req.body.classes,
    images: req.body.images,
  });
  const imageTitle = new Title({
    creator_id: req.user._id,
    creator_name: req.user.name,
    title: req.body.title,
    description: req.body.description,
  });
  let promises = [imageModel.save(), imageTitle.save()];
  Promise.all(promises).then((allData) => res.send(allData[1]));
  socket.getSocketFromUserID(req.user._id).emit("title", req.body.title);
});

router.post("/datamodel", (req, res) => {

  const dataModel = new Data({
    creator_id: req.user._id,
    creator_name: req.user.name,
    title: req.body.title,
    description: req.body.description,
    epochs: req.body.epochs,
    batchSize: req.body.batchSize,
    inputs: req.body.inputs,
    outputs: req.body.outputs,
    isRegression: req.body.isRegression,
    types: req.body.types,
    csv: req.body.csv,
  });
  const dataTitle = new Title({
    creator_id: req.user._id,
    creator_name: req.user.name,
    title: req.body.title,
    description: req.body.description,
  });
  let promises = [dataModel.save(), dataTitle.save()];
  Promise.all(promises).then((allData) => res.send(allData[1]));
  socket.getSocketFromUserID(req.user._id).emit("title", req.body.title);
});

router.get("/models/names", (req, res) => {
  // only find the titles of models made by this user
  Title.find({ creator_id: req.user._id }).then((titles) => res.send(titles));
});

router.get("/models", (req, res) => {
  const dataPromise = Data.find({ creator_id: req.user._id });
  const imagePromise = Image.find({ creator_id: req.user._id });
  const modelPromises = [dataPromise, imagePromise];
  Promise.all(modelPromises).then((allData) => res.send(allData));
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
