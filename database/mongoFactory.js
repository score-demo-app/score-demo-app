import dotenv from "dotenv";
import mongoose from "mongoose";
// const dotenv = require("dotenv");

// const Mentor = require("../models/Mentor.js");
import Mentor from "../models/Mentor.js";
dotenv.config();
const CREATE = Symbol("create");

class MongoDB {
  static async create() {
    const obj = new MongoDB(CREATE);
    obj.mongoDB = await mongoose.connect(process.env.MONGO_URL, {});
    return obj;
  }
  constructor(token) {
    if (token !== CREATE) {
      throw Error(
        "Cannot create MongoDB from constructor, use MongoDB.create instead"
      );
    }
    this.mongoDB;
    this.Mentor = Mentor;
  }
  async searchInMentor(query) {
    let doc = await this.Mentor.find({
      languages: {
        $elemMatch: {
          $text: {
            $search: query,
            $language: "English",
            $caseSensitive: false,
            $diacriticSensitive: false,
          },
        },
      },
    });
    return doc;
  }
  async storeNewMentor(formattedMentor) {
    try {
      await this.Mentor.create({
        name: formattedMentor.name,
        expertise: formattedMentor.expertise,
        experience: formattedMentor.experience,
        languages: formattedMentor.languages,
        education: formattedMentor.education,
        careerSummary: formattedMentor.careerSummary,
      });
    } catch (err) {
      console.log("oh noooo");
      console.log(err);
    }
  }
  async disconnect() {
    await mongoose.disconnect();
  }
}

export default await MongoDB.create();
