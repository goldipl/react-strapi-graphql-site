export interface BlockChild {
  text: string;
  type: string;
}

export interface BodyBlock {
  type: string;
  children: BlockChild[];
}

export interface Review {
  id: number;
  documentId: string;
  title: string;
  rating: number;
  body: BodyBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
