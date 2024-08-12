require("./mongodb.js");
const cors = require("cors");
const userModel1 = require("./mongodb.js").users;
const userModel2 = require("./mongodb.js").products;
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors());
app.post("/sinup", async (req, res) => {
  const data = new userModel1(req.body);
  const result = await data.save();
  result.toObject();
  jwt.sign({ result }, "user", { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send({ error: "error occured" });
    }
    res.send({ data, auth: token });
  });
});
app.post("/login", async (req, res) => {
  console.log(req.body);
  console.log("body");
  const data = await userModel1.findOne({ Email: req.body.Email });

  console.log(data);

  if (data) {
    if (data.password !== req.body.password) {
      res.send({ error: "Passsword not match" });
    }
    jwt.sign({ data }, "user", { expiresIn: "2h" }, (err, token) => {
      if (err) {
        res.send({ error: "error occured" });
      }
      res.send({ data, auth: token });
    });
  } else {
    res.send({ error: "not found" });
  }
});

app.post("/submituser", verifytoken, async (req, res) => {
  try {
    console.log(req.body);
    const data = new userModel2(req.body);
    await data.save();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

function verifytoken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, "user", (err, result) => {
      if (err) {
        res.status(500).send("token error");
      } else {
        next();
      }
    });
  } else {
    res.send("please attached token with headers");
  }
}
app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
