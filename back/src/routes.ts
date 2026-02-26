import { Router, type Request, type Response } from "express";
import {
  CreateUserController,
  AuthenticateUserController,
  UpdateUserController,
  GetUserController,
  GetUserByIdController,
  DeleteUserController,
} from "./controller/controller_usuario.js";
import { authMiddleware } from "./middlewares/middlewareAuth.js";

const router = Router();

// Controller singletons
const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const getUserController = new GetUserController();
const getUserByIdController = new GetUserByIdController();
const authenticateUserController = new AuthenticateUserController();
const deleteUserController = new DeleteUserController();

// User routes
router.post("/user", (req: Request, res: Response) =>
  createUserController.handle(req, res),
);

router.put("/user/:id", authMiddleware, (req: Request, res: Response) =>
  updateUserController.handle(req, res),
);

router.get("/user", authMiddleware, (req: Request, res: Response) =>
  getUserController.handle(req, res),
);

router.get("/user/:id", (req: Request, res: Response) =>
  getUserByIdController.handle(req, res),
);

router.post("/login", (req: Request, res: Response) =>
  authenticateUserController.handle(req, res),
);

router.delete("/user/:id", authMiddleware, (req: Request, res: Response) =>
  deleteUserController.handle(req, res),
);

// -- Other routes can be added here

export default router;
