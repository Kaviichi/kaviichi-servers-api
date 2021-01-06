import logging from '../config/logging';
import config from '../config/config';
import express from 'express';
import axios from 'axios';
import { APIUser, RESTPostOAuth2AccessTokenResult } from 'discord-api-types';

const NAMESPACE = 'Discord Authenticator';

const router = express.Router();

/**Generates access token from Discord API.
 * See https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-access-token-exchange-example
 */
router.get('/redirect', async (req, res, next) => {
    if (!req.query.code) {
        logging.error(NAMESPACE, 'Attempting authentication without redirect code');
        return res.status(400);
    }
    try {
        // Use the redirect token to gain an access token from Discord's API
        const tokenResponse: RESTPostOAuth2AccessTokenResult = await getAccessToken(req.query.code + '');
        const accessToken = tokenResponse.access_token;
        // Retrieve the user's data
        const userData: APIUser = await getUserData(accessToken);
        console.log('got res: ', userData.username);
    } catch (error) {
        if (error.response.data.error_description == 'Invalid "code" in request.') {
            logging.warn(NAMESPACE, 'A user is attempting to authenticate with an invalid code.');
            return res.status(400);
        }
        logging.error('Discord API', error);
        console.log(JSON.stringify(error.response.data));
        return res.status(500);
    }
    return res.status(200).json({
        message: 'authenticator',
    });
});

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
