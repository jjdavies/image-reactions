export class CreateImageDto {
    id:String;
    fileid:String;
    uploader:String;
    uploaderid:String;
    upvote:Number;
    downvote:Number;
    votescore:Number;
    reactions:Array<String>;
    landscape:Boolean;
}