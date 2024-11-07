const DatabaseEngine = require("./utils/DatabaseEngine");
const ValidateJSInit = require("./utils/ValidateJSInit");
const Server = require("./server/Server");
const Startup = require("./utils/Startup");
const config = require("./config/main.settings");
const Logger = require("./utils/Logger");

let logger = new Logger().getLogger();
let start = new Startup()

main = () => {
  try {
    process.env.TZ = config.infrastructure.timezone;
    let validateJSInit = new ValidateJSInit();
    validateJSInit.setup();

    let server = new Server(config.server.port);
    server.start();
    
    // let db = new DatabaseEngine();

    // db.connect(async() => {
    //   let server = new Server(config.server.port);
    //   await start.startMigration();
    //   server.start();
    // });

  } catch (e) {
    logger.error(e)
    process.exit(1);
  }
};

main();
