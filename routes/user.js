const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

const User = require('../models/User')

router.get('/data', (req, res) => {
  if(req.session.user) {
    const { username, avatar } = req.session.user
    res.json({ user: { username, avatar }, isLoggedIn: true })
  }
  else {
    res.json({ isLoggedIn: false })
  }
}) 

router.post('/update/username', 
  body('username')
    .notEmpty().withMessage('The username field must not be empty')  
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username } = req.body
    req.session.user.username = username
    User.updateOne({ email: req.session.user.email }, { username })
      .then(result => {
        res.status(200).json({ success: true, message: 'User Successfully Updated' })
      })
})

router.post('/update/avatar', (req, res) => {
  const { avatar } = req.body
  if(avatar) {
    req.session.user.avatar = avatar
    User.updateOne({ email: req.session.user.email }, { avatar })
      .then(result => {
        res.json({ success: true, message: 'Avatar Successfully Updated' })
      })
  } else {
    res.status(400).json({ success: false })
  }
})

router.post('/update/password', 
  body('currentPassword')
    .notEmpty().withMessage('The password field must not be empty')
    .isLength({ min: 5 }).withMessage('Password must be 5+ characters long')
    .custom((value, { req }) => {
      const result = bcrypt.compareSync(value, req.session.user.password)
      if(!result) {
        throw new Error('Current Password is Incorrect')
      }
      return true
    }),
  body('newPassword')
    .notEmpty().withMessage('The password field must not be empty')
    .isLength({ min: 5 }).withMessage('Password must be 5+ characters long'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if(value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match New Password')
      }
      return true
    }),
  (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { currentPassword, newPassword, confirmPassword } = req.body
    const hashedPassword = bcrypt.hashSync(newPassword, 10)
    req.session.user.password = hashedPassword
    User.updateOne({ email: req.session.user.email }, { password: hashedPassword })
      .then(result => {
        res.status(200).json({ success: true, message: 'Password Successfully Updated' })
      })
})

router.post('/update/all',
  body('username')
    .notEmpty().withMessage('The username field must not be empty')  
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('currentPassword')
    .notEmpty().withMessage('The password field must not be empty')
    .isLength({ min: 5 }).withMessage('Password must be 5+ characters long')
    .custom((value, { req }) => {
      const result = bcrypt.compareSync(value, req.session.user.password)
      if(!result) {
        throw new Error('Current Password is Incorrect')
      }
      return true
    }),
  body('newPassword')
    .notEmpty().withMessage('The password field must not be empty')
    .isLength({ min: 5 }).withMessage('Password must be 5+ characters long'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if(value !== req.body.password) {
        throw new Error('Password confirmation does not match New Password')
      }
      return true
    }),
  (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, avatar, currentPassword, newPassword, confirmPassword } = req.body
    req.session.user.username = username
    req.session.user.avatar = avatar
    const hashedPassword = bcrypt.hashSync(newPassword, 10)
    req.session.user.password = hashedPassword
    User.updateOne({ email: req.session.user.email }, { username, avatar, password: hashedPassword })
      .then(result => {
        console.log(result)
        res.status(200).json({ success: true, message: 'User Successfully Updated' })
      })
})

router.post('/login', 
  body('email')
    .trim().notEmpty().withMessage('The email field must not be empty')  
    .normalizeEmail().isEmail().withMessage('Please insert a valid email address')
    .custom(value => {
      return User.findOne({ email: value })
        .then(user => {
          if(!user) {
            return Promise.reject('Email address not registered')
          }
        })
    }),
  body('password')
    .notEmpty().withMessage('The password field must not be empty')
    .custom((value, { req }) => {
      return User.findOne({ email: req.body.email })
        .then(user => {
          const result = bcrypt.compareSync(value, user.password)
          if(!result) {
            return Promise.reject('Incorrect Password')
          }
        })
    }),
  (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    User.findOne({ email })
      .then(user => {
        req.session.user = user
        res.status(200).json({ success: true, message: 'User Successfully Authenticated' })
      })
})

router.post('/register',
  body('username')
    .notEmpty().withMessage('The username field must not be empty')  
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email')
    .trim().notEmpty().withMessage('The email field must not be empty')  
    .normalizeEmail().isEmail().withMessage('Please insert a valid email address')
    .custom(value => {
      return User.findOne({ email: value })
        .then(user => {
          if(user) {
            return Promise.reject('Email already in use')
          }
        })
    }),
  body('password')
    .notEmpty().withMessage('The password field must not be empty')
    .isLength({ min: 5 }).withMessage('Password must be 5+ characters long'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if(value !== req.body.password) {
        throw new Error('Password confirmation does not match password')
      }
      return true
    }),
  (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, email, password } = req.body
    
    bcrypt.hash(password, 10, (err, hash) => {
      if(err) throw err
      User.create({
        username,
        email,
        password: hash
      }, (err, newUser) => {
        if(err) throw err
      })
    })
    req.flash('success', 'User Successfully Registered')
    res.status(200).json({ success: true })  
})

module.exports = router