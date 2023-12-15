import express from "express";
import { port } from "./config";

const app = express();

app.listen (port,() => {
  console.log ('App is listening to port: ${PORT}');
});





/*
//First sample to build an array to display data in client side
app.get("/api", (req, res) => {
    res.json({"users": ["Sebastian","Matias","Molly","Ember","test"] })
})

app.listen(5000, () => { console.log("Server started on port 5000") })
*/




