import { Request as ExpressRequest, Response, NextFunction } from 'express';

interface Request extends ExpressRequest {
    validated?: any;
    auth?: any;
}

export { Request, Response, NextFunction };
