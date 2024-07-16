import { MongoClient } from "mongodb";

export const client = new MongoClient(process.env.MONGODB_URI!);
const namespace = "chatter.training_data";
export const [dbName, collectionName] = namespace.split(".");
