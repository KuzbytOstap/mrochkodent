import {
  Controller,
  Get,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service.js';
import { HealthResponseDto } from './health-response.dto.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Стан API та доступність бази даних' })
  @ApiOkResponse({ type: HealthResponseDto })
  @ApiServiceUnavailableResponse({ type: HealthResponseDto })
  async check(): Promise<HealthResponseDto> {
    try {
      await this.prisma.ping();
    } catch (error) {
      // Деталі помилки лишаються в логах і не потрапляють у публічну відповідь.
      this.logger.error(`Database is unreachable: ${describeError(error)}`);
      const body: HealthResponseDto = { status: 'error', database: 'down' };
      throw new ServiceUnavailableException(body);
    }
    return { status: 'ok', database: 'up' };
  }
}

function describeError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  // Prisma кладе причину (наприклад, ECONNREFUSED) у code, а не в message.
  const code = (error as { code?: unknown }).code;
  const message = error.message.replace(/\s+/g, ' ').trim();
  return typeof code === 'string' ? `[${code}] ${message}` : message;
}
