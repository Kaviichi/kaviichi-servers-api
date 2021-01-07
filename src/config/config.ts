import dotenv from 'dotenv';

dotenv.config();

/** SECRETS */
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

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
        discord_auth_url:
            'https://discord.com/api/oauth2/authorize?client_id=795772814195294228&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fredirect&response_type=code&scope=identify%20guilds',
    },
    jwt: {
        secret: JWT_SECRET || '',
    },
};

export default config;
