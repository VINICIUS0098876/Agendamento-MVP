import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/middlewareAuth.js";
import {
  SUCCESS_CREATED_ITEM,
  SUCCESS_DELETED_ITEM,
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
  CreateHorarioService,
  UpdateHorarioService,
  DeleteHorarioService,
  GetHorarioByIdService,
  GetHorariosService,
  GetHorariosDisponiveisService,
} from "../service/horario.js";

// Cria uma única instância de cada service para ser reutilizada pelos controllers
const createHorarioService = new CreateHorarioService();
const updateHorarioService = new UpdateHorarioService();
const deleteHorarioService = new DeleteHorarioService();
const getHorarioByIdService = new GetHorarioByIdService();
const getHorariosService = new GetHorariosService();
const getHorariosDisponiveisService = new GetHorariosDisponiveisService();

// Controllers

// Cria um novo horario para um barbeiro (id_usuario é obtido do token)
export class CreateHorarioController {
  async handle(req: AuthRequest, res: Response) {
    try {
      const { data_hora, disponivel } = req.body;
      const id_usuario = req.userId;

      if (!id_usuario || !data_hora) {
        return res.status(400).json({ message: ERROR_REQUIRED_FIELDS });
      }

      const result = await createHorarioService.execute({
        id_usuario,
        data_hora,
        disponivel,
      });

      return res
        .status(201)
        .json({ message: SUCCESS_CREATED_ITEM, data: result });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error creating horario:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}

// Atualiza um horario existente (apenas o barbeir dono do horario pode atualizar)
export class UpdateHorarioController {
  async handle(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: ERROR_INVALID_ID });
      }

      const { data_hora, disponivel } = req.body;

      const result = await updateHorarioService.execute(id, {
        data_hora,
        disponivel,
      });

      return res
        .status(200)
        .json({ message: SUCCESS_UPDATED_ITEM, data: result });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error updating horario:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}

// Deleta um horario existente (apenas o barbeiro dono do horario pode deletar)
export class DeleteHorarioController {
  async handle(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: ERROR_INVALID_ID });
      }

      const result = await deleteHorarioService.execute(id);

      return res
        .status(200)
        .json({ message: SUCCESS_DELETED_ITEM, data: result });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error deleting horario:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}

// Lista os horarios do barbeiro pelo id do horario (apenas o barbeiro dono do horario pode acessar)
export class GetHorarioByIdController {
  async handle(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: ERROR_INVALID_ID });
      }

      const result = await getHorarioByIdService.execute(id);

      return res.status(200).json({ message: SUCCESS_GET_ITEM, data: result });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error getting horario by id:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}

// Lista todos os horarios do barbeiro
export class GetHorariosController {
  async handle(_req: Request, res: Response) {
    try {
      const result = await getHorariosService.execute();

      if (result.length === 0) {
        return res.status(404).json({ message: "Nenhum horário encontrado" });
      }

      return res.status(200).json({ message: SUCCESS_GET_ITEMS, data: result });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error getting horarios:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}

// Lista os horarios disponiveis do barbeiro (para o cliente ver os horarios livres)
export class GetHorariosDisponiveisController {
  async handle(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: ERROR_INVALID_ID });
      }

      const result = await getHorariosDisponiveisService.execute(id);

      return res.status(200).json({ message: SUCCESS_GET_ITEMS, data: result });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Error getting horarios disponiveis:", error);
      return res.status(500).json({ message: ERROR_INTERNAL_SERVER });
    }
  }
}
