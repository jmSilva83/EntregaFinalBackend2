import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const register = async (req, res) => {
    try {
        // Supongamos que req.user es el usuario registrado
        const user = req.user;
        const sessionUser = {
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            id: user._id,
        };
        const token = jwt.sign(sessionUser, config.auth.jwt.SECRET, {
            expiresIn: '1d',
        });
        res.cookie(config.auth.jwt.COOKIE, token).sendSuccess('Registered successfully');
    } catch (error) {
        res.status(500).send({ error: 'Registration failed' });
    }
};

const login = async (req, res) => {
    console.log(req.user);
    const sessionUser = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
        id: req.user._id,
    };
    const token = jwt.sign(sessionUser, config.auth.jwt.SECRET, {
        expiresIn: '1d',
    });
    res.cookie(config.auth.jwt.COOKIE, token).redirect('/profile');
};

const current = (req, res) => {
    if (!req.user) {
        return res.sendUnauthorized();
    }
    res.sendSuccess('User data retrieved successfully', req.user);
};

const logout = (req, res) => {
    res.clearCookie(config.auth.jwt.COOKIE);
    res.redirect('/');
};

export default {
    register,
    login,
    current,
    logout
};
