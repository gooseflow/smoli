import { MongoClient } from "mongodb";

const url = "mongodb://root:example@localhost:27017";
const client = new MongoClient(url);
const dbName = "myProject";

let db = null;

export async function connectDB() {
    if (!db) {
        try {
            await client.connect();
            db = client.db(dbName);
            console.log("MongoDB connected");
        } catch (error) {
            console.error("Error connecting to MongoDb:", error);
            throw new Error("Failed to connect to the database");
        }
    }
    return db;
}

export async function closeDB() {
    try {
        await client.close();
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
    }
}

export async function initDBConnection() {
    try {
        await connectDB();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

