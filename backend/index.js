const express= require("express");
const app= express();
require("dotenv").config();
const mongoose= require("mongoose");
const PORT= process.env.PORT || 3002;
const uri= process.env.MONGO_URL;
const path = require("path");
const { HoldingsModel } = require("./models/HoldingsModel");
const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");
const cors= require("cors");
const bodyParser= require("body-parser");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const { FundsModel } = require("./models/FundsModel");



app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin:  [
      "http://localhost:3000", // frontend
      "http://localhost:3001", // dashboard
      "https://zerodha-clone-a6lg.onrender.com",
      "https://zerodha-dashboard-b19e.onrender.com"
    ],
    credentials: true,
  })
);

// ROUTES
app.use("/", authRoute);





 app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});


app.post("/newOrder", async (req, res) => {
  const { name, qty, price, mode } = req.body;

  try {
    // ensure number
    const quantity = Number(qty);
    const stockPrice = Number(price);

    // 1. Get user funds
    let funds = await FundsModel.findOne();
    if (!funds) {
      funds = new FundsModel({ balance: 100000 });
      await funds.save();
    }

    // 2. Calculate amount
    const amount = quantity * stockPrice;

    // 3. Existing holding
    let existingHolding = await HoldingsModel.findOne({ name });

   
    if (mode === "BUY") {
      if (funds.balance < amount) {
        return res.json({ message: "Insufficient balance" });
      }

      // Deduct money
      funds.balance -= amount;
      await funds.save();

      if (existingHolding) {
        const totalQty = existingHolding.qty + quantity;

        const newAvg =
          (existingHolding.avg * existingHolding.qty +
            stockPrice * quantity) /
          totalQty;

        existingHolding.qty = totalQty;
        existingHolding.avg = newAvg;
        existingHolding.price = stockPrice;

        await existingHolding.save();
      } else {
        const newHolding = new HoldingsModel({
          name,
          qty: quantity,
          avg: stockPrice,
          price: stockPrice,
          net: "0%",
          day: "0%",
        });

        await newHolding.save();
      }
    }

   
    if (mode === "SELL") {
      if (!existingHolding) {
        return res.json({ message: "No holdings to sell" });
      }

      if (existingHolding.qty < quantity) {
        return res.json({ message: "Not enough quantity" });
      }

      // Add money
      funds.balance += amount;
      await funds.save();

      existingHolding.qty -= quantity;

      if (existingHolding.qty === 0) {
        await HoldingsModel.deleteOne({ name });
      } else {
        await existingHolding.save();
      }
    }

    // 4. Save order
    const newOrder = new OrdersModel({
      name,
      qty: quantity,
      price: stockPrice,
      mode,
    });

    await newOrder.save();

    res.json({
      message: "Order successful",
      balance: funds.balance,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error processing order" });
  }
});

app.get("/allOrders", async (req, res) => {
  const orders = await OrdersModel.find({}).sort({ _id: -1 });
  res.json(orders);
});



main()
.then(() => console.log("Connected to MongoDB")   )
.catch((err) => console.log(err));
async function main() {
  await mongoose.connect(uri);
};


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});



