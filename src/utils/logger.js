import winston from "winston"
import config from "../config/config.js"

const levelOptions = {
    levels: {
      fatal: 0,
      error: 1,
      warning: 2,
      info: 3,
      http: 4,
      debug: 5,
    },
    colors: {
      fatal: 'redBG black',
      error: "red",
      warning: 'blue',
      info: 'yellow',
      http: 'blueBG black',
      debug: 'greenBG black',
    }
  }
  
  const prettyJson = winston.format.printf(info => {
    if (info.message.constructor === Object) {
      info.message = JSON.stringify(info.message, null, 4)
    }
    return `${info.level}: ${info.message}`
  })
  
  export const logger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: config.NODE_ENV,
        format: winston.format.combine(
          winston.format.colorize({ colors: levelOptions.colors }),
          winston.format.simple(),
          prettyJson
        )
      }),
  
      new winston.transports.File({
        filename: "./error.log",
        level: "error",
        format: winston.format.simple()
      })
    ]
  })
  
  
  export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next();
  
  }

  
  