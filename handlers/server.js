function getServerUrl(req) {
    const protocol = req.protocol;
    const host = req.get('Host');
    return `${protocol}://${host}`;
}

function isSameSite(req) {
    const serverUrl = server.getServerUrl(req);
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

export const server = {
    getServerUrl,
    isSameSite,
    isValidUrl
}

