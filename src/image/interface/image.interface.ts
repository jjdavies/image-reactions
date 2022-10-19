export interface Image {
  fileid: string;
  uploader: string;
  uploaderid: string;
  upvote: number;
  downvote: number;
  votescore: number;
  reactions: Array<string>;
  landscape: boolean;
}
