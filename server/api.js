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
const Sketch = require("./models/sketch");
const Meta = require("./models/meta");

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

router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
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
  const imageMeta = new Meta({
    creator_id: req.user._id,
    creator_name: req.user.name,
    title: req.body.title,
    description: req.body.description,
    type: 'image',
  });
  let promises = [imageModel.save(), imageMeta.save()];
  Promise.all(promises).then((allData) => {
    res.send(allData[1]);
    socket.getSocketFromUserID(req.user._id).emit("create-meta", allData[1]);
  });
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
    fileName: req.body.fileName,
  });
  const dataMeta = new Meta({
    creator_id: req.user._id,
    creator_name: req.user.name,
    title: req.body.title,
    description: req.body.description,
    type: 'data',
  });
  let promises = [dataModel.save(), dataMeta.save()];
  Promise.all(promises).then((allData) => {
    console.log(allData[1]);
    res.send(allData[1]);
    socket.getSocketFromUserID(req.user._id).emit("create-meta", allData[1]);
  });
});

router.post("/sketchmodel", (req, res) => {
  const sketchModel = new Sketch({
    creator_id: req.user._id,
    creator_name: req.user.name,
    title: req.body.title,
    description: req.body.description,
    epochs: req.body.epochs,
    batchSize: req.body.batchSize,
    classes: req.body.classes,
    images: req.body.images,
  });
  const sketchMeta = new Meta({
    creator_id: req.user._id,
    creator_name: req.user.name,
    title: req.body.title,
    description: req.body.description,
    type: 'sketch',
  });
  let promises = [sketchModel.save(), sketchMeta.save()];
  Promise.all(promises).then((allData) => {
    res.send(allData[1]);
    socket.getSocketFromUserID(req.user._id).emit("create-meta", allData[1]);
  });
})

router.post('/delete/model', (req, res) => {
  console.log('deleting');
  console.log(req.body.title);
  console.log(req.body.type);
  let metaPromise = Meta.findOneAndDelete({ creator_id: req.user._id, title: req.body.title });
  let modelPromise;
  if (req.body.type === 'data') {
    modelPromise = Data.findOneAndDelete({ creator_id: req.user._id, title: req.body.title });
  }
  else if (req.body.type === 'image') {
    modelPromise = Image.findOneAndDelete({ creator_id: req.user._id, title: req.body.title });
  }
  else if (req.body.type === 'sketch') {
    modelPromise = Sketch.findOneAndDelete({ creator_id: req.user._id, title: req.body.title });
  }
  let promises = [modelPromise, metaPromise];
  Promise.all(promises).then((allData) => {
    console.log('deleted');
    res.send(allData[1]);
    socket.getSocketFromUserID(req.user._id).emit('delete-meta', allData[1]);
  });
})

router.get("/models/names", (req, res) => {
  // only find the metas of models made by this user
  Meta.find({ creator_id: req.user._id }).sort({ timestamp: 1}).then((metas) => res.send(metas));
});

// router.get("/models", (req, res) => {
//   const dataPromise = Data.find({ creator_id: req.user._id });
//   const imagePromise = Image.find({ creator_id: req.user._id });
//   const modelPromises = [dataPromise, imagePromise];
//   Promise.all(modelPromises).then((allData) => res.send(allData));
// });

router.get('/model', (req, res) => {
  if (req.query.type === 'data') {
    Data.findOne({ creator_id: req.user._id, title: req.query.title}).then((model) => res.send(model));
  }
  else if (req.query.type === 'image') {
    Image.findOne({ creator_id: req.user._id, title: req.query.title}).then((model) => res.send(model));
  }
  else if (req.query.type === 'sketch') {
    Sketch.findOne({ creator_id: req.user._id, title: req.query.title}).then((model) => res.send(model));
  }
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
