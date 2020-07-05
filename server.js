const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { multerUploads, dataUri } = require('./middleware/multer')
const auth = require('./middleware/auth')
const User = require('./models/User');

//const cors = require('cors')

const connectDB = require('./config/db');
const { uploader, cloudinaryConfig } = require('./config/cloudinaryConfig');

dotenv.config({ path: './config/config.env'});

const app = express();

//app.use(cors());

app.use(express.json());

app.use(express.static('public'))

// Database config and connection
connectDB();

// Routes
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

// File uploads
app.post('/upload', [multerUploads, auth, cloudinaryConfig], (req, res) => {
  if (req.file) {
    const file = dataUri(req).content;

    return uploader.upload(file, result => {

      User.findById(req.user.id).then(user => {
        user.profilePic = result.secure_url;
        user.save();
      })

      return res.status(200).json({ 
        msg: 'Your image has been uploaded to cloudinary',
        result
      })
    }, { public_id: req.user.id, invalidate: true })
    .catch(err => res.status(400).json({
      msg: 'There was an error processing your request',
      err
    }))
  }
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`));