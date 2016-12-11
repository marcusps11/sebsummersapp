# Angular boilerplate

- Gulp
- ES2015 (Babel compile to ES5)
- Browserify

This boilerplate follows closely the concepts and deisgn patterns as set out in the [John Pappa styleguide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md)

## Install

- `npm install`
- `npm run initApp [applicationName]`

## Run   
```
gulp
```

## Usage

- To create a new state view `gulp view --name=[viewName]`
- To create a new module `gulp module --name=[moduleName]`
- To create a new service `gulp service --name=[serviceName]`

### Ui.router nested view

The application bootstraps it's state routes by passing a config object into the $stateProvider within the app's router.
To enable nested states simply modify the new state view's config object by appending the parent to the name property and including
`<ui-view></ui-view>` within the parent state view's template.

Going to `baseurl.com/checkout` would show the parent view, where as going to `baseurl.com/checkout/:basketId` would show a nested child view within the parent.

#### Example

```javascript
//Parent config file (checkout.config.js)

const checkoutRoute = {
    name: 'base.checkout',
    url: 'checkout',
    templateUrl: '/src/js/view/checkout/template/checkout.html',
    controller: 'checkoutCtrl',
    controllerAs: 'checkout'
};

// Nested child state view (basket.config.js)

const basketRoute = {
    name: 'base.checkout.basket',
    url: '/:basketId',
    templateUrl: '/src/js/view/basket/template/basket.html',
    controller: 'basketCtrl',
    controllerAs: 'basket'
};
```
