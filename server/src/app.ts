import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router';
import Middleware from './core/middleware';

const app: Application = express();
const version: string = process.env.VERSION || 'v1';

// tighten CORS for API endpoints; allow credentials and respect ALLOWED_ORIGIN if set
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(
    cors({
        origin: allowedOrigin === '*' ? true : allowedOrigin,
        credentials: true,
    })
);
// set a stricter referrer policy to avoid browser default 'strict-origin-when-cross-origin' if desired
app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
});
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(`/api/${version}`, router);
app.use(express.static(__dirname + '/views/public'));
app.use(Middleware.handle('error'));

export default app;
