import * as mongoose from 'mongoose';

export const ImageSchema = new mongoose.Schema({
  id: String,
  fileid: String,
  uploader: String,
  uploaderid: String,
  upvote: Number,
  downvote: Number,
  votescore: Number,
  reactions: Array,
  landscape: Boolean,
});
