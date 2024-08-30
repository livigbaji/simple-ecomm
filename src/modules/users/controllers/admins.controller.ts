import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admins')
@Controller('admins')
export class AdminsController {}
