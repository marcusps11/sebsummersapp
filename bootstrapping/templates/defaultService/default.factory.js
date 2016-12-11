export default class {{defaultService}}Service {
    constructor(app) {
        this.app = app;
    }

    init() {
        this.app.factory('{{defaultService}}Service', this.{{defaultService}});
        this.{{defaultService}}.$inject = [];
    }

    {{defaultService}}() {
        return {

        };
    }
}
