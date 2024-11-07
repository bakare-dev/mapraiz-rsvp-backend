const nodemailer = require("nodemailer");
const ejs = require("ejs");
const { infrastructure } = require("../config/main.settings");
const Logger = require("./Logger");

let instance;
class Mailer {

    #transporter;
    #logger;

    constructor() {

        if (instance) return instance;

        this.#transporter = nodemailer.createTransport({
            host: infrastructure.smtp.host,
            port: infrastructure.smtp.port,
            secure: false,
            auth: {
                user: infrastructure.smtp.user,
                pass: infrastructure.smtp.password
            }
        })

        this.#logger = new Logger().getLogger()

        instance = this;
    }

    sendMail = (info, callback) => {

        // Start a 3-minute timeout
        const timeoutId = setTimeout(() => {
            this.#logger.error("Mail sending timeout exceeded 3 minutes");
            callback({ status: "failed", message: "Mail sending timeout exceeded 3 minutes" });
        }, 180000); // 180,000 milliseconds (3 minutes)

        try {

            ejs.renderFile(process.cwd() + "/templates/" + info.templateFile, info.data, (err, data) => {

                if (err) {
                    clearTimeout(timeoutId); // Clear timeout if an error occurs
                    this.#logger.error(err);
                    callback({ status: "failed", message: err.message });
                    return;
                }

                let message = {
                    from: info.sender,
                    to: info.recipients,
                    subject: info.subject,
                    html: data
                }

                this.#transporter.sendMail(message, (err, info) => {
                    clearTimeout(timeoutId); // Clear timeout after mail is sent

                    if (err) {
                        this.#logger.error(err);
                        callback({ status: "failed", message: err.message });
                        return;
                    }

                    callback({ status: "success", message: info });
                });

            });

        } catch (e) {
            clearTimeout(timeoutId); // Clear timeout in case of an exception
            this.#logger.error(e);
            callback({ status: "failed", message: e.message });
        }

    }

}

module.exports = Mailer;