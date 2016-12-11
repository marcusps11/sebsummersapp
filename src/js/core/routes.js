import baseRoute from '../view/base/base.config';
import homeRoute from '../view/home/home.config';

function injectRoutes(...routes) {
    return routes;
}

export default injectRoutes(
    baseRoute,
    homeRoute
);
