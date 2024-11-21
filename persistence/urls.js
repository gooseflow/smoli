import { Collection } from "mongodb";
import { connectDB } from "./db.js";

/**
 * @param {string} longUrl
 */
export async function getShortUrl(longUrl) {
    const db = await connectDB();

    /**
     * @type {Collection} collection
     */
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
    let gen;
    let doc;

    do {
        gen = generateUrl();
        doc = await collection.findOne({ shortUrl: gen }, { projection: { shortUrl: 1 } });
    } while (doc);

    await collection.insertOne({ shortUrl: gen, longUrl });

    return gen;
}

function generateUrl(longUrl) {
    const gen = Math.floor(Math.random() * 100);
    return gen;
}
