import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import { Hats } from './models/Hats.js';
import  HatsRoutes  from './routes/HatsRoutes.js';
import cors from 'cors';


const app = express();

//middleware for parsing request body
app.use(express.json());

//middleware for handling cors policy
//option 1: allow origins with all default of cors
app.use(cors());

//option 2: allow custom origins

// app.use(
//   cors({
//     origin:'http://localhost:3000',
//     methods: [ 'GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
// })
// );

app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Welcome to IceDog Hat Company');
});

app.use('/Hats', HatsRoutes);


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
