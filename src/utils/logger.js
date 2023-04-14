import winston from "winston"
import config from "../config/config.js"


const customLevelsOptions = {
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
      warning: 'yellow',
      info: 'green',
      http: 'cyan',
      debug: 'greenBG black',
    }
  }
  
  const prodLogger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'http',
        format: winston.format.combine(
          winston.format.colorize({
            colors: {
              error: 'red',
              warn: 'yellow',
              info: 'blue',
              http: 'blackBG red',
              verbose: 'cyan',
              debug: 'magenta',
              silly: 'white',
            }
          }),
          winston.format.simple(),
        )
      }),
      new winston.transports.File({
        filename: 'error.log',
        level: 'warn',
      })
    ]
  })
  
  const devLogger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'verbose',
      })
    ]
  })
  
  export const addLogger = (req, res, next) => {
    if(process.env.NODE_ENV === 'production') {
      req.logger = prodLogger;
      req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    } else {
      req.logger = devLogger;
      req.logger.verbose(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    }
  
    next()
  }

