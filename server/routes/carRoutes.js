import { Router } from 'express';
import { Car } from '../models/Car.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().sort({ price: 1 });
    return res.json({ cars });
  } catch (error) {
    console.error('list cars:', error);
    return res.status(500).json({ message: 'Unable to load cars.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findOne({ id: req.params.id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }
    return res.json({ car });
  } catch (error) {
    console.error('get car:', error);
    return res.status(500).json({ message: 'Unable to load this car.' });
  }
});

export default router;
