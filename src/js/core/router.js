import routes from './routes';
import ViewCtrl from './views';

export default class Router {

    constructor(app) {
        this.app = app;
        this.routes = routes;
    }

    init() {
        this.bootstrapStates();
        this.setApplicationRoutes();
    }

    setApplicationRoutes() {
        this.routes.forEach((route) => {
            this.defineState(route);
        });
    }

    defineState(route) {
        this.app.config([
            '$stateProvider',
        function(
            $stateProvider
        ) {
            let stateObj = {};

            for (let key in route) {
                if (route.hasOwnProperty(key)) {
                    stateObj[key] = route[key];
                }
            }

            $stateProvider.state(route.name, stateObj);
        }]);
    }

    bootstrapStates() {
        const viewStates = new ViewCtrl(this.app);

        viewStates.init();
    }
}

export default Router;
