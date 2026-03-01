import prismaClient from "../prisma/index.js";
import { AppError } from "../errors/AppError.js";

interface CreateHorarioInput {
  id_usuario: number;
  data_hora: string;
  disponivel: boolean;
}

interface UpdateHorarioInput {
  data_hora?: string;
  disponivel?: boolean;
}

export class CreateHorarioService {
  async execute({ id_usuario, data_hora, disponivel }: CreateHorarioInput) {
    const dataHoraParsed = new Date(data_hora);

    // Validação: não permite criar horário no passado
    if (dataHoraParsed <= new Date()) {
      throw new AppError(400, "Não é possível criar um horário no passado");
    }

    // Validação: verifica se já existe um horário para o mesmo barbeiro na mesma data/hora
    const horarioDuplicado = await prismaClient.horarios.findFirst({
      where: {
        id_usuario,
        data_hora: dataHoraParsed,
      },
    });

    if (horarioDuplicado) {
      throw new AppError(
        409,
        "Já existe um horário cadastrado para este barbeiro nesta data/hora",
      );
    }

    const horario = await prismaClient.horarios.create({
      data: {
        id_usuario,
        data_hora: dataHoraParsed,
        disponivel,
      },
    });

    return horario;
  }
}

export class UpdateHorarioService {
  async execute(
    id_horario: number,
    { data_hora, disponivel }: UpdateHorarioInput,
  ) {
    const existingHorario = await prismaClient.horarios.findUnique({
      where: { id_horario },
    });

    if (!existingHorario) {
      throw new AppError(404, "Horário não encontrado");
    }

    // Se está atualizando a data_hora, valida que não é no passado
    if (data_hora) {
      const dataHoraParsed = new Date(data_hora);
      if (dataHoraParsed <= new Date()) {
        throw new AppError(
          400,
          "Não é possível atualizar para um horário no passado",
        );
      }
    }

    const updateHorario = await prismaClient.horarios.update({
      where: { id_horario },
      data: {
        data_hora: data_hora ? new Date(data_hora) : existingHorario.data_hora,
        disponivel: disponivel ?? existingHorario.disponivel,
      },
    });

    return updateHorario;
  }
}

export class DeleteHorarioService {
  async execute(id_horario: number) {
    const existingHorario = await prismaClient.horarios.findUnique({
      where: { id_horario },
    });

    if (!existingHorario) {
      throw new AppError(404, "Horário não encontrado");
    }

    const deleteHorario = await prismaClient.horarios.delete({
      where: { id_horario },
    });

    return deleteHorario;
  }
}

export class GetHorariosService {
  async execute() {
    const horarios = await prismaClient.horarios.findMany();

    if (horarios.length === 0) {
      throw new AppError(404, "Nenhum horário encontrado");
    }

    return horarios;
  }
}

// Busca apenas horários disponíveis (para o cliente ver os horários livres)
export class GetHorariosDisponiveisService {
  async execute(id_usuario: number) {
    const horarios = await prismaClient.horarios.findMany({
      where: {
        id_usuario,
        disponivel: true,
        // Só mostra horários futuros
        data_hora: {
          gt: new Date(),
        },
      },
      orderBy: {
        data_hora: "asc",
      },
    });

    if (horarios.length === 0) {
      throw new AppError(404, "Nenhum horário disponível encontrado");
    }

    return horarios;
  }
}

export class GetHorarioByIdService {
  async execute(id_horario: number) {
    const horario = await prismaClient.horarios.findUnique({
      where: { id_horario },
    });

    if (!horario) {
      throw new AppError(404, "Horário não encontrado");
    }

    return horario;
  }
}

// Marca o horário como indisponível quando uma reserva é feita - Manter como service e não rota
export class MarcarHorarioIndisponivelService {
  async execute(id_horario: number) {
    const horario = await prismaClient.horarios.findUnique({
      where: { id_horario },
    });

    if (!horario) {
      throw new AppError(404, "Horário não encontrado");
    }

    if (!horario.disponivel) {
      throw new AppError(409, "Este horário já está ocupado");
    }

    const horarioAtualizado = await prismaClient.horarios.update({
      where: { id_horario },
      data: { disponivel: false },
    });

    return horarioAtualizado;
  }
}

// Libera o horário novamente (caso uma reserva seja cancelada) - Manter como service e não rota
export class LiberarHorarioService {
  async execute(id_horario: number) {
    const horario = await prismaClient.horarios.findUnique({
      where: { id_horario },
    });

    if (!horario) {
      throw new AppError(404, "Horário não encontrado");
    }

    const horarioAtualizado = await prismaClient.horarios.update({
      where: { id_horario },
      data: { disponivel: true },
    });

    return horarioAtualizado;
  }
}
