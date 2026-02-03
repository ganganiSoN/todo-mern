import { MongoClient, ServerApiVersion } from "mongodb";
// process.loadEnvFile("../../.env");
const uri = "mongodb://root:Password123@localhost:27017/" || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    loggerLevel: "debug",
  },
});

try {
  // connect to client server
  await client.connect();
  // send ping
  await client.db("admin").command({ ping: 1 });
} catch (error) {
  console.error("error", error);
}

let db = client.db("todo");

export default db;
