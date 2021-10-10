// var express = require("express");
import express from "express";
// var bodyParser = require("body-parser");
import bodyParser from "body-parser";
// var router = express.Router();
const router = express.Router();
// var mongoDB = require("../database/mongoFactory.js");
import mongoDB from "../database/mongoFactory.js";

/* GET home page. */
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/entry", function (req, res) {
  res.render("entry");
});
router.get("/search", function (req, res) {
  res.render("search");
});

router.post("/fuzzy-search", async (req, res) => {
  console.log("bababooey boom shakalala");
});
router.post("/post-feedback", async (req, res) => {
  let json = req.body;
  let formattedMentor = {};
  formattedMentor.name = json["lastName"] + ", " + json["firstName"];
  let splitExpertise = json["expertise"]
    .replace(/(\r\n|\r|\n)/gm, "")
    .split(" / ");
  formattedMentor.expertise = splitExpertise;
  let splitExperience = json["experience"]
    .replace(/(\r\n|\r|\n)/gm, "")
    .split(" / ");
  formattedMentor.experience = splitExperience;
  let splitLanguages = json["languages"]
    .replace(/(\r\n|\r|\n)/gm, "")
    .split(" / ");
  formattedMentor.languages = splitLanguages;
  let splitEducation = json["education"];
  formattedMentor.education = splitEducation;
  let splitCareerSummary = json["careerSummary"];
  formattedMentor.careerSummary = splitCareerSummary;
  console.log(formattedMentor);
  await mongoDB.storeNewMentor(formattedMentor);
  await mongoDB.disconnect();

  res.render("submitPage", { record: formattedMentor });
});

// module.exports = router;
export default router;
