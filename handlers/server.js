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

export const server = {
    getServerUrl,
    isSameSite
}

