export interface MessagePayload {
  content: string;
  files?: Array<{
    url: string;
    fileType: string;
  }>;
}

export interface MessageResponse {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    profilePicture?: string | null;
  };
  files?: Array<{
    id: string;
    url: string;
    fileType: string;
  }>;
} 