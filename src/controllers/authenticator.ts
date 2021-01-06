import logging from '../config/logging';
import config from '../config/config';
import express from 'express';
// Imports Axois Types
const axios = require('axios').default;

const NAMESPACE = 'Discord Authenticator';

const router = express.Router();

/**NOTES
 * - User attempts authentication
 * - API checks if they are already logged in / have an access token in the database
 * - If they are logged in: refresh access token
 * - If they are not logged in: redirect to auth URL
 * - URL e.g. https://discord.com/api/oauth2/authorize?client_id=795772814195294228&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fredirect&response_type=code&scope=identify%20guilds
 * - User authorises app and is redirected to /redirect
 */

/**Generates access token from Discord API.
 * Should only happen if access token has expired
 * See https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-access-token-exchange-example
 */
router.get('/redirect', async (req, res, next) => {
    if (!config.discord.secret) {
        logging.error(NAMESPACE, 'Discord App Secret has not been set. Discord authentication will fail.');
        return res.status(500);
    }
    if (!req.query.code) {
        logging.error(NAMESPACE, 'Attempting authentication without redirect code');
        return res.status(400);
    }
    try {
        const response = await axios.post(config.discord.api_endpoint + '/oauth2/token', {
            data: {
                client_id: config.discord.client_id,
                client_secret: config.discord.secret,
                grant_type: 'authorization_code',
                code: req.query.code,
                redirect_uri: config.discord.redirect_uri,
                scope: config.discord.scopes,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    } catch (error) {
        logging.error('Discord API', error);
        console.log(error);
        return res.status(500);
    }
    return res.status(200).json({
        message: 'authenticator',
    });
});

function refreshAccessToken(refreshToken: string): Promise<any> {
    return axios.post(config.discord.api_endpoint + '/oauth2/token', {
        data: {
            client_id: config.discord.client_id,
            client_secret: config.discord.secret,
            grant_type: 'authorization_code',
            refresh_token: refreshToken,
            redirect_uri: config.discord.redirect_uri,
            scope: config.discord.scopes,
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
}
export = router;
