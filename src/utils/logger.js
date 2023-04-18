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
  
  const prodLogger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: config.NODE_ENV,
        format: winston.format.combine(
          winston.format.colorize({ colors: levelOptions.colors }),
          winston.format.simple(),
        )
      }),
  
      new winston.transports.File({
        filename: "./error.log",
        level: "error",
        format: winston.format.simple()
      })
    ]
  })
  
  const devLogger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: config.NODE_ENV,
      })
    ]
  })

  export const addLogger = (req, res, next) => {
    if(process.env.NODE_ENV === 'production') {
      req.logger = prodLogger;
      req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    } else {
      req.logger = devLogger;
      req.logger.debug(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    }
  
    next()
  }
  
  