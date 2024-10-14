import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submissions } from 'src/entities/Submissions';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Submissions])],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
