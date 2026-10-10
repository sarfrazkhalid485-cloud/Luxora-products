const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, "[]", "utf8");

app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "public")));

const catalog = [
  {id:1,name:"iPhone XS",price:42000},{id:2,name:"iPhone 11",price:57000},
  {id:3,name:"iPhone 12",price:74000},{id:4,name:"iPhone 13",price:99000},
  {id:5,name:"iPhone 14",price:125000},{id:6,name:"iPhone 15",price:165000},
  {id:7,name:"iPhone 16",price:220000},{id:8,name:"iPhone 17",price:285000},
  {id:9,name:"MacBook Air M1",price:152000},{id:10,name:"MacBook Air M2",price:222000},
  {id:11,name:"MacBook Air M3",price:282000},{id:12,name:"MacBook Air M4",price:335000},
  {id:13,name:"MacBook Pro 14-inch",price:465000},{id:14,name:"MacBook Pro 16-inch",price:625000},
  {id:15,name:"Apple Watch SE",price:72000},{id:16,name:"Apple Watch Series 9",price:98000},
  {id:17,name:"Apple Watch Series 10",price:125000},{id:18,name:"Apple Watch Ultra 2",price:220000},
  {id:19,name:"Classic Steel Watch",price:8500},{id:20,name:"Minimal Black Watch",price:6500}
];

app.get("/api/health", (_req, res) => res.json({ok:true, service:"LUXORA store API"}));
app.get("/api/products", (_req, res) => res.json(catalog));

app.post("/api/orders", (req, res) => {
  const { customer, phone, address, payment, items } = req.body || {};
  if (!customer || !phone || !address || !payment || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({error:"Please provide customer details and at least one cart item."});
  }
  const allowedPayments = ["Cash on Delivery", "Bank Transfer", "Easypaisa / JazzCash"];
  if (!allowedPayments.includes(payment)) return res.status(400).json({error:"Invalid payment method."});
  const normalized = [];
  for (const item of items) {
    const product = catalog.find(p => p.id === Number(item.productId));
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return res.status(400).json({error:"One of the selected products or quantities is invalid."});
    }
    normalized.push({productId:product.id, name:product.name, unitPricePKR:product.price, quantity, lineTotalPKR:product.price*quantity});
  }
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
  const order = {
    orderId:"LX-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
    createdAt:new Date().toISOString(),
    customer:String(customer).trim().slice(0,120),
    phone:String(phone).trim().slice(0,40),
    address:String(address).trim().slice(0,500),
    payment,
    items:normalized,
    totalPKR:normalized.reduce((sum,item)=>sum+item.lineTotalPKR,0),
    status:"Pending seller confirmation"
  };
  orders.push(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
  res.status(201).json({orderId:order.orderId, totalPKR:order.totalPKR, status:order.status});
});

// Basic admin endpoint for local testing. Protect it with ADMIN_KEY before any public deployment.
app.get("/api/orders", (req, res) => {
  const key = process.env.ADMIN_KEY;
  if (!key || req.get("x-admin-key") !== key) return res.status(401).json({error:"Admin access is not configured or key is incorrect."});
  res.json(JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8")));
});

app.listen(PORT, () => console.log(`LUXORA is running at http://localhost:${PORT}`));
