import prismaClient from "../prisma/index.js";
import { AppError } from "../errors/AppError.js";
import {
  MarcarHorarioIndisponivelService,
  LiberarHorarioService,
} from "./horario.js";

interface CreateReservaInput {
  id_horario: number;
  cliente_nome: string;
  cliente_email: string;
}

export class CreateReservaService {
  async execute({
    id_horario,
    cliente_nome,
    cliente_email,
  }: CreateReservaInput) {
    const horario = await prismaClient.horarios.findUnique({
      where: { id_horario },
    });

    if (!horario) {
      throw new AppError(404, "Horário não encontrado");
    }

    if (!horario.disponivel) {
      throw new AppError(409, "Este horário já está reservado");
    }

    if (horario.data_hora < new Date()) {
      throw new AppError(400, "Não é possível reservar um horário no passado");
    }

    const reservaExistente = await prismaClient.reservas.findUnique({
      where: { id_horario },
    });

    if (reservaExistente) {
      throw new AppError(409, "Este horário já está reservado");
    }

    // Aqui chamamos a class MarcarHorarioIndisponivelService para marcar o horário como indisponível
    const marcarHorarioIndisponivelService =
      new MarcarHorarioIndisponivelService();
    await marcarHorarioIndisponivelService.execute(id_horario);

    const reserva = await prismaClient.reservas.create({
      data: {
        id_horario,
        cliente_nome,
        cliente_email,
      },
      include: {
        horarios: true, // Inclui os dados do horário na resposta
      },
    });

    return reserva;
  }
}

export class CancelReservaService {
  async execute(id_reserva: number) {
    const reserva = await prismaClient.reservas.findUnique({
      where: { id_reserva },
    });

    if (!reserva) {
      throw new AppError(404, "Reserva não encontrada");
    }

    // Aqui chamamos a class LiberarHorarioService para liberar o horário novamente
    if (reserva.id_horario) {
      const liberarHorarioService = new LiberarHorarioService();
      await liberarHorarioService.execute(reserva.id_horario);
    }

    const reservaCancelada = await prismaClient.reservas.delete({
      where: { id_reserva },
    });

    return reservaCancelada;
  }
}

export class GetReservasService {
  async execute() {
    const reservas = await prismaClient.reservas.findMany({
      include: {
        horarios: true, // Inclui os dados do horário na resposta
      },
    });

    return reservas;
  }
}

export class GetReservaByIdService {
  async execute(id_reserva: number) {
    const reserva = await prismaClient.reservas.findUnique({
      where: { id_reserva },
      include: {
        horarios: true, // Inclui os dados do horário na resposta
      },
    });

    if (!reserva) {
      throw new AppError(404, "Reserva não encontrada");
    }

    return reserva;
  }
}

export class CancelReservaByEmailService {
  async execute(id_reserva: number, cliente_email: string) {
    const reserva = await prismaClient.reservas.findUnique({
      where: { id_reserva },
      include: { horarios: true },
    });

    if (!reserva) {
      throw new AppError(404, "Reserva não encontrada");
    }

    if (reserva.cliente_email !== cliente_email) {
      throw new AppError(
        403,
        "Você não tem permissão para cancelar esta reserva",
      );
    }

    // // Verifica se faltam mais de 2 horas para o horário da reserva
    // if (reserva.horarios) {
    //   const agora = new Date();
    //   const horarioReserva = new Date(reserva.horarios.data_hora);
    //   const diferencaEmHoras =
    //     (horarioReserva.getTime() - agora.getTime()) / (1000 * 60 * 60);

    //   if (diferencaEmHoras < 2) {
    //     throw new AppError(
    //       400,
    //       "Só é possível cancelar com no mínimo 2 horas de antecedência",
    //     );
    //   }
    // }

    // Reutiliza o CancelReservaService que já libera o horário e deleta a reserva
    const cancelReservaService = new CancelReservaService();
    return await cancelReservaService.execute(id_reserva);
  }
}
