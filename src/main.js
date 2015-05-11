// Base function.
PUMIEPE = function () {
    return {
        "$": $,
        "Persistence": Persistence,
        "Session": Session,
        "showError": Error.throw,
        "route": RouteFactory.facture,
        "navigateTo": RouteFactory.transitionTo
    };
};
