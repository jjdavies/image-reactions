import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Query, Param, StreamableFile, Put } from '@nestjs/common';
import { Express } from 'express';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { Multer, diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { join } from 'path'

import { CreateImageDto } from './dto/create-image.dto'


@Controller('image')
export class ImageController {
    constructor(private imageService:ImageService){}
    
    
    // Get all images
    @Get(':count')
    async getAllImages(@Param('count')count:Number){
        return this.imageService.getAllImages(count);
    }
    
    // Get image files with fileid
    @Get('/res/:fileid')
    getFile(@Param('fileid') fileid:string):StreamableFile{
        console.log(fileid)
        const file = createReadStream(join(process.cwd(), 'uploads', fileid ));
        return new StreamableFile(file);
    }

    // Post a new image
    @Post()
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads'
            , filename: (req, file, cb) => {
                cb(null, file.originalname)
            }
        })
    }))
    async uploadImage(@UploadedFile() file:Multer.File, @Body() createImageDto: CreateImageDto){
        // await this.imageService.uploadImage(file)
        // .then(id => {
            // createImageDto.fileid = id.toString();
            createImageDto.fileid = file.originalname;
            createImageDto.downvote = 0;
            createImageDto.upvote = 1;
            createImageDto.votescore = 0;
            return this.imageService.makeImage(createImageDto)
        // })
        // .then(id => {
        //     return this.imageService.makeImage(id, )
        // })
    }
    //upvote
    @Put('/upvote/:imageid')
    upvote(@Param('imageid')imageid:String):Promise<Object>{
        return this.imageService.vote(1, imageid);
    }
    @Put('/downvote/:imageid')
    downvote(@Param('imageid')imageid:String):Promise<Object>{
        return this.imageService.vote(-1, imageid);
    }

}
