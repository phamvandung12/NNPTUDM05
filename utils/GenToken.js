
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const PRIVATE_KEY_PATH = path.join(__dirname, '..', 'keys', 'private.key');
const PUBLIC_KEY_PATH = path.join(__dirname, '..', 'keys', 'public.key');

function getPrivateKey() {
    return fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
}

function getPublicKey() {
    return fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
}

module.exports = {
    RandomToken: function (length) {
        let result = "";
        let source = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        for (let index = 0; index < length; index++) {
            let ran = Math.floor(Math.random() * source.length);
            result += source.charAt(ran);
        }
        return result;
    },
    GenerateJwt: function (payload) {
        return jwt.sign(payload, getPrivateKey(), {
            algorithm: 'RS256',
            expiresIn: '30d'
        });
    },
    VerifyJwt: function (token) {
        return jwt.verify(token, getPublicKey(), {
            algorithms: ['RS256']
        });
    }
}