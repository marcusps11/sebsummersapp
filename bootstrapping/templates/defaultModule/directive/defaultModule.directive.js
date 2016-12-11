{{defaultModule}}.$inject = [];

function {{defaultModule}}() {

    function {{defaultModule}}Link(scope, element, attrs) {

    }

    return {
        restrict: 'EA',
        link: {{defaultModule}}Link,
        templateUrl: '/src/js/module/{{defaultModule}}/view/template.html',
        controller: '{{defaultModule}}Ctrl'
    };
}

export default {{defaultModule}};
