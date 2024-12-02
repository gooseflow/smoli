import { BadRequestError, NotFoundError } from '../../http/errors.js';
import { closeDB, connectDB } from '../../persistence/db.js';
import { urlsDb } from '../../persistence/urls.js';

let db;
let collection;

describe('urlsDb', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(async () => {
        db = await connectDB();
        collection = db.collection("urls");
    });

    afterAll(async () => {
        await closeDB();
    });

    describe('getLongUrl', () => {
        it('returns a long URL if it finds a document', async () => {
            const shortUrl = 'aaa111';
            const longUrl = 'https://example.com/some-long-url-aaa111';
            const id = await createUrlPair(longUrl, shortUrl);

            const result = await urlsDb.getLongUrl(shortUrl);
            expect(result).toBe(longUrl);
            expect(await removeUrlPair(id)).toBe(true);
        });

        it(`throws a NotFoundError if it doesn't find a document`, async () => {
            const shortUrl = 'aaa222';

            await expect(urlsDb.getLongUrl(shortUrl)).rejects.toThrow(NotFoundError);
        });
    });

    describe('shortUrlExists', () => {
        it('returns true if short URL exists', async () => {
            const shortUrl = 'bbb111';
            const longUrl = 'https://example.com/some-long-url-bbb111';
            const id = await createUrlPair(longUrl, shortUrl);

            const result = await urlsDb.shortUrlExists(shortUrl);
            expect(result).toBe(true);
            expect(await removeUrlPair(id)).toBe(true);
        });

        it('returns false if short URL does not exist', async () => {
            const shortUrl = 'bbb222';

            const result = await urlsDb.shortUrlExists(shortUrl);
            expect(result).toBe(false);
        });
    });

    describe('getShortUrl', () => {
        it('returns a short URL if it finds a document', async () => {
            const shortUrl = 'ccc111';
            const longUrl = 'https://example.com/some-long-url-ccc111';
            const id = await createUrlPair(longUrl, shortUrl);

            const result = await urlsDb.getShortUrl(longUrl);
            expect(result).toBe(shortUrl);
            expect(await removeUrlPair(id)).toBe(true);
        });

        it(`throws a NotFoundError if it doesn't find a document`, async () => {
            const longUrl = 'https://example.com/some-long-url-ccc222';

            await expect(urlsDb.getShortUrl(longUrl)).rejects.toThrow(NotFoundError);
        });
    });

    describe('createShortUrl', () => {
        it('returns the insertedId of the URL pair', async () => {
            const shortUrl = 'ddd111';
            const longUrl = 'https://example.com/some-long-url-ddd111';

            const result = await urlsDb.createShortUrl(longUrl, shortUrl);
            expect(result).toHaveProperty('insertedId');
            expect(await removeUrlPair(result.insertedId)).toBe(true);
        });

        it('throws a BadRequestError if longUrl is not unique in the db', async () => {
            const shortUrl = 'ddd222';
            const longUrl = 'https://example.com/some-long-url-ddd222';

            const id = await createUrlPair(longUrl, shortUrl);

            await expect(urlsDb.createShortUrl(longUrl, shortUrl)).rejects.toThrow(BadRequestError);
            expect(await removeUrlPair(id)).toBe(true);
        });
    });

});

async function createUrlPair(longUrl, shortUrl) {
    try {
        const result = await collection.insertOne({ longUrl, shortUrl });
        return result.insertedId;
    } catch (error) {
        console.error(error);
    }
}

async function removeUrlPair(id) {
    try {
        const result = await collection.deleteOne({ _id: id });
        return !!(result.deletedCount === 1);
    } catch (error) {
        console.error(error);
    }
}
