import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreateSubmissionDto } from 'src/submission/dto/create-submission.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.playerService.create(createSubmissionDto);
  }

  @Get()
  async getTeam() {
    return await this.playerService.getTeams();
  }
}
