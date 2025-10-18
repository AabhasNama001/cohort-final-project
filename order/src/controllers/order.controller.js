const { publishToQueue } = require("../broker/broker");
const orderModel = require("../models/order.model");
const axios = require("axios");

async function createOrder(req, res) {
  const user = req.user;

  // safe token extraction
  let token = null;
  if (req.cookies && req.cookies.token) token = req.cookies.token;
  else if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2) token = parts[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }

  try {
    const cartResponse = await axios.get(`http://localhost:3002/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const cart = cartResponse.data?.cart;
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or invalid" });
    }

    // fetch product details in parallel
    const fetchResults = await Promise.allSettled(
      cart.items.map((item) =>
        axios.get(`http://localhost:3001/api/products/${item.productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    );

    const products = [];
    for (let i = 0; i < fetchResults.length; i++) {
      const r = fetchResults[i];
      if (r.status === "rejected") {
        const err = r.reason;
        const status = err?.response?.status || 502;
        const message =
          err?.response?.data?.message ||
          err.message ||
          "Failed to fetch product data";
        return res.status(status).json({ message });
      }
      products.push(r.value.data.data);
    }

    let priceAmount = 0;
    const orderItems = [];

    // process items and check stock
    for (const item of cart.items) {
      const product = products.find((p) => p._id === item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(409)
          .json({
            message: `Product ${product.title} is out of stock or insufficient`,
          });
      }

      const itemTotal = product.price.amount * item.quantity;
      priceAmount += itemTotal;

      orderItems.push({
        product: item.productId,
        quantity: item.quantity,
        price: { amount: itemTotal, currency: product.price.currency },
      });
    }

    const order = await orderModel.create({
      user: user.id,
      items: orderItems,
      status: "PENDING",
      totalPrice: { amount: priceAmount, currency: "INR" },
      shippingAddress: {
        street: req.body.shippingAddress.street,
        city: req.body.shippingAddress.city,
        state: req.body.shippingAddress.state,
        zip: req.body.shippingAddress.pincode,
        country: req.body.shippingAddress.country,
      },
    });

    await publishToQueue("ORDER_SELLER_DASHBOARD.ORDER_CREATED", order);

    res.status(201).json({ order });
  } catch (error) {
    console.error("Error fetching cart:", error);
    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Internal Server error";
    return res.status(status).json({ message });
  }
}

async function getMyOrders(req, res) {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const orders = await orderModel
      .find({ user: user.id })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalOrders = await orderModel.countDocuments({ user: user.id });

    res.status(200).json({
      orders,
      meta: { total: totalOrders, page, limit },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

async function getOrderById(req, res) {
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== user.id)
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have access to this order" });

    res.status(200).json({ order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function cancelOrderById(req, res) {
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== user.id)
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have access to this order" });
    if (order.status !== "PENDING")
      return res
        .status(409)
        .json({ message: "Order cannot be cancelled at this stage" });

    order.status = "CANCELLED";
    await order.save();

    res.status(200).json({ order });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

async function updateOrderAddress(req, res) {
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== user.id)
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have access to this order" });
    if (order.status !== "PENDING")
      return res
        .status(409)
        .json({ message: "Order address cannot be updated at this stage" });

    order.shippingAddress = {
      street: req.body.shippingAddress.street,
      city: req.body.shippingAddress.city,
      state: req.body.shippingAddress.state,
      zip: req.body.shippingAddress.pincode,
      country: req.body.shippingAddress.country,
    };

    await order.save();
    res.status(200).json({ order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrderById,
  updateOrderAddress,
};
