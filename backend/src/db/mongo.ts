import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let db: Db;

export async function getDb(): Promise<Db> {
  if (db) return db;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB || 'ai_companion';
  client = new MongoClient(uri);
  await client.connect();
  console.log(`Connected to MongoDB: ${uri}`);
  db = client.db(dbName);
  console.log(`Database selected: ${dbName}`);
  return db;
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}


