const NAMESPACE = 'Discord Authenticator';
import express from 'express';
import authenticate from '../middleware/authenticator';

const router = express.Router();

router.get('/test-pass', (req, res) => {
    return res.status(200).json({
        message: 'passed',
    });
});

router.get('/test-auth', authenticate, (req, res) => {
    return res.status(200).json({
        message: "You're authenticated!",
    });
});

export = router;
