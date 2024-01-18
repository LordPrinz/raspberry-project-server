import { Router } from "express";

const router = Router();

router.route("/").get(() => console.log("XD"));

export default router