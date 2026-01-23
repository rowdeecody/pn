import path from 'path';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, prettyPrint, errors, printf, colorize } = format;

export default class Logger {
    private static loggerInstance: ReturnType<typeof createLogger> | null = null;

    private static getLogDir() {
        return process.env.PATH_ERROR || path.join(process.cwd(), 'server', 'logs');
    }
    public static development() {
        return createLogger({
            level: 'debug',

            transports: [
                // all logs (configurable via ALL_LOG_FILENAME)
                new transports.File({
                    filename: `${Logger.getLogDir()}/${process.env.ALL_LOG_FILENAME || 'application.log'}`,
                    level: 'debug',
                    format: combine(
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        errors({ stack: true }),
                        printf(({ level, message, timestamp, stack }) => {
                            if (stack) {
                                return `[${timestamp}] [${level.toUpperCase()}] [${message}] - ${stack}`;
                            }
                            return `[${timestamp}] [${level.toUpperCase()}] [${message}]`;
                        })
                    ),
                }),
                // errors only (configurable via ERROR_LOG_FILENAME)
                new transports.File({
                    filename: `${Logger.getLogDir()}/${process.env.ERROR_LOG_FILENAME || 'errors.log'}`,
                    level: 'error',
                    format: combine(
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        errors({ stack: true }),
                        printf(({ level, message, timestamp, stack }) => {
                            if (stack) {
                                return `[${timestamp}] [${level.toUpperCase()}] [${message}] - ${stack}`;
                            }
                            return `[${timestamp}] [${level.toUpperCase()}] [${message}]`;
                        })
                    ),
                }),
                // also log to console/terminal in development
                new transports.Console({
                    format: combine(
                        colorize(),
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        errors({ stack: true }),
                        printf(({ level, message, timestamp, stack }) => {
                            if (stack) {
                                return `[${timestamp}] [${level.toUpperCase()}] [${message}] - ${stack}`;
                            }
                            return `[${timestamp}] [${level.toUpperCase()}] [${message}]`;
                        })
                    ),
                }),
            ],
        });
    }

    public static production() {
        return createLogger({
            level: 'debug',
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                errors({ stack: true }),
                printf(({ level, message, timestamp, stack }) => {
                    if (stack) {
                        return `[${timestamp}] [${level.toUpperCase()}] [${message}] - ${stack}`;
                    }
                    return `[${timestamp}] [${level.toUpperCase()}] [${message}]`;
                })
            ),

            transports: [
                // production all logs (configurable via ALL_LOG_FILENAME)
                new transports.File({
                    filename: `${Logger.getLogDir()}/${process.env.ALL_LOG_FILENAME || 'application.log'}`,
                    level: 'info',
                }),
                // production errors only
                new transports.File({
                    filename: `${Logger.getLogDir()}/${process.env.ERROR_LOG_FILENAME || 'errors.log'}`,
                    level: 'error',
                }),
                // also log to console/terminal in production
                new transports.Console({
                    format: combine(
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        errors({ stack: true }),
                        printf(({ level, message, timestamp, stack }) => {
                            if (stack) {
                                return `[${timestamp}] [${level.toUpperCase()}] [${message}] - ${stack}`;
                            }
                            return `[${timestamp}] [${level.toUpperCase()}] [${message}]`;
                        })
                    ),
                }),
            ],
        });
    }

    static log() {
        if (!this.loggerInstance) {
            this.loggerInstance = process.env.NODE_ENV === 'production' ? this.production() : this.development();
        }
        return this.loggerInstance;
    }
}
