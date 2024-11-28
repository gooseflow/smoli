import { jest } from '@jest/globals';
import { urlsHandler } from './urls.js';
import { urlsDb } from '../persistence/urls.js';
import { NotFoundError } from '../http/errors.js';

describe('urlsHandler.getLongUrl', () => {
    it('should return the long URL when urlsDb.getLongUrl resolves successfully', async () => {
        const shortUrl = 'smo.li/abc123';
        const longUrl = 'https://example.com/some-long-url';

        jest.spyOn(urlsDb, 'getLongUrl').mockResolvedValueOnce(longUrl);

        const result = await urlsHandler.getLongUrl(shortUrl);
        expect(result).toBe(longUrl);
        expect(urlsDb.getLongUrl).toHaveBeenCalledWith(shortUrl);
    });

    it('should propagate error thrown if urlsDb.getLongUrl rejects', async () => {
        const shortUrl = 'smo.li/abc123';
        const err = new NotFoundError('test');

        jest.spyOn(urlsDb, 'getLongUrl').mockRejectedValueOnce(err);

        await expect(urlsHandler.getLongUrl(shortUrl)).rejects.toThrowError(err);
        expect(urlsDb.getLongUrl).toHaveBeenCalledWith(shortUrl);
    });
});

