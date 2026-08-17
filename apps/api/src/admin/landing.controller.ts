import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
@Controller('landing-content')
@ApiTags('Landing Content')
export class LandingController {
  constructor(private readonly adminService: AdminService) {}
  @Get()
  @ApiOperation({
    summary: 'List published landing-page content in display order',
  })
  @ApiOkResponse({ description: 'Published content only' })
  findPublished() {
    return this.adminService.findPublishedContent();
  }
}
