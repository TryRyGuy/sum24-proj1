const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Schedule = require('../models/schedule');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const PendingRegistration = require('../models/pendingRegistration');
const { registerLimiter } = require('../server'); // Adjust the path as necessary
//console.log(registerLimiter);


// Register user
router.post('/register', async (req, res) => {
    const { scheduleId = [], email, password, classes = [], scheduleName = '' } = req.body;
    try {
        if (!email.endsWith('@ucsc.edu')) {
            return res.status(400).json({ message: 'Invalid email. Please use a valid UCSC email address.' });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash the password before saving
        //const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ email, password });
        schedules = []
        for (let i = 0; i < 4; i++) {
            const sched = new Schedule({ classes, scheduleName });
            const savedSched = await sched.save();
            schedules.push(savedSched._id);
        }
        user.scheduleId = schedules;
        await user.save();
        
        console.log("user created");

        // Session regeneration
        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({ message: 'Session regeneration failed' });
            }
            req.session.user = { id: user._id, email: user.email }; // Store user data in session
            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Session save failed' });
                }
                res.status(201).send({message: 'User registered', user: { id: user._id, email: user.email } });
            });
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//NOTE: EXPLORE STORING USER ID IN SESSION RATHER THAN USER OBJECT ITSELF
// MORE SPACE EFFICIENT AND NOT RISKING EXPOSING PASSWORDS TO Javascript ATTACKS (XSS)

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // _csrf is implicitly checked by csurf middleware
    try {
        const user = await User.findOne({ email});
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Incorrect email and/or password' });
        }
        console.log("user found");
        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({ message: 'Session regeneration failed' });
            }
            req.session.user = { id: user._id, email: user.email }; // Only store necessary data
            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Session save failed' });
                }
                res.status(200).json({ message: 'User logged in', user, csrfToken: req.csrfToken() }); // Send new CSRF token
            });
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Middleware to check if the user is authenticated
router.get('/auth-check', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ authenticated: true, user: req.session.user });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

module.exports = router;
