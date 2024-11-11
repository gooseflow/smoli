import app from './app.js';
import { MongoClient } from 'mongodb'
import { initDatabase } from './db.js';

const port = process.env.PORT || 3000;

// Connection URL
const url = 'mongodb://root:example@localhost:27017';
const client = new MongoClient(url);

app.listen(port, () => {
    initDatabase(client)
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());
    console.log(`Example app listening on port ${port}`);
});
