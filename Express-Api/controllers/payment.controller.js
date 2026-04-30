const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const productModel = require("../models/product.model");

module.exports.CreateCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body; // Array of { productId, quantity }

    const line_items = await Promise.all(
      items.map(async (item) => {
        const product = await productModel.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        
        const price = product.discount > 0 
          ? product.price - (product.price * product.discount / 100)
          : product.price;

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              images: [product.images[0]],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        userId: req.user.id,
        items: JSON.stringify(items.map(i => ({ id: i.productId, q: i.quantity })))
      }
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(400).json({ message: error.message });
  }
};
