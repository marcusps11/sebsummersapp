import {{defaultModule}}Ctrl from './controller/{{defaultModule}}Module.controller';
import {{defaultModule}} from './directive/{{defaultModule}}Module.directive';

export default class {{defaultModule}}Module {
    init() {
        angular.module('{{defaultModule}}', []);
        angular.module('{{defaultModule}}').controller('{{defaultModule}}Ctrl', {{defaultModule}}Ctrl);
        angular.module('{{defaultModule}}').directive('{{defaultModule}}', {{defaultModule}});
    }
}

