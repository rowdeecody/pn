import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

export const ENVIRONMENT = process.env.NODE_ENV || 'development';
export const DB_DIALECT = 'sqlite';
export const DEV_DB_STORAGE = path.resolve(__dirname, '../database/database.dev.sqlite');
export const TEST_DB_STORAGE = path.resolve(__dirname, '../database/database.test.sqlite');
export const PROD_DB_STORAGE = path.resolve(__dirname, '../database/database.prd.sqlite');

export interface IConfigs {
    [key: string]: {
        dialect: string;
        storage: string;
        url: string;
    };
}

export const configs: IConfigs = {
    development: {
        dialect: 'sqlite',
        storage: DEV_DB_STORAGE,
        url: `sqlite:${DEV_DB_STORAGE}`,
    },
    testing: {
        dialect: 'sqlite',
        storage: TEST_DB_STORAGE,
        url: `sqlite:${TEST_DB_STORAGE}`,
    },
    production: {
        dialect: 'sqlite',
        storage: PROD_DB_STORAGE,
        url: `sqlite:${PROD_DB_STORAGE}`,
    },
};

export const config = configs[ENVIRONMENT];
