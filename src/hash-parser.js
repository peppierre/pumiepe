HashParser = function () {
};
HashParser.parseFromUrl = function (url) {
    return url.split("#")[1] || "/";
};
HashParser.parseHashesFromChangeEvent = function (event) {
    return {
        from: HashParser.parseFromUrl(event.oldURL),
        to: HashParser.parseFromUrl(event.newURL)
    };
};
HashParser.normalize = function (hash) {
    hash = (hash.charAt(0) === "#" ? hash.substr(1, hash.length) : hash);
    hash = (hash.charAt(0) !== "/" ? "/" : "") + hash;
    hash = (hash.charAt(hash.length - 1) !== "/" ? hash : hash.substr(0, hash.length - 1));
    return hash;
};
