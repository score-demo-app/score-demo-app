// var express = require("express");
import express from "express";
// var bodyParser = require("body-parser");
import bodyParser from "body-parser";
// var router = express.Router();
const router = express.Router();
// var mongoDB = require("../database/mongoFactory.js");
import mongoDB from "../database/mongoFactory.js";
import fuzzysort from "fuzzysort";

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
  let json = req.body;
  let query = json["search-query"]; // Marketing
  let category = json["category_filter"];
  let betterQuery = "";
  switch (category) {
    case "language":
      let allLangs = await mongoDB.getLanguagesFromAllDocs();
      try {
        let formattedLangs = [];
        allLangs.forEach((obj) => {
          let internalArray = obj.languages;
          internalArray.forEach((a) => {
            formattedLangs.push(a);
          });
        });
        let results = fuzzysort.go(query, formattedLangs);
        if (results.length > 0) {
          betterQuery = results[0].target;
        }
        let listOfMentors = await mongoDB.searchLanguagesInMentor(betterQuery);
        res.render("searchResults", { mentors: listOfMentors });
      } catch (err) {
        console.log("error with languages");
      }
      break;
    case "experience":
      let allExperiences = await mongoDB.getExperienceFromAllDocs();
      try {
        let formattedExperiences = [];
        allExperiences.forEach((obj) => {
          let internalArray = obj.experience;
          internalArray.forEach((a) => {
            formattedExperiences.push(a);
          });
        });
        let results = fuzzysort.go(query, formattedExperiences);
        console.log(results.length);
        if (results.length > 0) {
          betterQuery = results[0].target;
        }
        let listOfMentors = await mongoDB.searchExperienceInMentor(betterQuery);
        res.render("searchResults", { mentors: listOfMentors });
      } catch (err) {
        console.log("error with experiences");
      }
      break;
    case "expertise":
      let allExpertise = await mongoDB.getExpertiseFromAllDocs();
      try {
        let formattedExpertise = [];
        allExpertise.forEach((obj) => {
          let internalArray = obj.expertise;
          internalArray.forEach((a) => {
            formattedExpertise.push(a);
          });
        });
        let results = fuzzysort.go(query, formattedExpertise);
        let listOfQueries = new Set();
        if (results.length > 0) {
          results.forEach((result) => {
            listOfQueries.add(result.target);
          });
        }
        let queryArray = Array.from(listOfQueries);
        console.log(queryArray);
        let listOfMentors = [];
        // why this loooping below is so weird!!!!
        for (let idx in queryArray) {
          let mentor = await mongoDB.searchExpertiseInMentor(queryArray[idx]);
          listOfMentors.push(mentor);
        }
        console.log(listOfMentors[0]);
        res.render("searchResults", { mentors: listOfMentors[0] });
      } catch (err) {
        console.log(err);
      }
      break;
  }
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
