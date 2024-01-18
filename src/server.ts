import { config } from "dotenv";
import app from "./app";
import AppError from "./utils/AppError";

config();

if(!process.env.TARGET_DIRECTORY) {
  new AppError("No TARGET_DIRECTORY env variable provided!", 500)
}

const port = process.env.PORT || 4444;

const server = app.listen(port, () => {
  console.log(`App runnning on port ${port}...`)
})

process.on("unhandledRejection", (err: Error) => {
	console.log("UNHANDLED REJECTION! Shutting down...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

process.on("SIGTERM", () => {
	console.log("SIGTERM RECEIVED. Shutting down gracefully");
	server.close(() => {
		console.log("Process terminated!");
	});
});

process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! Shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});