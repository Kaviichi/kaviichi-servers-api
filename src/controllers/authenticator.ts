import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import config from '../config/config';
import express from 'express';

const NAMESPACE = 'Authenticator';

const router = express.Router();

/**Generates access token from Discord API.
 * See https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-access-token-exchange-example
 */
router.get('/redirect', (req, res, next) => {
    logging.debug(NAMESPACE, 'Code: ' + req.query.code);

    return res.status(200).json({
        message: 'authenticator',
    });
});

export = router;
