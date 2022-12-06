const { flights, reservations } = require("./data");

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("reserve-seats");
    const entries = Object.entries(flights);

    const flight = {
      flight: entries[0][0],
      seats: entries[0][1],
    };
    await db.collection("flights").insertOne(flight);
    await db.collection("reservations").insertMany(reservations);
    console.log("Flights and Reseravtions successfuly added");
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

batchImport();
