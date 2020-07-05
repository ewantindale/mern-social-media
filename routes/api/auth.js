const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth')

// User Model
const User = require('../../models/User');

//  POST api/auth
//  Authorize a user
router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(400).json({ msg: 'User does not exist' });
      
      // Validate password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

          jwt.sign({ id: user.id }, process.env.jwtSecret, { expiresIn: 3600 }, 
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  bio: user.bio,
                  email: user.email,
                  following: user.following,
                  profilePic: user.profilePic
                }
              });
            }
          )
        })
    })
}); 

// PRIVATE: GET api/auth/user
// Get the user's data
router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json({
      id: user.id,
      name: user.name,
      bio: user.bio,
      email: user.email,
      following: user.following,
      profilePic: user.profilePic
    }))
    .catch(err => res.status(500).json({ error: err }));
})

module.exports = router;