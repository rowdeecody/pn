import * as auth from '../middleware/auth.middleware';
import * as validate from '../middleware/validate.middleware';
import * as error from '../middleware/error.middleware';

export const middlewares: { [key in string]: any } = {
    auth,
    validate,
    error,
};
