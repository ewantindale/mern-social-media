const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const auth = require('../../middleware/auth')

//  POST api/users
//  Registers a new user
router.post('/', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findOne({ email }).then(user => {
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      const newUser = new User ({ name, email, password })

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash)=> {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
              jwt.sign(
                { id: user.id },
                process.env.jwtSecret,
                { expiresIn: 3600 }, 
                (err, token) => {
                  if (err) throw err;
                  res.json({
                    token,
                    user: {
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      following: [],
                      bio: '',
                      profilePic: ''
                    }
                  });
                }
              )              
            })
        })
      })
    })
});

//  PATCH /api/users
//  Updates the user object
router.patch('/', auth, (req, res) => {
  User.findById(req.user.id).select('-password').then(user => {
    if('bio' in req.body){
      user.bio = req.body.bio
    }
    if('name' in req.body){
      user.name = req.body.name
    }
    user.save().then(user => res.json({
      id: user.id,
      name: user.name,
      bio: user.bio,
      email: user.email,
      following: user.following,
      profilePic: user.profilePic
    }));
    
  }).catch(err => res.status(500).json({ error: err }));
})

//  GET /api/users/
//  Return a list of all user objects
router.get('/', (req, res) => {
  User.find().select('-password').then(users => {
    res.json(users)
  }).catch(err => res.status(500).json({ error: err }));
})

//  GET /api/users/:id
//  Return the user object for a specific user
router.get('/:id', (req, res) => {
  User.findById(req.params.id).select('-password').then(user => {
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({
      id: user.id,
      name: user.name,
      bio: user.bio,
      email: user.email,
      following: user.following,
      profilePic: user.profilePic
    })
  }).catch(err => res.status(500).json({ err }));
})

//  POST /api/users/follow/:id
//  Make the requester (req.user.id) follow the specified user (req.params.id) or if the follow already exists, remove it
router.post('/follow/:id', auth, (req, res) => {
  if(req.user.id === req.params.id) return res.status(400).json({ msg: 'You cannot follow yourself' });
  User.findById(req.user.id)
    .then(user => {
      const updatedUser = user;
      if (updatedUser.following.includes(req.params.id)){
        updatedUser.following = updatedUser.following.filter(e => e !== req.params.id)
        updatedUser.save().then(user => res.status(200).json({ msg: 'Follow removed', follower: user.id, followee: req.params.id }))
      } else {
        updatedUser.following.push(req.params.id);
        updatedUser.save().then(user => res.status(201).json({ msg: 'Follow added', follower: user.id, followee: req.params.id }))
      }
    })
    .catch(err => res.status(500).json({ error: err }));
});

//  GET /api/users/following
//  Return everyone the user follows as an array of user objects
router.get('/following', (req, res) => {
  User.findById(req.user.id).then(user => {
    User.find({ _id: [...user.following]}).select('-password').then(users => {
      res.json(users)
    })
  }).catch(err => res.status(500).json({ error: err}));
})

module.exports = router;