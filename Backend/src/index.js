import app from './app.js'
import dotenv from 'dotenv'
import connToDB from './db/dbConnection.js';
import cloudinary from "cloudinary"
import Razorpay from 'razorpay';


dotenv.config({
    path: "./.env"
})
const PORT = process.env.PORT || 7000;

connToDB();


//Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Razorpay configuration
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// if (process.env.NODE_ENV !== "production") {
//     app.listen(3000, () => {
//         console.log("Server running on http://localhost:3000");
//     });
// }

// export default app;
