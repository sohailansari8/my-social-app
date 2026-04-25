export type AppView = "home" | "explore" | "profile" | "notifications" | "settings";

export interface User {
  id: number;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number[];
  following: number[];
  joinDate: string;
}

export interface Comment {
  id: number;
  userId: number;
  content: string;
  timestamp: Date;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  image: string | null;
  timestamp: Date;
  likes: number[];
  comments: Comment[];
  tags: string[];
}

export type NotificationKind = "like" | "comment" | "follow";

export interface Notification {
  id: number;
  userId: number;
  type: NotificationKind;
  fromUser: string;
  postId?: number | null;
  timestamp: Date;
  read: boolean;
}
