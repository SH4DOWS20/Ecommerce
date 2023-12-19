import express from 'express';
import { Hats } from '../models/Hats.js';

const router = express.Router();

//route to save a new Hat
router.post('/', async (request, response) => {
    try {
        if (!Array.isArray(request.body)) {
            return response.status(400).send({
                message: 'Send an array of hats in the request body',
            });
        }

        const createdHats = await Hats.create(request.body);
        return response.status(201).send(createdHats);
    } catch (error) {
        console.error('Error in POST /Hats:', error);
        response.status(500).send({ message: 'Internal Server Error' });
    }
});

//Gets all Hats from database
router.get('/', async (request, response) => {
    try {
        const hats = await Hats.find({});

        return response.status(200).json({
            count: hats.length,
            data: hats
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});
//get 1 Hat id from database
router.get('/', async (request, response) => {
    try {
        const { id } = request.params;
        const hats = await Hats.findById(id);

        return response.status(200).json(hats);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//route for updating hat 
router.put('/', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.Price ||
            !request.body.SKU
        ) {
            return response.status(400).send({
                message: "send all required fields title, Price and SKU"
            });
        }
        const { id } = request.params;

        const result = await Hats.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({ message: 'Hat not found' });
        }

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//route for deleting a Hat
router.delete('/', async (request, response) => {
    try {

        const { id } = request.params;

        const result = await Hats.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Hat not found' });
        }
        return response.status(200).send({ message: 'Hat deleted successfully' });


    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;