import { Collection } from "mongodb"; import { closeDB, connectDB } from "./db.js";

/**
 * @param {string} longUrl
 */
export async function getShortUrl(longUrl) {
    const db = await connectDB();
    const collection = db.collection('urls');

    const doc = await collection.findOne({ longUrl }, { projection: { shortUrl: 1 } });

    if (!doc) {
        return await generateShortUrl(longUrl, collection)
    }

    return doc.shortUrl;
};

/**
 * @param {string} shortUrl
 */
export async function redirectShortUrl(shortUrl) {
    const db = await connectDB();
    const collection = db.collection('urls');

    // redirect logic

}

/**
 * @param {string} longUrl 
 * @param {Collection} collection 
 */
async function generateShortUrl(longUrl, collection) {
    const gen = Math.floor(Math.random() * 100);

    const doc = await collection.findOne({ shortUrl: gen }, { projection: { shortUrl: 1 } })

    if (doc) {
        return await generateShortUrl(longUrl, collection);
    }

    await collection.insertOne({ shortUrl: gen, longUrl })

    return gen;
}
