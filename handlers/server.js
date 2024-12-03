function getServerUrl(req) {
    const protocol = req.protocol;
    const host = req.get('Host');
    return `${protocol}://${host}`;
}

function isSameSite(req) {
    const serverUrl = serverHandler.getServerUrl(req);
    const referer = req.get('Referer');
    return referer && referer.startsWith(serverUrl);
}

function isValidUrl(urlString) {
    try {
        return !!(new URL(urlString));
    } catch {
        return false;
    }
}

export const serverHandler = {
    getServerUrl,
    isSameSite,
    isValidUrl
}

