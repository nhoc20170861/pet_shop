const jwt = require('jsonwebtoken');

const User = require('../models/user');

const bcrypt = require('bcrypt');

// let refreshTokens = [];

const { generateRefreshToken, generateToken } = require('../middleware/generateToken');

exports.createUser = async (req, res) => {
    try {
        const { username, email, phone, password, repeatPassword } = req.body;

        if (!username || !email || !phone || !password || !repeatPassword) {
            return res.status(401).json({ error: 'Please fill in all fields' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const existUser = await User.findOne({ username });

        if (existUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        if (password !== repeatPassword) {
            return res.status(400).json({ error: 'Password not match' });
        }

        const newUser = new User({ username, password: hash, email, phone });

        await newUser.save();
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json('Username or password is wrong');
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(404).json('Username or password is wrong');
        }
        if (user && validPassword) {
            const accessToken = generateToken(user);

            // refreshTokens.push(refreshToken);
            // const { password, ...other } = user._doc;
            return res.status(201).json({
                message: 'Login success',
                username: user.username,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
                accessToken
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.logout = (req, res) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};
