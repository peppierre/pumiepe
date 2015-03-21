/* jshint unused: false */
/*globals document, console, $, Promise, Handlebars, Error */
(function (root, undefined) {
    "use strict";
    /* pumiepe main */
    var PUMIEPE, Persistence, Session, Consoler, Error, HashParser, RouteConstant, RouteFactory;

    if (typeof $ === "undefined") {
        throw new Error("No jQuery library found.");
    }

    Session = root.sessionStorage;
    Persistence = root.localStorage;
