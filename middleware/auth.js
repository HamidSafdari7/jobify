import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';

const auth = async (req, res, next) => {

    // const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith('Bearer')) {
    //     throw new UnauthenticatedError('Authentication Invalid');     //this lines of cod that i commented thhem were authenticating by local storage
    // }
    // const token = authHeader.split(' ')[1];

    const token = req.cookies.token;
    if (!token) {
        throw new UnauthenticatedError('Authentication Invalid');
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // TEST USER
        const testUser = payload.userId === '645d02f70eef0ae4c439ac46';
        req.user = { userId: payload.userId, testUser };
        // TEST USER

        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
};

export default auth;