import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { MongooseModule } from '@nestjs/mongoose'
import { ImageSchema } from './schema/image.schema' 
import { ImageFileSchema } from './schema/image-file.schema' 

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ImageFile', schema: ImageFileSchema }, { name: 'Image', schema: ImageSchema }])],
  providers: [ImageService],
  controllers: [ImageController]
})
export class ImageModule {}
