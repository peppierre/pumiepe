Error = function () {/**/
};

Error.STORAGE_VARIABLE_NAME = "latest-error";
Error.throw = function (code, name, details) {
    Session.setItem(
        Error.STORAGE_VARIABLE_NAME,
        JSON.stringify(
            {
                "code" : code,
                "name" : name,
                "details" : details
            }
        )
    );
    RouteFactory.transitionTo(RouteConstant.ROUTE_PATH_ERROR);
};
