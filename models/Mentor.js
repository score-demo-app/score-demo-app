const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mentorSchema = new Schema({
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
});

const Mentor = mongoose.model("Mentor", mentorSchema);
export default Mentor;
