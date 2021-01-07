import logging from '../config/logging';
import config from '../config/config';
import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { APIUser, RESTPostOAuth2AccessTokenResult } from 'discord-api-types';
import authenticate from '../middleware/authenticator';

const NAMESPACE = 'Discord Authenticator';

const router = express.Router();

interface JWTData {
    // The Discord User ID
    uid: `${bigint}`;
    // The Discord Access Token
    token: string;
    // Token expiration date in milliseconds (epoch)
    exp: number;
}

/**Redirect the user to grant permissions on Discord,
 * once granted will return to /redirect
 */
router.get('/authenticate', (req, res) => {
    res.redirect(config.discord.discord_auth_url);
});

/**Generates access token from Discord API.
 * See https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-access-token-exchange-example
 */
router.get('/redirect', async (req, res) => {
    if (!req.query.code) {
        logging.error(NAMESPACE, 'Attempting authentication without redirect code');
        return res.status(400);
    }
    try {
        // Use the redirect token to gain an access token from Discord's API
        const tokenResponse: RESTPostOAuth2AccessTokenResult = await getAccessToken(req.query.code + '');
        var discordAccessToken = tokenResponse.access_token;
        // Retrieve the user's data for our own JWT
        var userData: APIUser = await getUserData(discordAccessToken);
    } catch (error) {
        if (error.response.data.error_description == 'Invalid "code" in request.') {
            logging.warn(NAMESPACE, 'A user is attempting to authenticate with an invalid code.');
            return res.status(400);
        }
        logging.error('Discord API', error);
        console.log(JSON.stringify(error.response.data));
        return res.status(500);
    }

    const authToken = generateJWT(userData.id, discordAccessToken);

    return res.status(200).json({
        token: authToken,
    });
});

/**The user already has authenticated with us, and would like to re-authenticate for this session
 * Refreshes the JWT and refreshes the Discord Access Token
 */
router.get('/reauthenticate', authenticate, (req, res) => {});

function generateJWT(uid: `${bigint}`, accessToken: string) {
    // One week in milliseconds
    const week = 604800000;
    const jwtExpDate = Date.now() + week;
    const payload: JWTData = {
        uid: uid,
        token: accessToken,
        exp: jwtExpDate,
    };
    // This token will be used for authenticating and authorisation throughout the API
    return jwt.sign(payload, config.jwt.secret);
}

async function getUserData(token: string): Promise<APIUser> {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + token,
    };
    const res = await axios.get(config.discord.api_endpoint + '/users/@me', {
        headers: headers,
    });
    return res.data as APIUser;
}

async function getAccessToken(code: string): Promise<RESTPostOAuth2AccessTokenResult> {
    const data = {
        client_id: config.discord.client_id,
        client_secret: config.discord.secret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: config.discord.redirect_uri,
        scope: config.discord.scopes,
    };
    const res = await axios({
        method: 'post',
        url: config.discord.api_endpoint + '/oauth2/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        // Payload must be URLSearchParams not formdata as the content type is form-urlencoded
        data: new URLSearchParams(data),
    });
    return res.data as RESTPostOAuth2AccessTokenResult;
}

async function refreshAccessToken(refreshToken: string): Promise<RESTPostOAuth2AccessTokenResult> {
    const data = {
        client_id: config.discord.client_id,
        client_secret: config.discord.secret,
        grant_type: 'refresh_token',
        refreshToken: refreshToken,
        redirect_uri: config.discord.redirect_uri,
        scope: config.discord.scopes,
    };
    const res = await axios.post(config.discord.api_endpoint + '/oauth2/token', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: new URLSearchParams(data),
    });
    return res.data as RESTPostOAuth2AccessTokenResult;
}

export = router;
