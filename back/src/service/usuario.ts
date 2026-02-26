import prismaClient from "../prisma/index.js";
import * as bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../utils/message.js";
import { AppError } from "../errors/AppError.js";
import { TokenJwt } from "../middlewares/middlewareJWT.js";

export interface CreateUserInput {
  nome: string;
  email: string;
  senha: string;
  slug: string;
}

export interface UpdateUserInput {
  nome?: string;
  email?: string;
  senha?: string;
  slug?: string;
}

interface SafeUser {
  id_usuario: number;
  nome: string;
  email: string;
  slug: string;
}

function excludeSenha(user: {
  id_usuario: number;
  nome: string;
  email: string;
  senha: string;
  slug: string;
}): SafeUser {
  const { senha: _, ...safeUser } = user;
  return safeUser;
}

export class CreateUserService {
  async execute({
    nome,
    email,
    senha,
    slug,
  }: CreateUserInput): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(senha, BCRYPT_SALT_ROUNDS);

    const user = await prismaClient.usuarios.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        slug,
      },
    });

    return excludeSenha(user);
  }
}

export class UpdateUserService {
  async execute(id: number, data: UpdateUserInput): Promise<SafeUser> {
    const existingUser = await prismaClient.usuarios.findUnique({
      where: { id_usuario: id },
    });

    if (!existingUser) {
      throw new AppError(404, "Não foi encontrado nenhum item!!");
    }

    const updateData: UpdateUserInput = { ...data };

    if (data.senha) {
      updateData.senha = await bcrypt.hash(data.senha, BCRYPT_SALT_ROUNDS);
    }

    const updatedUser = await prismaClient.usuarios.update({
      where: { id_usuario: id },
      data: updateData,
    });

    return excludeSenha(updatedUser);
  }
}

export class DeleteUserService {
  async execute(id: number): Promise<SafeUser> {
    const existingUser = await prismaClient.usuarios.findUnique({
      where: { id_usuario: id },
    });

    if (!existingUser) {
      throw new AppError(404, "Não foi encontrado nenhum item!!");
    }

    const deletedUser = await prismaClient.usuarios.delete({
      where: { id_usuario: id },
    });

    return excludeSenha(deletedUser);
  }
}

export class GetUserService {
  async execute(): Promise<SafeUser[]> {
    const users = await prismaClient.usuarios.findMany();
    return users.map(excludeSenha);
  }
}

export class GetUserByIdService {
  async execute(id: number): Promise<SafeUser> {
    const user = await prismaClient.usuarios.findUnique({
      where: { id_usuario: id },
    });

    if (!user) {
      throw new AppError(404, "Não foi encontrado nenhum item!!");
    }

    return excludeSenha(user);
  }
}

interface AuthenticateUserResponse {
  usuario: {
    id_usuario: number;
    nome: string;
    email: string;
  };
  token: string;
}

export class AuthenticateUserService {
  async execute(
    email: string,
    senha: string,
  ): Promise<AuthenticateUserResponse> {
    const user = await prismaClient.usuarios.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, "Credenciais de autenticação incorretas!!");
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      throw new AppError(401, "Credenciais de autenticação incorretas!!");
    }

    const token = TokenJwt.generateToken(user.id_usuario);

    return {
      usuario: {
        id_usuario: user.id_usuario,
        nome: user.nome,
        email: user.email,
      },
      token,
    };
  }
}
