import * as mongoose from 'mongoose'

export const ImageFileSchema = new mongoose.Schema({
    data:Buffer
})