const express = require("express");
const router = express.Router();
const users = require("../models/users");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const connectDB = require("../utils/mongoDB");

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const key = crypto.createHmac('sha256', process.env.JWT_SECRET).update(password).digest('hex');
    return await bcrypt.hash(key, salt);
};

router.post('/login', async (req, res) => {
    await connectDB.open();

    const { email, password } = req.body;
    try {
        const user = await users.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const key = crypto.createHmac('sha256', process.env.JWT_SECRET).update(password).digest('hex');
        const isMatch = await bcrypt.compare(key, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error', err });
    } finally {
        // await connectDB.close();
    }


});
// Signup Route
router.post('/signup', async (req, res) => {
    await connectDB.open();
    const { name, email, password } = req.body;
    try {
        let user = await users.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await hashPassword(password);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    } finally {
        // await connectDB.close();
    }
});


module.exports = router;
