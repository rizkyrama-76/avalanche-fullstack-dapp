import { ApiProperty } from '@nestjs/swagger';
import e from 'express';

export class GetEventsDto {
  @ApiProperty({
    description: 'Starting block number to fetch events from',
    example: 1000000,
  })
  fromBlock: number;
  @ApiProperty({
    description: 'The ending block number to fetch events to',
    example: 1001000,
  })
  toBlock: number;
}
