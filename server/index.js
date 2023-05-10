// Imports
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import { v4 as uuid } from "uuid";

// Configurations
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
const stripe = new Stripe(process.env.SECRET_KEY);


// Routes
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Server is running !" });
});


// Payment Route
app.post("/checkout", async (req, res) => {
    try {
        const products = req.body.products;
        const line_items = products.map((product) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                    images: [product.image],
                    description: product.desc,
                    metadata: {
                        id: product.id
                    }
                },
                unit_amount: product.price * 100,
            },
            quantity: product.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            shipping_address_collection: { allowed_countries: ['US', 'CA'] },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 0, currency: 'usd' },
                        display_name: 'Free shipping',
                        delivery_estimate: {
                            minimum: { unit: 'business_day', value: 5 },
                            maximum: { unit: 'business_day', value: 7 },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 1500, currency: 'usd' },
                        display_name: 'Next day air',
                        delivery_estimate: {
                            maximum: { unit: 'business_day', value: 1 },
                        },
                    },
                },
            ],
            line_items,
            phone_number_collection: {
                enabled: true,
            },
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel"
        });

        res.json({ url: session.url });
    } catch (error) {
        console.log('Error while processing payment: ', error);
    }
});

// Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port http://locahost:${PORT}`);
});