import { createClient } from "@libsql/client";

export async function handler(req, res){
  const client = createClient({
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_KEY,
  });
  await client.execute("CREATE TABLE IF NOT EXISTS fraud_listings (id INTEGER PRIMARY KEY, title TEXT, fraud_category TEXT, date TEXT, source TEXT, source_url TEXT, currency_types TEXT, currency_amount INTEGER, accused_parties TEXT, relavent_addresses TEXT, description TEXT)");
  // const result = await client.execute("SELECT * FROM fraud_listings");
  
  return res.json({
    message: "HALLO"
  })
}
