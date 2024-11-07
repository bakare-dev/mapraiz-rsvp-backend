const jwt = require("jsonwebtoken");
const { security, infrastructure } = require("../config/main.settings");
const CacheService = require("../services/CacheService");
const dayjs = require("dayjs");
const Logger = require("../utils/Logger");
const UserService = require("../services/dataservices/UserService");

let instance;

class Authenticate {
    #key;
    #cacheService;
    #logger;
    #service;

    constructor() {

        if (instance) return instance;

        this.#key = security.jwtSecret;
        this.#cacheService = new CacheService();
        this.#logger = new Logger().getLogger();
        this.#service = new UserService();

        instance = this;
    }

    authenticateJWT = async (req, res, next) => {
        const authHeader = req.get("Authorization");

        if (!authHeader) {
            req.isAuth = false;
            return next();
        }

        let token = authHeader.split(' ')[1];

        if (!token) {
            req.isAuth = false;
            return next();
        }

        const key = `usertk-test: ${token}`;

        const savedToken = await this.#cacheService.get(key);

        if (!savedToken) {
            req.isAuth = false;
            return next();
        }

        token = savedToken.token.token;

        let decodedToken;

        try {
            decodedToken = jwt.verify(token, this.#key);
        } catch (err) {
            req.isAuth = false;
            return next();
        }

        if (!decodedToken) {
            req.isAuth = false;
            this.#logger.error("unable to decode")
            return next();
        }

        req.isAuth = true;
        req.userId = decodedToken.userId;
        req.type = decodedToken.type;
        return next();
    };

    generateTokens = (userId, username, type, callback) => {
        let responseToken;

        let token = jwt.sign({ userId: userId, username: username, type: type }, security.jwtSecret, {
            expiresIn: '6h'
        });

        let tokenExpire = new Date().getTime() + 6 * 60 * 60000;

        token = {
            token,
            expiresIn: dayjs(new Date(tokenExpire)).format(infrastructure.dateFormat)
        }

        responseToken = { token: {
            token: token.token,
            expiresIn: token.expiresIn
        }}

        this.#cacheService.set(`usertk-test: ${token.token}`, responseToken, 21600);
        callback(responseToken);
    };

    invalidateToken = async (req, res, next) => {
        const authHeader = req.get("Authorization");

        if (!authHeader) {
            req.isAuth = false;
            return next();
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            req.isAuth = false;
            return next();
        }
        
        const key = `usertk-test: ${token}`

        const storedToken = await this.#cacheService.get(key);

        if (!storedToken) {
            req.isAuth = true;
            return next();
        }

        await this.#cacheService.del(key);
        req.isAuth = true;
        return next();
    };

    getUserIdfromToken = async (token) => {
        if (!token) {
            return {token: true}
        }
        
        let decodedToken;

        try {
            decodedToken = jwt.verify(token, this.#key);
        } catch (err) {
            return {token: false}
        }

        if (!decodedToken) {
            this.#logger.error("unable to decode")
            return {token: false}
        }

        return {token: true, userId: decodedToken.userId};
    };
}

module.exports = Authenticate;
