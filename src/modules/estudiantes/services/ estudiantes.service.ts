import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from '../entities/estudiante.entity';
import { Repository } from 'typeorm';
import { CreateEstudianteDto } from '../dto/estudiante.dto';
import { UpdateEstudianteDto } from '../dto/update-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepo: Repository<Estudiante>,
  ) {}

  async getAll(): Promise<Estudiante[]> {
    return await this.estudianteRepo.find();
  }

  async getOne(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepo.findOne({ where: { id } });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    return estudiante;
  }

  async create(estudianteDto: CreateEstudianteDto) {
    try {
      const estudiante = this.estudianteRepo.create(estudianteDto);

      return await this.estudianteRepo.save(estudiante);
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, estudianteDto: UpdateEstudianteDto) {
    try {
      const students = await this.estudianteRepo.findOneBy({ id });

      if (!students) {
        throw new NotFoundException(`El estudiante con id ${id} no existe`);
      }

      const updated = {
        ...students,
        ...estudianteDto,
        id: students.id,
      };

      return await this.estudianteRepo.save(updated);
    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
  }
  async remove(id: number) {
    const estudiante = await this.estudianteRepo.findOne({ where: { id } });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    await this.estudianteRepo.remove(estudiante);

    return {
      message: 'Estudiante eliminado correctamente',
    };
  }
}
