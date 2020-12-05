const winston = require('winston');
const expressWinston = require('express-winston');
const {
  timestamp,
  json,
  prettyPrint,
  combine,
  label,
  simple,
  metadata,
  errors
} = winston.format;
const {
  LOG_META
} = process.env;

const loggerFormat = {
  transports: [
    new winston.transports.Console()
  ],
  levels: {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    crit: 4,
    fatal: 5
  },
  format:
    combine(
      timestamp(),
      label(),
      simple(),
      prettyPrint()
    ),
  meta: LOG_META === 'true' ? true : false, // optional: control whether you want to log the meta data about the request (default to true)
  msg: '{{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
};

exports.default = expressWinston.logger(loggerFormat);
// exports.logger = winston.createLogger(loggerFormat);
exports.logger = {
  infoLog: winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  }),

  errorLog: winston.createLogger({
    level: 'error',
    format: combine(
      errors({ stack: true }),
      simple(),
      metadata(),
      timestamp(),
      json(),
      prettyPrint(),
    ),
    transports: [new winston.transports.Console()],
  })
};
