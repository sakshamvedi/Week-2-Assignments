const mongoose = require("mongoose");
const express = require("express");

const app = express();

async function dbConnect() {
    try {
        const connectionString = await app.connect("mongodb+srv://vishu:vishu123@cluster0.6q8ywme.mongodb.net/");
        console.log(connectionString);

    } catch (error) {
        console.log(error);
    }
}

export default dbConnect;