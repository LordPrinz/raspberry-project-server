import express, { json } from "express"
import appRouter from "./routes/appRouter";
import AppError from "./utils/AppError";

const app = express();


app.use(json());

app.use("/api/v1/apps", () => appRouter);

app.all("*", async (req, res, next) => {
	new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
});


export default app