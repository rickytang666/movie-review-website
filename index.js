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

// Try to connect to MongoDB, but don't fail if it doesn't work
MongoClient.connect(
    uri,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        serverSelectionTimeoutMS: 5000,
        retryWrites: true
    })
    .then(async client => {
        console.log('Connected to MongoDB successfully!');
        await ReviewsDAO.injectDB(client);
        startServer();
    })
    .catch(err => {
        console.warn('MongoDB connection failed, starting server without database:');
        console.warn(err.message);
        console.warn('Reviews functionality will be limited.');
        startServer();
    });

function startServer() {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        console.log(`Visit http://localhost:${port} to access the movie review website`);
    });
}
