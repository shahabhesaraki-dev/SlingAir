"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
// const { v4: uuidv4 } = require("uuid");

// use this data. Changes will persist until the server (backend) restarts.
// const { flights, reservations } = require("./data");

const { MongoClient, ObjectId } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// returns a list of all flights
const getFlights = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("reserve-seats");

    const result = await db.collection("flights").find().toArray();

    const flightsNumber = result.map((flight) => {
      return flight.flight;
    });

    if (result) {
      res.status(200).json({ status: 200, flights: flightsNumber });
    } else {
      res.status(404).json({ status: 404, message: "Not Found" });
    }
    client.close();
  } catch (err) {
    console.log(err);
  }
};

// returns all the seats on a specified flight
const getFlight = async (req, res) => {
  const flightNumber = req.params.flight;

  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("reserve-seats");
    const result = await db
      .collection("flights")
      .findOne({ flight: flightNumber });

    client.close();

    if (result) {
      res.status(200).json({ status: 200, data: result });
    }
  } catch (err) {
    console.log(err);
  }
};

// returns all reservations
const getReservations = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("reserve-seats");

    const result = await db.collection("reservations").find().toArray();

    if (result) {
      res.status(200).json({ status: 200, reservations: result });
    } else {
      res.status(404).json({ status: 404, message: "Not Found" });
    }
    client.close();
  } catch (err) {
    console.log(err);
  }
};

// returns a single reservation
const getSingleReservation = async (req, res) => {
  const { reservation } = req.params;

  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("reserve-seats");
    const result = await db
      .collection("reservations")
      .findOne({ _id: ObjectId(reservation) });

    if (result) {
      res.status(200).json({ status: 200, data: result });
    }
    client.close();
  } catch (err) {
    console.log(err);
  }
};

// creates a new reservation
const addReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const seatNumber = req.body.seat;
  const flightNumber = req.body.flight;

  try {
    await client.connect();
    const db = client.db("reserve-seats");
    const result = await db.collection("reservations").insertOne(req.body);

    console.log(result);
    const flights = await db
      .collection("flights")
      .findOne({ flight: flightNumber });

    console.log(flights);

    const speceficSeat = flights.seats.findIndex((seat) => {
      if (seat._id === seatNumber) {
        return seat;
      }
    });

    const newValues = {
      $set: { [`seats.${speceficSeat}.isAvailable`]: false },
    };

    const updateSeat = await db
      .collection("flights")
      .updateOne({ flight: flightNumber }, newValues);

    if (result && updateSeat.modifiedCount === 1) {
      res.status(200).json({
        status: 200,
        data: {
          reservedId: result.insertedId.toString(),
          reservation: req.body,
        },
        message: "",
      });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

// updates an existing reservation
const updateReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  const seatNumber = req.body.seat;
  const flightNumber = req.body.flight;
  const givenName = req.body.givenName;
  const surname = req.body.surname;
  const email = req.body.email;

  try {
    await client.connect();
    const db = client.db("reserve-seats");

    const reservations = await db.collection("reservations").updateOne(
      { flight: flightNumber, seat: seatNumber },
      {
        $set: {
          flight: flightNumber,
          seat: seatNumber,
          givenName: givenName,
          surname: surname,
          email: email,
        },
      }
    );

    if (reservations.modifiedCount === 1) {
      res.status(201).json({ status: 201, reservation: req.body });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

const updateReservationById = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  const seatNumber = req.body.seat;
  const flightNumber = req.body.flight;
  const givenName = req.body.givenName;
  const surname = req.body.surname;
  const email = req.body.email;

  const { reservationId } = req.params;

  // we meed to update the flights colleciton to make the current seat avaialbe
  // and the new seat not

  try {
    await client.connect();
    const db = client.db("reserve-seats");

    const oldOrder = await db
      .collection("reservations")
      .findOne({ _id: ObjectId(reservationId) });

    const newOrder = await db.collection("reservations").updateOne(
      { _id: ObjectId(reservationId) },
      {
        $set: {
          flight: flightNumber,
          seat: seatNumber,
          givenName: givenName,
          surname: surname,
          email: email,
        },
      }
    );

    if (newOrder.modifiedCount === 1) {
      if (oldOrder.seat !== seatNumber) {
        const flights = await db
          .collection("flights")
          .findOne({ flight: oldOrder.flight });

        const speceficOldSeat = flights.seats.findIndex((seat) => {
          if (seat._id === oldOrder.seat) {
            return seat;
          }
        });

        await db.collection("flights").updateOne(
          { flight: flightNumber },
          {
            $set: { [`seats.${speceficOldSeat}.isAvailable`]: true },
          }
        );

        const speceficNewSeat = flights.seats.findIndex((seat) => {
          if (seat._id === seatNumber) {
            return seat;
          }
        });

        await db.collection("flights").updateOne(
          { flight: flightNumber },
          {
            $set: { [`seats.${speceficNewSeat}.isAvailable`]: false },
          }
        );

        res.status(201).json({ status: 201, reservation: req.body });
      }
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

// deletes a specified reservation
const deleteReservation = async (req, res) => {
  const _id = req.params.reservation;

  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("reserve-seats");
    const reservation = await db
      .collection("reservations")
      .findOne({ _id: ObjectId(_id) });

    const flightNumber = reservation.flight;

    const flights = await db
      .collection("flights")
      .findOne({ flight: flightNumber });
    const speceficSeat = flights.seats.findIndex((seat) => {
      if (seat._id === reservation.seat) {
        return seat;
      }
    });

    const newValues = {
      $set: { [`seats.${speceficSeat}.isAvailable`]: true },
    };

    const updateSeat = await db
      .collection("flights")
      .updateOne({ flight: flightNumber }, newValues);

    const deleteReservation = await db
      .collection("reservations")
      .deleteOne({ _id: ObjectId(_id) });

    if (
      deleteReservation.deletedCount === 1 &&
      updateSeat.modifiedCount === 1
    ) {
      res
        .status(200)
        .json({ status: 200, message: "Reservation successfully removed" });
    }
    client.close();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservation,
  getSingleReservation,
  deleteReservation,
  updateReservation,
  updateReservationById,
};
