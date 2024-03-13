const express = require("express");
const app = express();
const MemberModel = require("../models/MemberModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const service = require("./Service");
const PackageModel = require("../models/PackageModel");

app.post("/member/signin", async (req, res) => {
  try {
    const member = await MemberModel.findAll({
      where: {
        phone: req.body.phone,
        pass: req.body.pass,
      },
    });

    if (member.length > 0) {
      let token = jwt.sign({ id: member[0].id }, process.env.secret);
      res.send({ token: token, message: "success" });
    } else {
      res.status(401).send({ message: "not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/member/info", async (req, res) => {
  try {
    MemberModel.belongsTo(PackageModel);

    const payload = jwt.decode(service.getToken(req));
    const member = await MemberModel.findByPk(payload.id, {
      attributes: ["id", "name"],
      include: [
        {
          model: PackageModel,
          attributes: ["name"],
        },
      ],
    });
    res.send({ result: member, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.put("/member/changeprofile", async (req, res) => {
    try {
      const memberId = service.getMemberId(req);
      const payload = {
        name: req.body.memberName,
      };
      const result = await MemberModel.update(payload, {
        where: {
          id: memberId,
        },
      });
  
      res.send({ message: "success", result: result });
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  });
  

module.exports = app;
