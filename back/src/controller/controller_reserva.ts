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
import { CreateReservaService, CancelReservaService, GetReservasService, GetReservaByIdService, CancelReservaByEmailService } from "../service/reserva.js";

// Cria uma única instância de cada service para ser reutilizada pelos controllers
const createReservaService = new CreateReservaService();
const cancelReservaService = new CancelReservaService();
const getReservasService = new GetReservasService();
const getReservaByIdService = new GetReservaByIdService();
const cancelReservaByEmailService = new CancelReservaByEmailService();

export class CreateReservaController{
    async handle(req: Request, res: Response){
        try {
            const {id_horario, cliente_nome, cliente_email} = req.body;

            if(!id_horario || !cliente_nome || !cliente_email){
                return res.status(400).json({message: ERROR_REQUIRED_FIELDS});
            }

            const result = await createReservaService.execute({id_horario, cliente_nome, cliente_email })

            return res.status(201).json({message: SUCCESS_CREATED_ITEM, data: result});
            
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({message: error.message});
            }
            console.error("Error creating reserva:", error);
            return res.status(500).json({message: ERROR_INTERNAL_SERVER});
        }

    }
}

export class CancelReservaController{
            async handle(req: AuthRequest, res: Response){
                try {
                    const { id } = req.params;

                    if(!id){
                        return res.status(400).json({message: ERROR_REQUIRED_FIELDS});
                    }

                    const result = await cancelReservaService.execute(Number(id))

                    return res.status(200).json({message: SUCCESS_DELETED_ITEM, data: result});

                } catch (error) {
                    if (error instanceof AppError) {
                        return res.status(error.statusCode).json({message: error.message});
                    }
                    console.error("Error canceling reserva:", error);
                    return res.status(500).json({message: ERROR_INTERNAL_SERVER});
                }

            }
        }

export class GetReservasController{
    async handle(req: AuthRequest, res: Response){
        try {
            const result = await getReservasService.execute();

            if(result.length === 0){
                return res.status(404).json({message: "Nenhuma reserva encontrada"});
            }

            return res.status(200).json({message: SUCCESS_GET_ITEMS, data: result});

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({message: error.message});
            }
            console.error("Error getting reservas:", error);
            return res.status(500).json({message: ERROR_INTERNAL_SERVER});
        }
    }
}

export class GetReservaByIdController{
    async handle(req: AuthRequest, res: Response){
        try {
            const { id } = req.params;

            if(!id){
                return res.status(400).json({message: ERROR_REQUIRED_FIELDS});
            }

            const result = await getReservaByIdService.execute(Number(id));

            return res.status(200).json({message: SUCCESS_GET_ITEM, data: result});

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({message: error.message});
            }
            console.error("Error getting reserva by id:", error);
            return res.status(500).json({message: ERROR_INTERNAL_SERVER});
        }
    }
}

export class CancelReservaByEmailController{
    async handle(req: Request, res: Response){
        try {
            const { id } = req.params;
            const { cliente_email } = req.body;

            if(!id || !cliente_email){
                return res.status(400).json({message: ERROR_REQUIRED_FIELDS});
            }

            const result = await cancelReservaByEmailService.execute(Number(id), cliente_email);

            return res.status(200).json({message: SUCCESS_DELETED_ITEM, data: result});

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({message: error.message});
            }
            console.error("Error canceling reserva by email:", error);
            return res.status(500).json({message: ERROR_INTERNAL_SERVER});
        }
    }
}