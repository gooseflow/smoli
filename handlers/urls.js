import { urlsDb } from "../persistence/urls.js";
import { hashingHandler } from "./hashing.js";

/**
 * @param {string} longUrl
 */
async function getShortUrl(longUrl) {
    try {
        return await urlsDb.getShortUrl(longUrl);
    } catch (error) {
        return await generateShortUrl(longUrl);
    }
};

async function generateShortUrl(longUrl) {
    let shortUrl = "";
    let urlExists = true;

    do {
        shortUrl = hashingHandler.hashUrl(longUrl);
        urlExists = await urlsDb.shortUrlExists(shortUrl);
    } while (urlExists);

    await urlsDb.createShortUrl(longUrl, shortUrl);

    return shortUrl;
}

export const urlsHandler = {
    getShortUrl
}

