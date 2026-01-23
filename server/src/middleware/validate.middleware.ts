import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const handle = (parameters: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                details: errors.array(),
            },
        });
    };
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        success: false,
        error: {
            message: 'Validation failed',
            details: errors.array(),
        },
    });
};
