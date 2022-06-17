const { createLogger, format, transports } = require("winston");

var date = new Date();
var dateName = (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());

module.exports = createLogger({
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] | ${info.level} | ${info.message}`)
    ),
    transports: [
        new transports.File({
            maxsize: 1120000,
            maxFiles: 100,
            filename: `${__dirname}/file_logers/${dateName}.log `
        }),
        new transports.Console({
            level: 'debug'
        })
    ]
});