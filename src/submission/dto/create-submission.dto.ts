import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty()
  bjname: string;

  @ApiProperty()
  titleNo: number;
}
