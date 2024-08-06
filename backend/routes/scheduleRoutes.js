const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Schedule = require('../models/schedule');

router.get('/getSchedules', async (req, res) => {
    try {
      const schedules = await Schedule.find();
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).send(error.message);
    }
});

router.get('/getUserSchedules', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('scheduleId');
        const schedules = user.scheduleId;
        res.status(200).json(schedules);
    } catch {
        res.status(500).send('Error fetching user schedules');
    }
})
  
module.exports = router;