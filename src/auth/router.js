'use strict';

const express = require('express');
const authRouter = express.Router();
const Role = require('./roles-model.js')

const User = require('./users-model.js');
const auth = require('./middleware.js');
const oauth = require('./oauth/google.js');
// require('roles-router.js')

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  console.log(user)
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
});

/**
 * Creates a new role to the db
 */
authRouter.post('/roles', (req,res,next) => {
  let role = new Role(req.body);
  role.save();
  res.status(200).send('Saved a new role to the db');
});

authRouter.post('/signin', auth(), (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

authRouter.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
});

authRouter.post('/key', auth, (req,res,next) => {
  let key = req.user.generateKey();
  res.status(200).send(key);
});





/**
 * anyone can access, 
 * brings back "you can read"
 */
authRouter.get('/public-stuff', (req,res,next) => {
  res.status(200).send("you can read!")
})
/**
 * anyone can access, 
 * brings back "you can read"
 */
authRouter.get('/hidden-stuff', auth(), (req,res,next) => {
  res.status(200).send("you are part of the community!")
})
/**
 * someone with account can access
 * brings back "you are a part of the community"

 */
authRouter.get('/something-to-read', auth('read'), (req,res,next) => {
  res.status(200).send("you can read!")
})
/**
 * someone with create can access,
 * brings back "you can edit"
 */
authRouter.post('/create-a-thing', auth('create'), (req,res,next) => {
  res.status(200).send("you can edit!")
})
/**
 * anyone can access, 
 * brings back "you can update"
 */
authRouter.put('/update', auth('update'), (req,res,next) => {
  res.status(200).send("you can update!")
})
/**
 * anyone can access, 
 * brings back "you can read"
 */
authRouter.patch('/jp', auth('update'), (req,res,next) => {
  res.status(200).send("you can patch!")
})
/**
 * anyone can access, 
 * brings back "you can say bye-bye"
 */
authRouter.delete('/bye-bye', auth('delete'), (req,res,next) => {
  res.status(200).send("you can say bye-bye!")
})
/**
 * superuser can access, 
 * brings back "you can do anything"
 */
authRouter.get('/everything', auth('superuser'), (req,res,next) => {
  res.status(200).send("you can do anything!")
})



module.exports = authRouter;
