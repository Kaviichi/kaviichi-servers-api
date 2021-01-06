import dotenv from 'dotenv';

dotenv.config();

/** SECRETS */
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

/** CONFIG WITH DEFAULT VALUES */
const SERVER_PORT = process.env.PORT || 8080;
const SERVER_HOSTNAME = process.env.NAME || 'localhost';

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
};

const config = {
    server: SERVER,
    discord: {
        // Fall-back assigned as some typescript types expect this to be assigned
        // But expecting fair error checking if this is un-assigned
        secret: DISCORD_CLIENT_SECRET || '',
        api_endpoint: 'https://discord.com/api/v6',
        client_id: '795772814195294228',
        // TODO: Replace this with a legitimate redirect url
        redirect_uri: 'http://localhost:8080/auth/redirect',
        // Scopes we are requesting authorisation for
        scopes: 'identify guilds',
    },
};

export default config;
