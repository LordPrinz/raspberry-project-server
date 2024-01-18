import { Router } from "express";
import { getAll, getOne, startProcess, terminateProcess } from "../controllers/appController";

const router = Router();

router.route("/").get(getAll);

router.route("/:id").get(getOne).post(startProcess).delete(terminateProcess);

export default router