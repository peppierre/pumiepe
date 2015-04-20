RouteConstant = function () {

};
RouteConstant.ROUTE_PATH_INDEX = "/";
RouteConstant.ROUTE_PATH_LOADING = "/loading";
RouteConstant.ROUTE_PATH_ERROR = "/error";
RouteConstant.ROUTE_TEMPLATEFILE_INDEX = "index.hbs";
RouteConstant.ROUTE_TEMPLATEFILE_LOADING = "loading.hbs";
RouteConstant.ROUTE_TEMPLATEFILE_ERROR = "error.hbs";
RouteConstant.ROUTE_TEMPLATE_INDEX = "<h1>Application is running</h1>";
RouteConstant.ROUTE_TEMPLATE_LOADING = "Loading... Please wait!";
RouteConstant.ROUTE_TEMPLATE_ERROR = "<h1>{{code}} - {{name}}</h1><div>{{details}}</div>";
RouteFactory = (function () {
    var
        Route,
        Public,
        routes,
        lookupMatchingRoute,
        tearDownRoute,
        startUpRoute;
    routes = {};
    lookupMatchingRoute = function (lookupHash) {
        var matchingHashes, lookupHashParts;
        lookupHashParts = HashParser.normalize(lookupHash).split("/");
        matchingHashes = (function () {
            var routeKey, examinedHashParts, idx, partCount, result;
            result = [];
            for (routeKey in routes) {
                if (routes.hasOwnProperty(routeKey)) {
                    examinedHashParts = HashParser.normalize(routeKey).split("/");
                    partCount = examinedHashParts.length;
                    idx = 0;
                    if (partCount === lookupHashParts.length) {
                        while ((examinedHashParts[idx] === lookupHashParts[idx] || examinedHashParts[idx][0] === ":") && idx < partCount) {
                            if (examinedHashParts[idx][0] === ":") {
                                routes[routeKey].parameters[examinedHashParts[idx].substr(1)] = lookupHashParts[idx];
                            }
                            idx += 1;
                        }
                    }
                    if (idx === partCount) {
                        result.push(routes[routeKey]);
                    }
                }
            }
            return result;
        })();
        return ((matchingHashes.length > 0) ? matchingHashes[0] : undefined);
    };
    tearDownRoute = function (fromRoute) {
        var route;
        route = lookupMatchingRoute(fromRoute);
        if (route !== undefined) {
            route.navigateAway();
        }
        lookupMatchingRoute(RouteConstant.ROUTE_PATH_LOADING).navigateTo();
    };
    startUpRoute = function (toRoute) {
        var route;
        lookupMatchingRoute(RouteConstant.ROUTE_PATH_LOADING).navigateAway();
        route = lookupMatchingRoute(toRoute);
        if (route !== undefined) {
            route.navigateTo();
        } else {
            Error.throw(404, "No route found: " + toRoute, "Requested route was not defined. Please, contact to application owner!");
        }
    };
    $(root).on(
        "hashchange",
        function (event) {
            var hashes;
            hashes = HashParser.parseHashesFromChangeEvent(event.originalEvent);
            if (hashes.to === RouteConstant.ROUTE_PATH_LOADING) {
                return;
            }
            tearDownRoute(hashes.from);
            startUpRoute(hashes.to);
        }
    );
    $(document).ready(
        function () {
            if (lookupMatchingRoute(RouteConstant.ROUTE_PATH_INDEX) === undefined) {
                Public.facture(
                    RouteConstant.ROUTE_PATH_INDEX,
                    RouteConstant.ROUTE_TEMPLATEFILE_INDEX
                );
            }
            startUpRoute(HashParser.normalize(root.location.hash));
        }
    );
    Route = function (view, routeConfig) {
        var
            __self,
            viewPath,
            viewSource,
            parsedSource,
            model,
            beforeReceivingModel,
            onReceivingModel,
            afterReceivingModel,
            setupModel,
            setupView,
            methodName;
        __self = this;
        viewPath = view;
        viewSource = null;
        parsedSource = null;
        model = {};
        beforeReceivingModel = function () {
            return true;
        };
        onReceivingModel = function (params) {
            return {};
        };
        afterReceivingModel = function (rawModel) {
            return rawModel;
        };
        setupModel = function () {
            return new Promise(
                function (fulfill, reject) {
                    if (true) {
                        fulfill(this);
                    } else {
                        reject();
                    }
                }
            ).then(
                function (result) {
                    return __self.beforeModel.apply(__self);
                }
            ).then(
                function (result) {
                    return __self.onModel.apply(__self, [__self.parameters]);
                }
            ).then(
                function (result) {
                    model = result;
                    return __self.afterModel.apply(__self, [model]);
                }
            ).then(
                function (result) {
                    model = result;
                    return true;
                },
                function (error) {
                    Error.throw(404, "Unable to navigate to route", "Something unusual happend while getting relevant model. Please, contact to application owner!");
                }
            );
        };
        setupView = function () {
            if (viewSource === null) {
                if (viewPath === RouteConstant.ROUTE_TEMPLATEFILE_INDEX) {
                    viewSource = Handlebars.compile(RouteConstant.ROUTE_TEMPLATE_INDEX);
                }
                if (viewPath === RouteConstant.ROUTE_TEMPLATEFILE_ERROR) {
                    viewSource = Handlebars.compile(RouteConstant.ROUTE_TEMPLATE_ERROR);
                }
                if (viewPath === RouteConstant.ROUTE_TEMPLATEFILE_LOADING) {
                    viewSource = Handlebars.compile(RouteConstant.ROUTE_TEMPLATE_LOADING);
                }
                return Promise.resolve(
                    $.ajax("/views/" + viewPath)
                ).then(
                    function (result) {
                        viewSource = Handlebars.compile(result);
                    },
                    function (error) {
                        if ((viewPath !== RouteConstant.ROUTE_TEMPLATEFILE_INDEX) && (viewPath !== RouteConstant.ROUTE_TEMPLATEFILE_ERROR) && (viewPath !== RouteConstant.ROUTE_TEMPLATEFILE_LOADING)) {
                            Error.throw(404, "View is unavailable for " + viewPath, "Something unusual happend while getting relevant template. Please, contact to application owner!");
                        }
                    }
                );
            } else {
                return true;
            }
        };
        this.parameters = {};
        this.beforeModel = beforeReceivingModel;
        this.onModel = onReceivingModel;
        this.afterModel = afterReceivingModel;
        this.navigateAway = function () {
            this.setdownEventHandlers();
        };
        this.navigateTo = function () {
            Promise.all(
                [
                    setupModel.call(this),
                    setupView.call(this)
                ]
            ).then(
                function () {
                    $("body main").html(viewSource(model));
                    __self.setupEventHandlers();
                },
                function (error) {
                    Error.throw(404, "Unable to navigate to route", "Something unusual happened while getting relevant model or template. Please, contact to application owner!");
                }
            );
        };
        this.setupEventHandlers = function () {
            Consoler.log("Setup event handlers");
        };
        this.setdownEventHandlers = function () {
            Consoler.log("Setdown event handlers");
        };
        for (methodName in routeConfig) {
            if (routeConfig.hasOwnProperty(methodName) && (Route.unmutables.indexOf(methodName) < 0)) {
                this[methodName] = routeConfig[methodName];
            }
        }
    };
    Route.unmutables = ["parameters", "view", "model", "navigateAway", "navigateTo"];
    Public = {
        transitionTo: function (hash) {
            root.location.replace(root.location.href.substr(0, root.location.href.indexOf(root.location.hash)) + "#" + hash);
        },
        facture: function (routePath, view, routeConfig) {
            routePath = HashParser.normalize(routePath);
            if (routes[routePath]) {
                Consoler.warn("Duplicated route path: " + routePath);
                return;
            }
            routes[routePath] = new Route(view, routeConfig);
        }
    };
    Public.facture(
        RouteConstant.ROUTE_PATH_ERROR,
        RouteConstant.ROUTE_TEMPLATEFILE_ERROR,
        {
            onModel: function () {
                return JSON.parse(Session.getItem(Error.STORAGE_VARIABLE_NAME));
            }
        }
    );
    Public.facture(
        RouteConstant.ROUTE_PATH_LOADING,
        RouteConstant.ROUTE_TEMPLATEFILE_LOADING
    );
    return Public;
})();
