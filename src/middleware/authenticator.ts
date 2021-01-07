import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';

const NAMESPACE = 'Authenticator';

/** Authenticates the client against supplied JWT*/
const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // If there is no authorization header, reject the request.
    if (!req.headers.authorization) {
        logging.info(NAMESPACE, 'Client attempted API access without auth header.');
        return res.status(400).json({
            message: 'Request requires auth header',
        });
    }
    // Split by the space between bearer and token
    const authHeader = req.headers.authorization.split(' ');
    const token = authHeader[1];
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err || !decoded) {
            logging.warn(NAMESPACE, 'Client failed authentication with invalid JWT.');
            return res.status(400).json({
                message: 'Invalid JWT',
            });
        }
        logging.info(NAMESPACE, 'decoded:' + JSON.stringify(decoded));
        next();
    });
};

export = authenticate;