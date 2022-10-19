import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema } from './schema/image.schema';
import { ImageFileSchema } from './schema/image-file.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ImageFile', schema: ImageFileSchema },
      { name: 'Image', schema: ImageSchema },
    ]),
    TypeOrmModule.forFeature([ImageEntity]),
  ],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
