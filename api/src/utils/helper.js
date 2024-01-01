const querystring = require('qs');
const crypto = require('crypto');
const { config } = require('../config/config');
exports.sendError = (res, error, statusCode = 401) => {
    res.status(statusCode).json({ error });
};
exports.hashChecksum = (vnp_Params) => {
    const secretKey = config.vnpay['vnp_HashSecret'];
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    return signed;
};
