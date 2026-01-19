import { Body, Controller, Get, Post } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { GetEventsDto } from './dto/get-events.dto';


@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}
    // GET /blockchain/value
    @Get("value")
    async getValue() {
      return this.blockchainService.getLatestValue();
    }

    // POST /blockchain/events -> fetch by fromBlock/toBlock
    @Post("events")
    async getEventsByRange(@Body() body: GetEventsDto) {
      return this.blockchainService.getValueUpdatedEvents(body.fromBlock, body.toBlock);
    }
  
    // GET /blockchain/events -> fetch last 1000 blocks by default
    @Get('events')
    async getEvents() {
      return this.blockchainService.getValueUpdatedEvents(50538684, 50538685);
    }

}
