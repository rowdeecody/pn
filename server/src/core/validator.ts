import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData, Result, ValidationError } from 'express-validator';

export default class Validator {
    public static validation(req: Request, res: Response, next: NextFunction, validations: any[]): void {
        Promise.all(validations.map((validation) => validation.run(req))).then(() => {
            const errors = Validator.errors(req);

            if (errors.isEmpty()) {
                (req as any).validated = Validator.validated(req);
                return next();
            } else {
                (req as any).validated = null;
            }

            return res.status(422).json({
                message: 'Validation Errors',
                errors: errors.array(),
            });
        });
    }

    private static errors(req: Request) {
        const result: Result<ValidationError> = validationResult(req);

        return result.formatWith((error: any) => {
            return { [error.path]: error.msg };
        });
    }

    static validated<T>(req: Request) {
        const validated = matchedData(req, { includeOptionals: false });

        return Object.entries(validated).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key as string] = value;
            }
            return acc;
        }, {} as any);
    }
}
