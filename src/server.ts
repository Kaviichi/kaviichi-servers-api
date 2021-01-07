import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import discordAuthRoute from './controllers/discord-auth';
import serverControllerRoute from './controllers/server-controller';

const NAMESPACE = 'Server';
const router = express();

/** Check that secrets are assigned */
if (config.discord.secret == '' || config.jwt.secret == '') {
    const errorMessage =
        'Secrets have not been assigned. Make sure secrets are available before starting the application.';
    logging.error(NAMESPACE, errorMessage);
    throw new Error(errorMessage);
}

/** Middleware */

router.use((req, res, next) => {
    logging.info(
        NAMESPACE,
        `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
        logging.info(
            NAMESPACE,
            `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${req.statusCode}]`
        );
    });

    next();
});

/** API Rules */
// Allows nested JSON
router.use(bodyParser.urlencoded({ extended: false }));
// Takes care of JSON parsing
router.use(bodyParser.json());

router.use((req, res, next) => {
    // Allow access from anywhere
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    // Set allowed methods for the API
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
    }

    next();
});

/** Routes */
router.use('/auth', discordAuthRoute);
router.use('/server', serverControllerRoute);
/** Error Handling */
router.use((req, res, next) => {
    const error = new Error('not found');

    return res.status(404).json({
        message: error.message,
    });
});

/** Create the server */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () =>
    logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`)
);
