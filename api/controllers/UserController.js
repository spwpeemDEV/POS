const express = require("express");
const app = express();
const Service = require("./Service");
const UserModel = require("../models/UserModel");

app.get('/user/list', async (req, res) => {
  try {
      const results = await UserModel.findAll({
          where: {
              userId: Service.getMemberId(req)
          },
          attributes: ['id', 'level', 'name', 'user'],
          order: [['id', 'DESC']]
      });
      res.send({ message: 'success', results: results });
  } catch (e) {
      res.statusCode = 500;
      res.send({ message: e.message });
  }
})

app.post("/user/insert", async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = Service.getMemberId(req);
    result = await UserModel.create(payload);
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.delete("/user/delete/:id", async (req, res) => {
  try {
    await UserModel.destroy({
      where: { id: req.params.id },
    });
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post("/user/edit", async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = Service.getMemberId(req);

    await UserModel.update(payload, {
      where: {
        id: req.body.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
