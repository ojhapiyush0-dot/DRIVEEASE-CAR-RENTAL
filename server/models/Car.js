import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  fuel: { type: String, required: true },
  transmission: { type: String, required: true },
  seats: { type: Number, required: true },
  description: { type: String, required: true },
  features: { type: [String], default: [] },
});

export const Car = mongoose.model('Car', carSchema);
