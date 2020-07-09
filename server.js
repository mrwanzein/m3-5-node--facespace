'use strict';

const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');

let currentUser = {};
let signed = false;


// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res.status(200).render('pages/homepage', { users: users, currentUser: currentUser });
}

const handleSignin = (req, res) => {
  if(!signed) {
    res.status(200).render('pages/signin', { currentUser: currentUser });
  } else {
    res.status(200).redirect('/');
  }
}

const handleName = (req, res) => {
  let { firstName } = req.body;
  let id;
  
  users.forEach(user => {
    if(user.name === firstName) {
      currentUser = user;
      return id = user._id;
    }
  });

  if(id) {
    res.status(200).redirect(`/users/${id}`);
    signed = true;

  } else {
    res.status(404).redirect('/signin');
  }

}

const handleProfilePage = (req, res) => {
  let { _id } = req.params;

  let userData = users.filter(user => user._id === _id)[0];

  let usersFriends = [];

  users.forEach(users => {
    userData.friends.forEach(friendsId => {
      if(users._id === friendsId) usersFriends.push(users);
    });
  });


  res.status(200).render('pages/profile', { 
    user: userData, 
    userFriends: usersFriends,
    currentUser: currentUser
  });
}

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

  // endpoints
  .get('/', handleHomepage)

  .get('/users/:_id', handleProfilePage)

  .get('/signin', handleSignin)

  .post('/getname', handleName)

  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(8000, () => console.log('Listening on port 8000'));
