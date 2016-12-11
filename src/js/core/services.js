const serviceBootstrapper = {
    applicationServices: [],

    init(app = {}) {
        this.app = app;
        this.bootstrapServices(
        );

        this.initServices();
    },

    bootstrapServices(...services) {
        this.applicationServices = services.map((Service) => {
            const service = new Service(this.app);

            return service;
        });
    },

    initServices() {
        this.applicationServices.forEach((service) => {
            service.init();
        });
    }
};

export default serviceBootstrapper
