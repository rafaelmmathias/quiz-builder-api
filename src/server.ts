import dotenv from "dotenv";
import cors from "cors";
import express, { Express } from "express";
import admin, { ServiceAccount } from "firebase-admin";
import { quizRouter } from "./routes/index";
import { getFirebaseSettings } from "./config";
import { genericErrorHandler } from "./middlewares/error-handlers";

dotenv.config();

export const app: Express = express();

const port = process.env.PORT;
var serviceAccount = {
  credential: admin.credential.cert(getFirebaseSettings() as ServiceAccount),
};

export const adminApp = admin.initializeApp(serviceAccount);
export const firestoreAdmin = adminApp.firestore();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cors());
app.use(quizRouter);
app.use(genericErrorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
