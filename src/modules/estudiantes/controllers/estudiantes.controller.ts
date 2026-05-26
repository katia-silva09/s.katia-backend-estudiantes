import { Controller, ParseIntPipe } from '@nestjs/common';
import { EstudiantesService } from '../services/ estudiantes.service';
import { CreateEstudianteDto } from '../dto/estudiante.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateEstudianteDto } from '../dto/update-estudiante.dto';

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudianteService: EstudiantesService) {}

  @MessagePattern({ cmd: 'get_all_students' })
  getAll() {
    return this.estudianteService.getAll();
  }

  @MessagePattern({ cmd: 'get_student_by_id' })
  getOne(@Payload('id', ParseIntPipe) id: number) {
    return this.estudianteService.getOne(id);
  }

  // @Post()
  @MessagePattern({ cmd: 'create_student' })
  async create(@Payload() estudianteDto: CreateEstudianteDto) {
    console.log('Prueba');
    const estudiante = await this.estudianteService.create(estudianteDto);

    const datos = {
      data: estudiante,
      message: 'Registro agregado con exito',
    };

    return datos;
  }
  @MessagePattern({ cmd: 'update_student' })
  async update(
    @Payload() data: { id: number; updateestudianteDto: UpdateEstudianteDto },
  ) {
    const estudiante = await this.estudianteService.update(
      data.id,
      data.updateestudianteDto,
    );

    return {
      data: estudiante,
      message: 'Registro actualizado con exito',
    };
  }
  @MessagePattern({ cmd: 'delete_student' })
  async remove(@Payload('id', ParseIntPipe) id: number) {
    const result = await this.estudianteService.remove(id);

    return {
      data: null,
      message: result.message,
    };
  }
}
