import { Injectable, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ExpressAdapter, FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { extname } from 'path';
import { Model } from 'mongoose';
import { Image } from './interface/image.interface';
import { ImageFile } from './interface/image-file.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()


export class ImageService {
    constructor(@InjectModel('ImageFile') private readonly imageFileModel: Model<ImageFile>, 
                @InjectModel('Image') private readonly imageModel: Model<Image>,
            ){}

    async getAllImages(count:Number){
        const images =  await this.imageModel.find().limit(20);
        const imageids = images.map(img => img.fileid)
        // const imageFiles = await this.imageFileModel.find({ '_id': { $in: imageids}})
        return({images})
    }

    async uploadImage(@UploadedFile() file:Multer.File){
        const newFile = new this.imageFileModel({ data:file.buffer })
        return await (await newFile.save())._id;
    }

    async makeImage(createImageDto:CreateImageDto){
        const newImage = new this.imageModel(createImageDto);
        return await newImage.save();
    }

    async vote(change:Number, imageid:String):Promise<Object>{
        const image = await this.imageModel.findById(imageid);
        const upvote = +image.upvote + (change > 0 ? 1 : 0);
        const downvote = +image.downvote + (change < 0 ? 1 : 0);
        const votescore = +image.votescore + (change > 0 ? 1 : -1);
        await this.imageModel.findByIdAndUpdate(imageid, { 
            upvote: upvote,
            downvote: downvote,
            votescore: votescore
        })
        return {upvote, votescore, downvote};
    }
}
