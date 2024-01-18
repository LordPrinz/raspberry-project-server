import { Router } from "express";
import { getAll } from "../controllers/appController";

const router = Router();

router.route("/").get(getAll);

export default router