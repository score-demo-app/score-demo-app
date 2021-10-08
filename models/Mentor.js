// const mongoose = require("mongoose");
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const mentorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    expertise: Array,
    experience: Array,
    careerSummary: {
      type: String,
      required: false,
    },
  },
  {
    collection: "Mentors",
  }
);

const Mentor = mongoose.model("Mentor", mentorSchema);
export default Mentor;
