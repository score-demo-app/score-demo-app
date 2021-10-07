// import dotenv from "dotnev";
const dotenv = require("dotenv");
dotenv.config();
const CREATE = Symbol("create");

class MongoDB {
  static async create() {
    const obj = new MongoDB(CREATE);
    obj.mongoDB = await mongoose.connect(process.env.MONGO_URL, {});
    return obj;
  }
  async storeNewMentor() {}
}
