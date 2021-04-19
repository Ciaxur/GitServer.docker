import mongoose from 'mongoose';


const Schema = mongoose.Schema;

export const RepositorySchema = new Schema({
  // Primary Key, lowercased title
  _title:       { type: String, required: true, index: true, unique: true, trim: true, lowercase: true },
  
  // Original Title
  title:        { type: String, required: true, trim: true },

  description:  { type: String, trim: true },
  updatedAt:    { type: Date, default: Date.now },
  createdAt:    { type: Date, default: Date.now },
})