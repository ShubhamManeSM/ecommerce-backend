const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const { initializeDatabase } = require("./db/db.connect");

const Product = require("./models/product.model");
const Category = require("./models/category.model");
const Cart = require("./models/cart.model");
const Wishlist = require("./models/wishlist.model");
const Address = require("./models/address.model");
const Order = require("./models/order.model");

const corsOption = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOption));
app.use(express.json());

initializeDatabase();


// ===================== PRODUCTS =====================

// CREATE PRODUCT
async function createProduct(newProduct) {
  const product = new Product(newProduct);
  return await product.save();
}

app.post("/api/products", async (req, res) => {
  try {
    const savedProduct = await createProduct(req.body);
    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add product" });
  }
});


// GET ALL PRODUCTS
async function readAllProducts() {
  return await Product.find();
}

app.get("/api/products", async (req, res) => {
  try {
    const products = await readAllProducts();

    if (products.length !== 0) {
      res.json(products);
    } else {
      res.status(404).json({ error: "No products found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


// GET PRODUCT BY ID
async function readProductById(productId) {
  return await Product.findById(productId);
}

app.get("/api/products/:productId", async (req, res) => {
  try {
    const product = await readProductById(req.params.productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});


// GET PRODUCTS BY CATEGORY
async function readProductsByCategory(category) {
  return await Product.find({ category: category });
}

app.get("/api/products/category/:category", async (req, res) => {
  try {
    const products = await readProductsByCategory(req.params.category);

    if (products.length !== 0) {
      res.json(products);
    } else {
      res.status(404).json({ error: "No products found" });
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


// ===================== CATEGORIES =====================

// CREATE CATEGORY
async function createCategory(data) {
  const category = new Category(data);
  return await category.save();
}

app.post("/api/categories", async (req, res) => {
  try {
    const savedCategory = await createCategory(req.body);
    res.json({ message: "Category added", category: savedCategory });
  } catch {
    res.status(500).json({ error: "Failed to add category" });
  }
});


// GET ALL CATEGORIES
async function readAllCategories() {
  return await Category.find();
}

app.get("/api/categories", async (req, res) => {
  const categories = await readAllCategories();
  res.json(categories);
});


// GET CATEGORY BY ID
async function readCategoryById(id) {
  return await Category.findById(id);
}

app.get("/api/categories/:categoryId", async (req, res) => {
  const category = await readCategoryById(req.params.categoryId);
  res.json(category);
});


// ===================== WISHLIST =====================

async function getWishlist() {
  let wishlist = await Wishlist.findOne();
  if (!wishlist) wishlist = new Wishlist({ products: [] });
  return wishlist;
}

app.get("/api/wishlist", async (req, res) => {
  const wishlist = await getWishlist();
  res.json(wishlist);
});


// ADD TO WISHLIST
async function addToWishlist(productId) {
  let wishlist = await getWishlist();
  wishlist.products.push(productId);
  return await wishlist.save();
}

app.post("/api/wishlist/:productId", async (req, res) => {
  const wishlist = await addToWishlist(req.params.productId);
  res.json(wishlist);
});


// REMOVE FROM WISHLIST
async function removeFromWishlist(productId) {
  let wishlist = await getWishlist();
  wishlist.products = wishlist.products.filter(id => id !== productId);
  return await wishlist.save();
}

app.delete("/api/wishlist/:productId", async (req, res) => {
  const wishlist = await removeFromWishlist(req.params.productId);
  res.json(wishlist);
});


// ===================== CART =====================

async function getCart() {
  let cart = await Cart.findOne();
  if (!cart) cart = new Cart({ items: [] });
  return cart;
}

app.get("/api/cart", async (req, res) => {
  const cart = await getCart();
  res.json(cart);
});


// ADD TO CART
async function addToCart(productId) {
  let cart = await getCart();

  const item = cart.items.find(i => i.productId === productId);

  if (item) item.quantity += 1;
  else cart.items.push({ productId, quantity: 1 });

  return await cart.save();
}

app.post("/api/cart/:productId", async (req, res) => {
  const cart = await addToCart(req.params.productId);
  res.json(cart);
});


// UPDATE CART
async function updateCart(productId, action) {
  let cart = await getCart();

  const item = cart.items.find(i => i.productId === productId);

  if (action === "increment") item.quantity++;
  if (action === "decrement") item.quantity--;

  return await cart.save();
}

app.put("/api/cart/:productId", async (req, res) => {
  const cart = await updateCart(req.params.productId, req.body.action);
  res.json(cart);
});


// DELETE FROM CART
async function deleteFromCart(productId) {
  let cart = await getCart();
  cart.items = cart.items.filter(i => i.productId !== productId);
  return await cart.save();
}

app.delete("/api/cart/:productId", async (req, res) => {
  const cart = await deleteFromCart(req.params.productId);
  res.json(cart);
});


// ===================== ADDRESS =====================

async function createAddress(data) {
  const address = new Address(data);
  return await address.save();
}

app.post("/api/address", async (req, res) => {
  const address = await createAddress(req.body);
  res.json(address);
});

async function getAddresses() {
  return await Address.find();
}

app.get("/api/address", async (req, res) => {
  const addresses = await getAddresses();
  res.json(addresses);
});


// ===================== ORDERS =====================

async function createOrder(data) {
  const order = new Order(data);
  return await order.save();
}

app.post("/api/orders", async (req, res) => {
  const order = await createOrder(req.body);
  res.json(order);
});

async function getOrders() {
  return await Order.find();
}

app.get("/api/orders", async (req, res) => {
  const orders = await getOrders();
  res.json(orders);
});


// ===================== SERVER =====================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});