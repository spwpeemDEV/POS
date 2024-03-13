const express = require("express");
const app = express();
const PackageModel = require("../models/PackageModel");
const MemberModel = require("../models/MemberModel");

app.get("/package/list", async (req, res) => {
  try {
    const results = await PackageModel.findAll({
      order: ["price"],
    });
    res.send({ results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/package/memberRegister", async (req, res) => {
  try {
    const result = await MemberModel.create(req.body);
    res.send({ message: "success", result: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
