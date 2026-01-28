export interface Review {
  id: number;
  documentId: string;
  title: string;
  rating: number;
  body: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: any;
}
