import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.PORT || 8080;
const SERVER_HOSTNAME = process.env.NAME || 'localhost';

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
};

const config = {
    server: SERVER,
};

export default config;
