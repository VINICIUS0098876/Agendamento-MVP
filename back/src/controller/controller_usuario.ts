import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/middlewareAuth.js";
import {
  SUCCESS_CREATED_ITEM,
  SUCCESS_DELETED_ITEM,
  SUCCESS_LOGIN_ITEM,
  SUCCESS_UPDATED_ITEM,
  SUCCESS_GET_ITEMS,
  SUCCESS_GET_ITEM,
} from "../utils/message.js";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_ID,
  ERROR_REQUIRED_FIELDS,
} from "../utils/message.js";
import { AppError } from "../errors/AppError.js";
import {
  CreateUserService,
  UpdateUserService,
  GetUserByIdService,
  GetUserService,
  GetUserBySlugService,
  AuthenticateUserService,
  DeleteUserService,
} from "../service/usuario.js";

// Cria uma única instância de cada service para ser reutilizada pelos controllers
const createUserService = new CreateUserService();
const updateUserService = new UpdateUserService();
const getUserService = new GetUserService();
const getUserByIdService = new GetUserByIdService();
const getUserBySlugService = new GetUserBySlugService();
const authenticateUserService = new AuthenticateUserService();
const deleteUserService = new DeleteUserService();

export class CreateUserController {
  async handle(req: Request, res: Response) {
    try {
      const { nome, email, senha, slug } = req.body;

      if (!nome || !email || !senha || !slug) {
        return res.status(400).json({ message: ERROR_REQUIRED_FIELDS });
      }

      const result = await createUserService.execute({ nome, email, senha, slug });

      return res.status(201).json({ message: SUCCESS_CREATED_ITEM, data: result });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error creating user:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}

export class UpdateUserController {
  async handle(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: ERROR_INVALID_ID });
      }

      const { nome, email, senha, slug } = req.body;

      const result = await updateUserService.execute(id, { nome, email, senha, slug });

      return res.status(200).json({ message: SUCCESS_UPDATED_ITEM, data: result });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error updating user:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}

export class GetUserController {
  async handle(_req: Request, res: Response) {
    try {
      const result = await getUserService.execute();

      return res.status(200).json({ message: SUCCESS_GET_ITEMS, data: result });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error getting users:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}

export class GetUserByIdController {
  async handle(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: ERROR_INVALID_ID });
      }

      const result = await getUserByIdService.execute(id);

      return res.status(200).json({ message: SUCCESS_GET_ITEM, data: result });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error getting user by id:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}

export class DeleteUserController {
  async handle(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: ERROR_INVALID_ID });
      }

      const result = await deleteUserService.execute(id);

      return res.status(200).json({ message: SUCCESS_DELETED_ITEM, data: result });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}

export class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: ERROR_REQUIRED_FIELDS });
      }

      const result = await authenticateUserService.execute(email, senha);

      return res.status(200).json({ message: SUCCESS_LOGIN_ITEM, data: result });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error authenticating user:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}

// Rota pública — busca barbeiro pelo slug
export class GetUserBySlugController {
  async handle(req: Request, res: Response) {
    try {
      const slug = req.params.slug as string;

      if (!slug) {
        return res.status(400).json({ message: ERROR_REQUIRED_FIELDS });
      }

      const result = await getUserBySlugService.execute(slug);

      return res.status(200).json({ message: SUCCESS_GET_ITEM, data: result });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error getting user by slug:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}