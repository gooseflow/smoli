import { NotFoundError } from '../../http/errors.js';
import { closeDB, connectDB } from '../../persistence/db.js';
import { urlsDb } from '../../persistence/urls.js';

describe('urlsDb', () => {
    let db;
    let collection;

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
            const longUrl = 'https://example.com/some-long-url';
            const id = await createUrlPair(longUrl, shortUrl);

            const result = await urlsDb.getLongUrl(shortUrl);
            expect(result).toBe(longUrl);
            expect(await removeUrlPair(id)).toBe(true);
        });

        it(`throws a NotFoundError if it doesn't find a document`, async () => {
            const shortUrl = 'bbb222';

            await expect(urlsDb.getLongUrl(shortUrl)).rejects.toThrow(NotFoundError);
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
