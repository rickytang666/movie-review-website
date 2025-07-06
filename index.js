import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import ReviewsDAO from "./dao/reviewsDAO.js";

// Load environment variables
dotenv.config();

const MongoClient = mongodb.MongoClient;
const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.e7myhyk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const port = process.env.PORT || 3000;

// Initialize database connection
let dbConnected = false;

async function initDB() {
    if (!dbConnected) {
        try {
            const client = await MongoClient.connect(uri, {
                maxPoolSize: 50,
                wtimeoutMS: 2500,
                serverSelectionTimeoutMS: 5000,
                retryWrites: true
            });
            console.log('Connected to MongoDB successfully!');
            await ReviewsDAO.injectDB(client);
            dbConnected = true;
        } catch (err) {
            console.warn('MongoDB connection failed:');
            console.warn(err.message);
            console.warn('Reviews functionality will be limited.');
        }
    }
}

// For local development
if (process.env.NODE_ENV !== 'production') {
    initDB().then(() => {
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
            console.log(`Visit http://localhost:${port} to access the movie review website`);
        });
    });
}

// For Vercel serverless deployment
export default async function handler(req, res) {
    await initDB();
    return app(req, res);
}
