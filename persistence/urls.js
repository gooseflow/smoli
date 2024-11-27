import { Collection } from "mongodb";
import { connectDB } from "./db.js";

/**
 * @param {string} shortUrl 
 */
async function getLongUrl(shortUrl) {
    const db = await connectDB();
    /**
     * @type {Collection} collection
     */
    const collection = db.collection('urls');

    const doc = await collection.findOne({ shortUrl }, { projection: { longUrl: 1 } });
    if (!doc) {
        throw new Error('404 longUrl pair not found for given shortUrl');
    }

    return doc.longUrl;
}

/**
 * @param {string} shortUrl
 */
async function shortUrlExists(shortUrl) {
    const db = await connectDB();
    /**
     * @type {Collection} collection
     */
    const collection = db.collection('urls');

    return !!(await collection.findOne({ shortUrl }));
}

/**
 * @param {string} longUrl
 */
async function getShortUrl(longUrl) {
    const db = await connectDB();
    /**
     * @type {Collection} collection
     */
    const collection = db.collection('urls');

    const doc = await collection.findOne({ longUrl }, { projection: { shortUrl: 1 } });
    if (!doc) {
        throw new Error('404 shortUrl pair not found for given longUrl');
    }

    return doc.shortUrl;
}

async function createShortUrl(longUrl, shortUrl) {
    const db = await connectDB();
    /**
     * @type {Collection} collection
     */
    const collection = db.collection('urls');

    const doc = await collection.findOne({ longUrl }, { projection: { shortUrl: 1 } });
    if (doc) {
        throw new Error('400 shortUrl pair already exists for provided longUrl');
    }

    return await collection.insertOne({ longUrl, shortUrl });
}

export const urlsDb = {
    shortUrlExists,
    getShortUrl,
    createShortUrl,
    getLongUrl
}

