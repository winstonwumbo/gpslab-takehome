import { createClient } from "@libsql/client";

export default async function handler(req, res){
  const client = createClient({
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_KEY,
  });
  await client.execute("CREATE TABLE IF NOT EXISTS fraud_listings (id INTEGER PRIMARY KEY, title TEXT, fraud_category TEXT, date TEXT, source TEXT, source_url TEXT, currency_types TEXT, currency_amount INTEGER, accused_parties TEXT, relavent_addresses TEXT, description TEXT)");
  // const result = await client.execute("SELECT * FROM fraud_listings");
  
  if(req.method === "POST"){
    const data = req.body;
    return res.json(data);
  } else if (req.method === "GET"){
    const result = {
      "data": await client.execute("SELECT * FROM fraud_listings"),
      "category_frequency": await client.execute("SELECT fraud_category, COUNT(fraud_category) as most_frequent FROM fraud_listings GROUP BY fraud_category ORDER BY most_frequent DESC LIMIT 1"),
      "source_frequency": await client.execute("SELECT source, COUNT(source) as most_frequent FROM fraud_listings GROUP BY source ORDER BY most_frequent DESC LIMIT 1"),
      "currency_frequency": await client.execute("SELECT currency_types, COUNT(currency_types) as most_frequent FROM fraud_listings GROUP BY currency_types ORDER BY most_frequent DESC LIMIT 1"),    }
    return res.json(result);
    // figure out year_with_most_stolen and amount_stolen for that year
  }
  return res.json({
    message: "HALLO"
  })
}
