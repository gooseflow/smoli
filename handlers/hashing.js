import crypto from "node:crypto";

const base62chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function hashUrl(str) {
    const salt = getRandomBase62String(6);
    const hash = crypto.createHash("blake2s256").update(str + salt).digest("hex");

    // convert the first 11 characters (representing up to 44 bits) of the hash to a number
    let base10 = parseInt(hash.substring(0, 11), 16);

    let base62 = "";
    while (base10 > 0) {
        base62 = base62chars[base10 % 62] + base62;
        base10 = Math.floor(base10 / 62);
    }

    return base62.slice(0, 7);
}

function getRandomBase62String(len) {
    const randomVals = crypto.getRandomValues(new Uint32Array(len));
    let s = "";

    for (let i = 0; i < len; i++) {
        const index = randomVals[i] % base62chars.length;
        s += base62chars[index];
    }

    return s;
}

export const hashingHandler = {
    hashUrl
}
