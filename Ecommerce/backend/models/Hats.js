import mongoose from "mongoose";

const HatSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    SKU: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Hats = mongoose.model('Hats', HatSchema);
