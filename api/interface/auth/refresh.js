const path = require('path');
const jwt = require('jsonwebtoken');

module.exports = {
    friendlyName: 'auth/refresh',
    description: 'Refresh an expired access token using a valid refresh token.',
    static: true,
    inputs: {
        refreshToken: {
            type: 'string',
            description: 'The refresh token',
            required: true
        }
    },
    outputs: {
        type: 'json',
        description: 'A JSON string containing the new accessToken and refreshToken',
        properties: {
            accessToken: {
                type: 'string',
                description: 'The new access token'
            },
            refreshToken: {
                type: 'string',
                description: 'The new refresh token'
            }
        }
    },
    exits: {
        invalidToken: (obj) => {
            return {message: 'Invalid token'}
        },
        serverError: (obj) => {
            return {message: 'Server Error'}
        }
    },

    fn: async function (_, inputs, env) {
        const {input1: refreshToken} = inputs;

        // 1. Verify incoming refresh token
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            throw 'invalidToken';
        }

        // 2. Issue a new access token
        const accessToken = jwt.sign(
            {userId: payload.userId},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '15m'}
        );

        // 3. (Optionally) issue a new refresh token
        const newRefreshToken = jwt.sign(
            {userId: payload.userId},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '7d'}
        );

        // 4. Return both tokens
        return {accessToken: accessToken, refreshToken: newRefreshToken}
    }
};
