import { Injectable, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Multer } from 'multer';
import { extname } from 'path';
import { Model } from 'mongoose';
import { Image } from './interface/image.interface';
import { ImageFile } from './interface/image-file.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CreateImageDto } from './dto/create-image.dto';
import { DataSource, Repository } from 'typeorm';
import { ImageEntity } from './image.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel('ImageFile') private readonly imageFileModel: Model<ImageFile>,
    @InjectModel('Image') private readonly imageModel: Model<Image>,
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>, // @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getImages(limit: number) {
    // const images = await this.imageModel.find().limit(limit);
    const images = await this.imageRepository.find();
    console.log(images);
    return { images };
  }

  async uploadImage(@UploadedFile() file: Multer.File) {
    const newFile = new this.imageFileModel({ data: file.buffer });
    return (await newFile.save())._id;
  }

  // async makeImage(createImageDto: CreateImageDto) {
  //   const newImage = new this.imageModel(createImageDto);
  //   return await newImage.save();
  // }

  async makeImage(createImageDto: CreateImageDto) {
    const image: ImageEntity = new ImageEntity();
    image.fileid = createImageDto.fileid;
    image.uploader = createImageDto.uploader;
    image.uploaderid = createImageDto.uploaderid;
    image.downvote = createImageDto.downvote;
    image.upvote = createImageDto.upvote;
    image.votescore = createImageDto.votescore;
    image.landscape = createImageDto.landscape;
    return this.imageRepository.save(image);
  }

  // async createImage(image: ImageEntity) {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     console.log(image);
  //     await queryRunner.manager.save(image);
  //     await queryRunner.commitTransaction();
  //     // console.log(queryRunner);
  //   } catch (err) {
  //     console.log(err);
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async vote(change: number, id: number): Promise<Record<string, any>> {
    // const image = await this.imageModel.findById(imageid);
    const image = await this.imageRepository.findOneBy({ id });
    console.log(image);
    const upvote = +image.upvote + (change > 0 ? 1 : 0);
    const downvote = +image.downvote + (change < 0 ? 1 : 0);
    const votescore = +image.votescore + (change > 0 ? 1 : -1);
    // await this.imageModel.findByIdAndUpdate(imageid, {
    //   upvote: upvote,
    //   downvote: downvote,
    //   votescore: votescore,
    // });
    this.imageRepository.update(id, { upvote, downvote, votescore });
    return { upvote, votescore, downvote };
  }
}
