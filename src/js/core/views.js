import baseCtrl from '../view/base/controller/base.controller';
import homeCtrl from '../view/home/controller/home.controller';

export default class ViewCtrl {
    constructor(app) {
        this.app = app;
    }

    init() {
        this.initControllers(
        baseCtrl,
        homeCtrl
    );
    }

    initControllers(
        baseCtrl,
        homeCtrl
   ) {
        this.app.controller('baseCtrl',baseCtrl);
        this.app.controller('homeCtrl',homeCtrl);
    }
}
