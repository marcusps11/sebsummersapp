const moduleBootstrapper = {
    applicationModules: [],

    init() {
        this.bootstrapModules(
        );

        this.initModules();
    },

    bootstrapModules(...modules) {
        this.applicationModules = modules.map((Module) => {
            const module = new Module();

            return module;
        });
    },

    initModules() {
        this.applicationModules.forEach((module) => {
            module.init();
        });
    }
};

export default moduleBootstrapper
