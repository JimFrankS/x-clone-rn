
// mobile/types/index.ts for type definitions, which can be imported in other files in order to avoid circular dependencies. In other words, this file serves as a central location for defining and exporting types that are used across multiple files in the project.


export interface User { // Simplified user model
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface Comment { // Simplified comment model
  _id: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface Post { // Simplified post model
  _id: string;
  content: string;
  image?: string;
  createdAt: string;
  user: User;
  likes: string[];
  comments: Comment[];
}

export interface Notification { // Simplified notification model
  _id: string;
  from: {
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  to: string;
  type: "like" | "comment" | "follow";
  post?: {
    _id: string;
    content: string;
    image?: string;
  };
  comment?: {
    _id: string;
    content: string;
  };
  createdAt: string;
}