const dotenv = require('dotenv');

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_HOST = process.env.MONGO_HOST || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}${MONGO_HOST}`;
//const MONGO_URL = `mongodb://${process.env.MONGO_HOST_LOCAL}:${process.env.MONGO_PORT_LOCAL}/${process.env.MONGO_DATABASE_LOCAL}`;
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;

exports.config = {
    mongo: {
        username: MONGO_USERNAME,
        password: MONGO_PASSWORD,
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    },
    vnpay: {
        vnp_TmnCode: process.env.VNP_TMNCode,
        vnp_HashSecret: process.env.VNP_HashSecret,
        vnp_Url: process.env.VNP_Url,
        vnp_Api: process.env.VNP_Api,
        vnp_ReturnUrl: process.env.VNP_ReturnUrl
    }
};
