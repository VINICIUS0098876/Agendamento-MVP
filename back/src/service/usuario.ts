import prismaClient from "../prisma/index.js";
import * as bcrypt from "bcrypt";
import {
  ERROR_REQUIRED_FIELDS,
  ERROR_INTERNAL_SERVER_DB,
  ERROR_NOT_FOUND,
  ERROR_INVALID_ID,
  ERROR_INVALID_CREDENTIALS,
} from "../utils/message.js";
import { TokenJwt } from "../middlewares/middlewareJWT.js";

interface user{
    nome: string,
    email: string,
    senha: string,
    slug: string
}

type CreateUserResult =
| Awaited<ReturnType<typeof prismaClient.usuarios.create>>
| typeof ERROR_REQUIRED_FIELDS
| typeof ERROR_INTERNAL_SERVER_DB;

export class CreateUserService {
    async execute({nome, email, senha, slug}: user): Promise<CreateUserResult>{
        try {
            if(!nome || !email || !senha || !slug){
                return ERROR_REQUIRED_FIELDS;
            }

            const hashedPassword = await bcrypt.hash(senha, 10)
            const user = await prismaClient.usuarios.create({
                data: {
                    nome,
                    email,
                    senha: hashedPassword,
                    slug
                }
            })

            return user;
            
        } catch (error) {
            console.error("Error creating user:", error);
            return ERROR_INTERNAL_SERVER_DB;
        }
    }
}

type UpdateUserResult =
| Awaited<ReturnType<typeof prismaClient.usuarios.update>>
| typeof ERROR_NOT_FOUND
| typeof ERROR_INVALID_ID
| typeof ERROR_INTERNAL_SERVER_DB;

export class UpdateUserService {
    async execute(id: number, {nome, email,senha, slug}: user): Promise<UpdateUserResult>{
        try {
            const existingUser = await prismaClient.usuarios.findUnique({
                where: {id_usuario: id}
            })

            if(!existingUser){
                return ERROR_NOT_FOUND;
            }

            const hashedPassword = await bcrypt.hash(senha, 10)
            const updatedUser = await prismaClient.usuarios.update({
                where: {id_usuario: id},
                data: {
                    nome, 
                    email, 
                    senha: hashedPassword, 
                    slug
                }
            })

            return updatedUser;

        } catch (error) {
            console.error("Error updating user:", error);
            return ERROR_INTERNAL_SERVER_DB;
        }
    }
}

type DeleteUserResult =
| Awaited<ReturnType<typeof prismaClient.usuarios.delete>>
| typeof ERROR_NOT_FOUND
| typeof ERROR_INVALID_ID
| typeof ERROR_INTERNAL_SERVER_DB;

export class DeleteUserService{
    async execute(id: number): Promise<DeleteUserResult>{
        try {
            const existingUser = await prismaClient.usuarios.findUnique({
                where: {id_usuario: id}
            })

            if(!existingUser){
                return ERROR_NOT_FOUND;
            }

            const deletedUser = await prismaClient.usuarios.delete({
                where: {id_usuario: id}
            })

            return deletedUser;

        } catch (error) {
            console.error("Error deleting user:", error);
            return ERROR_INTERNAL_SERVER_DB;
        }
    }
}

type GetUserResult =
| Awaited<ReturnType<typeof prismaClient.usuarios.findMany>>
| typeof ERROR_NOT_FOUND
| typeof ERROR_INTERNAL_SERVER_DB;

export class GetUserService{
    async execute(): Promise<GetUserResult>{
        try {
            const users = await prismaClient.usuarios.findMany();

            return users;

        } catch (error) {
            console.error("Error fetching users:", error);
            return ERROR_INTERNAL_SERVER_DB;
        }
    }
}

type GetUserByIdResult =
| Awaited<ReturnType<typeof prismaClient.usuarios.findUnique>>
| typeof ERROR_NOT_FOUND
| typeof ERROR_INVALID_ID
| typeof ERROR_INTERNAL_SERVER_DB;

export class GetUserByIdService{
    async execute(id: number): Promise<GetUserByIdResult>{
        try {
            const user = await prismaClient.usuarios.findUnique({
                where: {id_usuario: id}
            })

            if(!user){
                return ERROR_NOT_FOUND;
            }

            return user;

        } catch (error) {
            console.error("Error fetching user by ID:", error);
            return ERROR_INTERNAL_SERVER_DB;
        }
    }
}

type AuthenticateUserResult =
| {
    usuario: {
        id_usuario: number;
        nome: string;
        email: string;
    };
    token: string;
}
| typeof ERROR_REQUIRED_FIELDS
| typeof ERROR_INVALID_CREDENTIALS
| typeof ERROR_INTERNAL_SERVER_DB

export class AuthenticateUserService{
    async execute(email: string, senha: string): Promise<AuthenticateUserResult>{
        try {
            if(!email || !senha){
                return ERROR_REQUIRED_FIELDS;
            }
            const user = await prismaClient.usuarios.findUnique({
                where: {
                    email: email,
                }
            })
            if(!user){
                return ERROR_INVALID_CREDENTIALS;
            }

            const isPasswordValid = await bcrypt.compare(senha, user.senha);
            if(!isPasswordValid){
                return ERROR_INVALID_CREDENTIALS;
            }

            const token = TokenJwt.generateToken(user.id_usuario);

            return {
                usuario: {
                    id_usuario: user.id_usuario,
                    nome: user.nome,
                    email: user.email
                },
                token
            }
            
        } catch (error) {
            console.error("Error authenticating user:", error);
            return ERROR_INTERNAL_SERVER_DB;
        }
    }
}