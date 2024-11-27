import { urlsDb } from "../persistence/urls.js";
import { hashingHandler } from "./hashing.js";

/**
 * @param {string} shortUrl 
 * @return {string} returns longUrl pair of shortUrl provided
 */
async function getLongUrl(shortUrl) {
    try {
        return await urlsDb.getLongUrl(shortUrl);
    } catch (error) {
        throw new Error("404 Not Found");
    }
}

/**
 * @param {string} longUrl
 */
async function createShortUrl(longUrl) {
    try {
        return await urlsDb.getShortUrl(longUrl);
    } catch (error) {
        return await generateShortUrl(longUrl);
    }
};

/**
 * @param {string} longUrl
 */
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
    createShortUrl,
    getLongUrl
}

