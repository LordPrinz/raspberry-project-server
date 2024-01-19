import { Router } from "express";
import { getAll, getOne, startProcess, terminateProcess } from "../controllers/appController";

const router = Router();

router.route("/").get(getAll);

router.route("/:appName").get(getOne).post(startProcess).delete(terminateProcess);

export default router