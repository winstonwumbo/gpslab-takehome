import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_KEY,
});

export default async function handler(req, res){
  await client.execute("CREATE TABLE IF NOT EXISTS fraud_listings (id INTEGER PRIMARY KEY, title TEXT, fraud_category TEXT, date TEXT, source TEXT, source_url TEXT, currency_type TEXT, currency_amount INTEGER, description TEXT)");
  
  if(req.method === "POST"){
    // const data = req.body;
    try {
      const retrieveTitles = await client.execute("SELECT title FROM fraud_listings");
      const existingTitles = new Set(retrieveTitles.rows.map(row => row.title));
      
      // Filter out items that already exist in the database
      const newItems = req.body.data.filter(item => !existingTitles.has(item.title));
      
      if (newItems.length === 0) {
        return res.status(200).json({
          success: true,
          message: "All items already exist in the database",
        });
      }

      // Prepare batch insert statements
      const statements = newItems.map(item => ({
        sql: `INSERT INTO fraud_listings 
              (title, fraud_category, date, source, source_url, currency_type, currency_amount, description) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          String(item.title || 'No Title'),
          String(item.category || ''),
          String(item.date || 'N/A'),
          String(item.source || ''),
          String(item.source_url || ''),
          String(item.currency_type || ''),
          Number(item.currency_amount) || 0,
          String(item.description || '')  
        ]
      }));
  
      // Execute in batches (Turso has limits on batch size)
      const batchSize = 100;
      for (let i = 0; i < statements.length; i += batchSize) {
        const batch = statements.slice(i, i + batchSize);
        await client.batch(batch);
        console.log(`Inserted ${i + batch.length} records`);
      }
  
      return res.status(201).json({
        success: true,
        message: `Successfully imported ${req.body.length} records`,
      });
    } catch (error) {
      console.error('Error during import:', error);
    }  
  } else if (req.method === "GET"){
    const sourceFilter = req.query.sourceFilter;
    let result;
    if(sourceFilter == "AllSources"){
      result = {
        "data": await client.execute("SELECT * FROM fraud_listings ORDER BY date ASC"),
        "category_frequency": await client.execute("SELECT fraud_category, COUNT(fraud_category) as most_frequent FROM fraud_listings GROUP BY fraud_category ORDER BY most_frequent DESC LIMIT 1"),
        "source_frequency": await client.execute("SELECT source, COUNT(source) as most_frequent FROM fraud_listings GROUP BY source ORDER BY most_frequent DESC LIMIT 1"),
        "currency_frequency": await client.execute("SELECT currency_type, COUNT(currency_type) as most_frequent FROM fraud_listings GROUP BY currency_type ORDER BY most_frequent DESC LIMIT 1"),
        "fraud_timeline": await client.execute(`SELECT date, COUNT(*) AS fraud_count FROM fraud_listings WHERE date != 'N/A' GROUP BY date ORDER BY date ASC`),    
        "amount_stolen_by_category": await client.execute(`SELECT fraud_category, SUM(currency_amount) AS total_amount_stolen, SUM(currency_amount) / COUNT(*) AS average_per_case FROM fraud_listings WHERE currency_amount > 0 and fraud_category != '' GROUP BY fraud_category ORDER BY total_amount_stolen DESC LIMIT 5`),
      }
    } else {
      result = {
        "data": await client.execute({
          sql: "SELECT * FROM fraud_listings WHERE source = ? ORDER BY date ASC",
          args: [sourceFilter]
        }),
        "category_frequency": await getFrequency('fraud_category', sourceFilter),
        "source_frequency": await getFrequency('source', sourceFilter),
        "currency_frequency": await getFrequency('currency_type', sourceFilter),
        "fraud_timeline": await client.execute(`SELECT date, COUNT(*) AS fraud_count FROM fraud_listings WHERE date != 'N/A' AND source = '${sourceFilter}' GROUP BY date ORDER BY date ASC`),
        "amount_stolen_by_category": await client.execute(`SELECT fraud_category, SUM(currency_amount) AS total_amount_stolen, SUM(currency_amount) / COUNT(*) AS average_per_case FROM fraud_listings WHERE currency_amount > 0 and fraud_category != '' and source = '${sourceFilter}' GROUP BY fraud_category ORDER BY total_amount_stolen DESC LIMIT 5`),
      }
    }
    
    return res.json(result);
    // figure out year_with_most_stolen and amount_stolen for that year
  }
}

async function getFrequency(column, filter) {
  return await client.execute({
    sql: `SELECT ${column}, COUNT(${column}) as most_frequent 
          FROM fraud_listings 
          WHERE source = ?
          GROUP BY ${column} 
          ORDER BY most_frequent DESC 
          LIMIT 1`,
    args: [filter]
  });
}
