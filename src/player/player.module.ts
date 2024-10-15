import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Players } from 'src/entities/Players';
import { Submissions } from 'src/entities/Submissions';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Players, Submissions])],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
