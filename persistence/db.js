import { MongoClient } from "mongodb";
import { Env } from "../config/env.js";

const url = process.env.MONGO_URL;
const client = new MongoClient(url);
const dbName = getDbName();

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

function getDbName() {
    switch (process.env.SMOLI_ENV) {
        case Env.prod: return process.env.DB_NAME_PROD;
        case Env.dev: return process.env.DB_NAME_DEV;
        case Env.test: return process.env.DB_NAME_TEST;
    }
}
