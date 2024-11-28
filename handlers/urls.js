import { Errors } from "../config/errors.js";
import { urlsDb } from "../persistence/urls.js";
import { hashingHandler } from "./hashing.js";

/**
 * @param {string} shortUrl 
 * @return {Promise<string>} returns longUrl pair of shortUrl provided
 */
async function getLongUrl(shortUrl) {
    return await urlsDb.getLongUrl(shortUrl);
}

/**
 * @param {string} longUrl
 */
async function createShortUrl(longUrl) {
    try {
        return await urlsDb.getShortUrl(longUrl);
    } catch (error) {
        if (error.reason === Errors.NoShortUrl) {
            return await generateShortUrl(longUrl);
        }
        throw error;
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

