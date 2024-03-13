const express = require("express");
const app = express();
const ProductModel = require("../models/ProductModel");
const Service = require("./Service");

app.post("/product/insert", async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = Service.getMemberId(req);
    const result = await ProductModel.create(payload);
    res.send({ result: result, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/product/list", async (req, res) => {
  try {
    const results = await ProductModel.findAll({
      where: {
        userId: Service.getMemberId(req),
      },
      order: [["id", "DESC"]],
    });
    res.send({ results: results, message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.delete("/product/delete/:id", async (req, res) => {
  try {
    await ProductModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/product/update", async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = Service.getMemberId(req);
    await ProductModel.update(payload, {
      where: {
        id: req.body.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/product/listForSale", async (req, res) => {
  const ProductImageModel = require("../models/ProductImageModel");

  ProductModel.hasMany(ProductImageModel);

  try {
    const results = await ProductModel.findAll({
      where: {
        userId: Service.getMemberId(req),
      },
      order: [["id", "DESC"]],
      include: {
        model: ProductImageModel,
        where: {
          isMain: true,
        },
      },
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
