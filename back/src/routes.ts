import { Router, type Request, type Response } from "express";
import {
  CreateUserController,
  AuthenticateUserController,
  UpdateUserController,
  GetUserController,
  GetUserByIdController,
  DeleteUserController,
  GetUserBySlugController,
} from "./controller/controller_usuario.js";
import { authMiddleware } from "./middlewares/middlewareAuth.js";
import { CreateHorarioController, DeleteHorarioController, GetHorarioByIdController, GetHorariosController, GetHorariosDisponiveisController, UpdateHorarioController } from "./controller/controller_horario.js";
import { CreateReservaController, CancelReservaController, GetReservasController, GetReservaByIdController, CancelReservaByEmailController } from "./controller/controller_reserva.js";

const router = Router();

// ====== USER (BARBEIRO) CONTROLLERS ======
const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const getUserController = new GetUserController();
const getUserByIdController = new GetUserByIdController();
const getUserBySlugController = new GetUserBySlugController();
const authenticateUserController = new AuthenticateUserController();
const deleteUserController = new DeleteUserController();

// ===== HORARIO CONTROLLERS ======
const createHorarioController = new CreateHorarioController();
const updateHorarioController = new UpdateHorarioController();
const deleteHorarioController = new DeleteHorarioController();
const getHorarioByIdController = new GetHorarioByIdController();
const getHorariosController = new GetHorariosController();
const getHorariosDisponiveisController = new GetHorariosDisponiveisController();

// ============================== RESERVA CONTROLLERS ==============================
const createReservaController = new CreateReservaController();
const cancelReservaController = new CancelReservaController();
const getReservasController = new GetReservasController();
const getReservaByIdController = new GetReservaByIdController();
const cancelReservaByEmailController = new CancelReservaByEmailController();
/* =================================================================================== */

// ROUTES USUARIO
router.post("/user", (req: Request, res: Response) =>
  createUserController.handle(req, res),
);
router.post("/login", (req: Request, res: Response) =>
  authenticateUserController.handle(req, res),
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
router.delete("/user/:id", authMiddleware, (req: Request, res: Response) =>
  deleteUserController.handle(req, res),
);

// ROTA PÚBLICA — busca barbeiro pelo slug (usada pelo frontend: /barbeiro/vini-barber)
router.get("/barbeiro/:slug", (req: Request, res: Response) =>
  getUserBySlugController.handle(req, res),
);

/* =============================================================================================== */

// ROUTES HORARIO
router.post("/horario", authMiddleware, (req: Request, res: Response) =>
  createHorarioController.handle(req, res),
);

router.put("/horario/:id", authMiddleware, (req: Request, res: Response) =>
  updateHorarioController.handle(req, res),
);

router.delete("/horario/:id", authMiddleware, (req: Request, res: Response) =>
  deleteHorarioController.handle(req, res),
);

router.get("/horario/:id", authMiddleware, (req: Request, res: Response) =>
  getHorarioByIdController.handle(req, res),
);

router.get("/horarios", authMiddleware, (req: Request, res: Response) =>
  getHorariosController.handle(req, res),
);

router.get("/horarios/disponiveis/:id", (req: Request, res: Response) =>
  getHorariosDisponiveisController.handle(req, res),
);

/*===============================================================================================*/

// ROUTES DE RESERVA
router.post("/reserva", (req: Request, res: Response) =>
  createReservaController.handle(req, res),
);

router.delete("/reserva/:id", authMiddleware, (req: Request, res: Response) =>
  cancelReservaController.handle(req, res),
);

router.get("/reservas", authMiddleware, (req: Request, res: Response) =>
  getReservasController.handle(req, res),
);

router.get("/reserva/:id", authMiddleware, (req: Request, res: Response) =>
  getReservaByIdController.handle(req, res),
);

router.post("/reserva/:id/cancelar", (req: Request, res: Response) =>
  cancelReservaByEmailController.handle(req, res),
);



export default router;
