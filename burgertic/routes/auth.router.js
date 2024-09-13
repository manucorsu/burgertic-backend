import Router from "express";
import AuthController from "../controllers/auth.controller.js";

const router = Router();

// ------------- COMPLETAR LAS RUTAS DE LOGIN Y REGISTER -------------
router.post("/register", AuthController.register);
router.post("/login", AuthController.register);
export default router;