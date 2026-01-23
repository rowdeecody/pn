import { middlewares } from '../config/middleware.config';

export default class Middleware {
    static getMiddlewareBy(name: String) {
        const [middleware_name, parameters = ''] = name.split(':');
        const middleware_class = middlewares[middleware_name];

        if (middleware_class) {
            const parsed_parameters = parameters.split('|').filter((p) => p !== '');

            return {
                found: true,
                middleware_class,
                parameters: parsed_parameters,
            };
        }

        return { found: false };
    }

    static handle(...middleware_names: any) {
        const middlewares = [];

        for (const middleware_name of middleware_names) {
            const { found, middleware_class, parameters } = this.getMiddlewareBy(middleware_name);

            if (found) {
                middlewares.push(middleware_class.handle(parameters));
            }
        }

        return middlewares;
    }
}
