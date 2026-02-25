import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/middlewareAuth.js";
import {
  SUCCESS_CREATED_ITEM,
  SUCCESS_DELETED_ITEM,
  SUCCESS_LOGIN_ITEM,
  SUCCESS_UPDATED_ITEM,
} from "../utils/message.js";
import {
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_ID,
  ERROR_REQUIRED_FIELDS,
  ERROR_FORBIDDEN,
} from "../utils/message.js";
import { CreateUserService, UpdateUserService, GetUserByIdService, GetUserService, AuthenticateUserService, DeleteUserService } from "../service/usuario.js";

export class CreateUserController{
    async handle(req: Request, res: Response) {
        try {
            const {nome, email, senha, slug} = req.body

            if(!nome || !email || !senha || !slug){
                return res.status(400).json({message: ERROR_REQUIRED_FIELDS})
            }

            const service = new CreateUserService()
            const result = await service.execute({nome, email, senha, slug})

            return res.status(201).json({message: SUCCESS_CREATED_ITEM, data: result})
            
        } catch (error) {
            console.log("Error creating user:", error);
            return res.status(500).json({message: ERROR_INTERNAL_SERVER})
        }
    }
}

export class UpdateUserController{
    async handle(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id)
            const {nome, email, senha, slug} = req.body

            if(isNaN(id)){
                return res.status(400).json({message: ERROR_INVALID_ID})
            }

            if(!nome || !email || !senha || !slug){
                return res.status(400).json({message: ERROR_REQUIRED_FIELDS})
            }

            const service = new UpdateUserService()
            const result = await service.execute(id, { nome, email, senha, slug})

            return res.status(200).json({message: SUCCESS_UPDATED_ITEM, data: result})

        } catch (error) {
            console.log("Error updating user:", error);
            return res.status(500).json({message: ERROR_INTERNAL_SERVER})
        }
    }
}
export class GetUserController{
    async handle(req: AuthRequest, res: Response) {
        try {

            const service = new GetUserService()
            const result = await service.execute()

            return res.status(200).json({message: SUCCESS_LOGIN_ITEM, data: result})

        } catch (error) {
            console.log("Error getting user:", error);
            return res.status(500).json({message: ERROR_INTERNAL_SERVER})
        }
    }
}

export class GetUserByIdController{
    async handle(req: AuthRequest, res: Response) {
        try {
            const id = Number(req.params.id)
            if(isNaN(id)){
                return res.status(400).json({message: ERROR_INVALID_ID})
            }

            const service = new GetUserByIdService()
            const result = await service.execute(id)

            if(!result){
                return res.status(404).json({message: ERROR_NOT_FOUND})
            }

            return res.status(200).json({message: SUCCESS_LOGIN_ITEM, data: result})

        } catch (error) {
            console.log("Error getting user by id:", error);
            return res.status(500).json({message: ERROR_INTERNAL_SERVER})
        }
    }
}

export class DeleteUserController{
    async handle(req: AuthRequest, res: Response){
        try {
            const id = Number(req.params.id)

            if(isNaN(id)){
                return res.status(400).json({message: ERROR_INVALID_ID})
            }

            const service = new DeleteUserService()
            const result = await service.execute(id)

            if(!result){
                return res.status(404).json({message: ERROR_NOT_FOUND})
            }

            return res.status(200).json({message: SUCCESS_DELETED_ITEM, data: result})

        } catch (error) {
            console.log("Error deleting user:", error);
            return res.status(500).json({message: ERROR_INTERNAL_SERVER})
        }
    }
}

export class AuthenticateUserController{
    async handle(req: Request, res: Response) {
        try {
            const {email, senha} = req.body

            if(!email || !senha){
                return res.status(400).json({message: ERROR_REQUIRED_FIELDS})
            }

            const service = new AuthenticateUserService()
            const result = await service.execute(email, senha)

            return res.status(200).json({message: SUCCESS_LOGIN_ITEM, data: result})

        } catch (error) {
            console.log("Error authenticating user:", error);
            return res.status(500).json({message: ERROR_INTERNAL_SERVER})
        }
    }
}