import { Db, MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.DB_URI;

if (!mongoUri) {
  throw new Error("❌ MONGO_URI is not defined in .env");
}

let client: MongoClient;
let db: Db;

export const connectDB = async (): Promise<Db> => {
  if (db) {
    // reuse existing connection
    return db;
  }

  client = new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
      debug: true,
    },
  });

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connected");
    db = client.db("todo");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error("❌ Database not initialized. Call connectDB() first.");
  }
  return db;
};

export const closeDb = async () => {
  if (client) {
    await client.close();
  }
};
