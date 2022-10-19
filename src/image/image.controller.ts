import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Query,
  Param,
  StreamableFile,
  Put,
} from '@nestjs/common';
// import { Express } from 'express';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { join } from 'path';

import { CreateImageDto } from './dto/create-image.dto';
import { GetLimitDto } from './dto/get-limit.dto';

import { ImageEntity } from './image.entity';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  // Get images
  @Get()
  async getImages(@Query() query: GetLimitDto) {
    return this.imageService.getImages(query.limit);
  }

  // Get image files with fileid
  @Get('/:fileid/res')
  getFile(@Param('fileid') fileid: string): StreamableFile {
    console.log(fileid);
    const file = createReadStream(join(process.cwd(), 'uploads', fileid));
    return new StreamableFile(file);
  }

  // Post a new image
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile() file: Multer.File,
    // @Body() createImageDto: CreateImageDto,
    @Body() createImageDto: CreateImageDto,
  ) {
    await this.imageService.uploadImage(file).then(async (id) => {
      // createImageDto.fileid = id.toString();
      createImageDto.fileid = file.originalname;
      createImageDto.downvote = 0;
      createImageDto.upvote = 0;
      createImageDto.votescore = 0;
    });
    // const res = await this.imageService.makeImage(createImageDto);
    // console.log(res);
    return this.imageService.makeImage(createImageDto);
  }

  //upvote
  @Put('/:imageid/upvote')
  upvote(@Param('imageid') imageid: number): Promise<Record<string, any>> {
    return this.imageService.vote(1, imageid);
  }
  @Put('/:imageid/downvote')
  downvote(@Param('imageid') imageid: number): Promise<Record<string, any>> {
    return this.imageService.vote(-1, imageid);
  }
}
