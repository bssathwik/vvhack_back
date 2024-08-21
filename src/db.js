import { MongoClient } from "mongodb";

let db;
async function connectToDB(cb) {
    // const url = "mongodb://localhost:27017"
    const client = new MongoClient('mongodb+srv://balabhadrasaisathwik:balabhadrasaisathwik@cluster0.hc6tt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    await client.connect();
    db = client.db("eternal_database");
    cb();
}

// connectToDB()

export { connectToDB, db };