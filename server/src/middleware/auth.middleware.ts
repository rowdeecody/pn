import { Request, Response, NextFunction } from 'express';

export const handle = (parameters: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.session && (req.session as any).userId) {
            return next();
        }
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    };
};
