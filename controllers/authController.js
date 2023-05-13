import User from "../models/User.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../errors/index.js"
import attachCookie from "../utils/attachCookies.js"

const register = async (req, res) => {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new BadRequestError('Please provide all values')
    }

    const userAlreadyExist = await User.findOne({ email });

    if (userAlreadyExist) {
        throw new BadRequestError('Email already is in use...')
    }

    const user = await User.create({ name, email, password })
    const token = user.createJWT();

    //set coockie

    attachCookie({ res, token });

    //set coockie

    res.status(StatusCodes.CREATED).json({
        user: { email: user.email, lastName: user.lastName, location: user.location, name: user.name },
        // token, // chon az cookie estefade mikonim dg be in token niazi nist , hamintor dar login va update user
        location: user.location
    })
}

const login = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide all values...')
    }

    const user = await User.findOne({ email }).select('+password')

    if (!email) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    user.password = undefined;

    //set Coocki
    attachCookie({ res, token });
    //set Coocki
    res.status(StatusCodes.OK).json({
        user,
        // token, 
        location: user.location
    });
}

const updateUser = async (req, res) => {
    const { email, name, lastName, location } = req.body;
    if (!email || !name || !lastName || !location) {
        throw new BadRequestError('Please provide all values');
    }

    const user = await User.findOne({ _id: req.user.userId });

    user.email = email;
    user.name = name;
    user.lastName = lastName;
    user.location = location;

    await user.save();

    // various setups
    // in this case only id
    // if other properties included, must re-generate

    const token = user.createJWT();

    //set coockie
    attachCookie({ res, token });
    //set coockie
    res.status(StatusCodes.OK).json({
        user,
        // token,
        location: user.location,
    });
}

const getCurrentUser = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId });
    res.status(StatusCodes.OK).json({ user, location: user.location });
};

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

export { register, login, updateUser, getCurrentUser, logout }