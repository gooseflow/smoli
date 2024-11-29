import { jest } from '@jest/globals';
import { urlsHandler } from './urls.js';
import { urlsDb } from '../persistence/urls.js';
import { BadRequestError, NotFoundError } from '../http/errors.js';
import { hashingHandler } from './hashing.js';
import { Errors } from '../config/errors.js';

describe('urlsHandler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getLongUrl', () => {
        it('returns a long URL when urlsDb.getLongUrl resolves successfully', async () => {
            const shortUrl = 'abc123';
            const longUrl = 'https://example.com/some-long-url';

            jest.spyOn(urlsDb, 'getLongUrl').mockResolvedValueOnce(longUrl);

            const result = await urlsHandler.getLongUrl(shortUrl);
            expect(result).toBe(longUrl);
            expect(urlsDb.getLongUrl).toHaveBeenCalledWith(shortUrl);
        });

        it('propagates error thrown if urlsDb.getLongUrl rejects', async () => {
            const shortUrl = 'abc123';

            jest.spyOn(urlsDb, 'getLongUrl').mockRejectedValueOnce(new NotFoundError());

            await expect(urlsHandler.getLongUrl(shortUrl)).rejects.toThrow(NotFoundError);
            expect(urlsDb.getLongUrl).toHaveBeenCalledWith(shortUrl);
        });
    });

    describe('createShortUrl', () => {
        it('returns a shortUrl if a longUrl pair exists in the db', async () => {
            const shortUrl = 'abc123';
            const longUrl = 'https://example.com/some-long-url';

            jest.spyOn(urlsDb, 'getShortUrl').mockResolvedValueOnce(shortUrl);

            const result = await urlsHandler.createShortUrl(longUrl);
            expect(result).toBe(shortUrl);
            expect(urlsDb.getShortUrl).toHaveBeenCalledWith(longUrl);
        });

        it('generates a shortUrl if a longUrl pair is not found in the db (urlsDb.getShortUrl rejects with defined reason)', async () => {
            const shortUrl = 'abc123';
            const longUrl = 'https://example.com/some-long-url';

            jest.spyOn(urlsDb, 'getShortUrl').mockRejectedValueOnce(new NotFoundError("", Errors.NoShortUrl));
            jest.spyOn(urlsHandler, 'generateShortUrl').mockResolvedValueOnce(shortUrl);

            const result = await urlsHandler.createShortUrl(longUrl);
            expect(result).toBe(shortUrl);
            expect(urlsDb.getShortUrl).toHaveBeenCalledWith(longUrl);
            expect(urlsHandler.generateShortUrl).toHaveBeenCalledWith(longUrl);
        });

        it('propagates error thrown if urlsDb.getShortUrl rejects with no defined reason', async () => {
            const longUrl = 'https://example.com/some-long-url';

            jest.spyOn(urlsDb, 'getShortUrl').mockRejectedValueOnce(new Error());

            await expect(urlsHandler.createShortUrl(longUrl)).rejects.toThrow(Error);
            expect(urlsDb.getShortUrl).toHaveBeenCalledWith(longUrl);
        });
    });

    describe('generateShortUrl', () => {
        it(`returns a shortUrl when the first shortUrl generated is unique in the db`, async () => {
            const longUrl = 'https://example.com/some-long-url';
            const shortUrl = 'abc123';

            jest.spyOn(hashingHandler, 'hashUrl').mockReturnValueOnce(shortUrl);
            jest.spyOn(urlsDb, 'shortUrlExists').mockResolvedValueOnce(false);
            jest.spyOn(urlsDb, 'createShortUrl').mockResolvedValueOnce({});

            const result = await urlsHandler.generateShortUrl(longUrl);
            expect(result).toBe(shortUrl);
            expect(hashingHandler.hashUrl).toHaveBeenCalledWith(longUrl);
            expect(urlsDb.shortUrlExists).toHaveBeenCalledWith(shortUrl);
            expect(urlsDb.createShortUrl).toHaveBeenCalledWith(longUrl, shortUrl);
        });

        it('returns a shortUrl after successfully regenerating the shortUrl until it is unique in the db', async () => {
            const longUrl = 'https://example.com/some-long-url';
            const shortUrl = 'abc123';
            const attempt1 = 'aaa111';
            const attempt2 = 'bbb222';

            jest.spyOn(hashingHandler, 'hashUrl').mockReturnValueOnce(attempt1);
            jest.spyOn(urlsDb, 'shortUrlExists').mockResolvedValueOnce(true);

            jest.spyOn(hashingHandler, 'hashUrl').mockReturnValueOnce(attempt2);
            jest.spyOn(urlsDb, 'shortUrlExists').mockResolvedValueOnce(true);

            jest.spyOn(hashingHandler, 'hashUrl').mockReturnValueOnce(shortUrl);
            jest.spyOn(urlsDb, 'shortUrlExists').mockResolvedValueOnce(false);
            jest.spyOn(urlsDb, 'createShortUrl').mockResolvedValueOnce({});

            const result = await urlsHandler.generateShortUrl(longUrl);
            expect(result).toBe(shortUrl);
            expect(urlsDb.shortUrlExists).toHaveBeenCalledWith(attempt1);
            expect(urlsDb.shortUrlExists).toHaveBeenCalledWith(attempt2);
            expect(urlsDb.shortUrlExists).toHaveBeenCalledWith(shortUrl);
            expect(hashingHandler.hashUrl).toHaveBeenCalledWith(longUrl);
            expect(hashingHandler.hashUrl).toHaveBeenCalledTimes(3);
            expect(urlsDb.createShortUrl).toHaveBeenCalledWith(longUrl, shortUrl);
        });

        it('propagates error thrown if urlsDb.createShortUrl rejects', async () => {
            const longUrl = 'https://example.com/some-long-url';
            const shortUrl = 'abc123';

            jest.spyOn(hashingHandler, 'hashUrl').mockReturnValueOnce(shortUrl);
            jest.spyOn(urlsDb, 'shortUrlExists').mockResolvedValueOnce(false);
            jest.spyOn(urlsDb, 'createShortUrl').mockRejectedValueOnce(new BadRequestError());

            await expect(urlsHandler.generateShortUrl(longUrl)).rejects.toThrow(BadRequestError);
            expect(hashingHandler.hashUrl).toHaveBeenCalledWith(longUrl);
            expect(urlsDb.shortUrlExists).toHaveBeenCalledWith(shortUrl);
            expect(urlsDb.createShortUrl).toHaveBeenCalledWith(longUrl, shortUrl);
        });
    });
});
