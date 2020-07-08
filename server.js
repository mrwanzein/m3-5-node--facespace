'use strict';

const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');

let currentUser = {};


// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res.status(200).render('pages/homepage', { users: users });
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
    userFriends: usersFriends 
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

  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(8000, () => console.log('Listening on port 8000'));
