

export interface Track {
  id: string;
  prompt: string;
  mediaUrl: string;
  coverArtUrl: string;
  lyrics?: string;
  isExample?: boolean;
}