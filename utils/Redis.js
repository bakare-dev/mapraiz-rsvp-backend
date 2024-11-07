const Redis = require("redis");
const { infrastructure } = require("../config/main.settings");
const Logger = require("./Logger");

let instance;

class RedisHelper {
  #client;
  #logger;

  constructor() {
    if (instance) return instance;

    this.#client = Redis.createClient({
      // password: infrastructure.redis.password,
      socket: {
        host: infrastructure.redis.url,
        port: infrastructure.redis.port,
      },
    });

    this.#logger = new Logger().getLogger();
    instance = this;
  }

  connect = async () => {
    await this.#client.connect().then(() => 
      this.#logger.info("mp-server connected to Redis")
    );
  };

  incr = async (key) => {
    try {
      return await this.#client.incr(key);
    } catch (error) {
      this.#logger.error(`Error incrementing key ${key}: ${error.message}`);
      throw error;
    }
  };

  expire = async (key, seconds) => {
    try {
      return await this.#client.expire(key, seconds);
    } catch (error) {
      this.#logger.error(`Error setting expiration on key ${key}: ${error.message}`);
      throw error;
    }
  };

  lpush = async (key, value) => {
    try {
      return await this.#client.lPush(key, value);
    } catch (error) {
      this.#logger.error(`Error pushing value to list ${key}: ${error.message}`);
      throw error;
    }
  };

  lrange = async (key, start, stop) => {
    try {
      return await this.#client.lRange(key, start, stop);
    } catch (error) {
      this.#logger.error(`Error fetching range from list ${key}: ${error.message}`);
      throw error;
    }
  };

  del = async (key) => {
    try {
        await this.#client.del(key);
    } catch (error) {
        this.#logger.error("Error deleting from cache:", error)
        throw error;
    }
}

  getClient = () => this.#client;
}

module.exports = RedisHelper;