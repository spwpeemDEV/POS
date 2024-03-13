const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Service = require("./Service");

const BillSaleDetailModel = require("../models/BillSaleDetailModel");
const BillSaleModel = require("../models/BillSaleModel");

app.get("/billSale/openBill", async (req, res) => {
  try {
    const payload = {
      userId: Service.getMemberId(req),
      status: "open",
    };

    const result = await BillSaleModel.findOne({
      where: payload,
    });

    if (result == null) {
      const newBillSale = await BillSaleModel.create(payload);
      res.send({ message: "success", result: newBillSale });
    } else {
      res.send({ message: "success", result: result });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/billSale/sale", async (req, res) => {
  try {
    const payload = {
      userId: Service.getMemberId(req),
      status: "open",
    };
    const currentBill = await BillSaleModel.findOne({
      where: payload,
    });
    const item = {
      price: req.body.price,
      productId: req.body.id,
      billSaleId: currentBill.id,
      userId: payload.userId,
    };
    const billSaleDetail = await BillSaleDetailModel.findOne({
      where: item,
    });
    if (billSaleDetail == null) {
      item.qty = 1;
      await BillSaleDetailModel.create(item);
    } else {
      item.qty = parseInt(billSaleDetail.qty) + 1;
      await BillSaleDetailModel.update(item, {
        where: {
          id: billSaleDetail.id,
        },
      });
    }

    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/billSale/currentBillInfo", async (req, res) => {
  try {
    const BillSaleDetailModel = require("../models/BillSaleDetailModel");
    const ProductModel = require("../models/ProductModel");

    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);
    const results = await BillSaleModel.findOne({
      where: {
        status: "open",
        userId: Service.getMemberId(req),
      },
      include: {
        model: BillSaleDetailModel,
        order: [["id", "DESC"]],
        include: {
          model: ProductModel,
          attributes: ["name"],
        },
      },
    });

    res.send({ results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.delete("/bilSale/deleteItem/:id", async (req, res) => {
  try {
    await BillSaleDetailModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/billSale/updateQty", async (req, res) => {
  try {
    await BillSaleDetailModel.update(
      {
        qty: req.body.qty,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/billSale/endSale", async (req, res) => {
  try {
    await BillSaleModel.update(
      {
        status: "pay",
      },
      {
        where: {
          status: "open",
          userId: Service.getMemberId(req),
        },
      }
    );
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/billSale/lastBill", async (req, res) => {
  try {
    const BillSaleDetailModel = require("../models/BillSaleDetailModel");
    const ProductModel = require("../models/ProductModel");

    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    const result = await BillSaleModel.findAll({
      where: {
        status: "pay",
        userId: Service.getMemberId(req),
      },
      order: [["id", "DESC"]],
      limit: 1,
      include: {
        model: BillSaleDetailModel,
        attributes: ["qty", "price"],
        include: {
          model: ProductModel,
          attributes: ["barcode", "name"],
        },
      },
    });
    res.send({ message: "success", result: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/billSale/billToday", async (req, res) => {
  const BillSaleDetailModel = require("../models/BillSaleDetailModel");
  const ProductModel = require("../models/ProductModel");

  BillSaleModel.hasMany(BillSaleDetailModel);
  BillSaleDetailModel.belongsTo(ProductModel);

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const now = new Date();
  const { Sequelize, Op } = require("sequelize");

  const results = await BillSaleModel.findAll({
    where: {
      status: "pay",
      userId: Service.getMemberId(req),
      createdAt: {
        [Op.between]: [startDate.toISOString(), now.toISOString()],
      },
    },
    order: [["id", "DESC"]],
    include: {
      model: BillSaleDetailModel,
      attributes: ["qty", "price"],
      include: {
        model: ProductModel,
        attributes: ["barcode", "name"],
      },
    },
  });
  res.send({ message: "success", results: results });
});

module.exports = app;
