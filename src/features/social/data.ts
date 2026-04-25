import { Post, User } from "./types";

export const demoUsers: User[] = [
  {
    id: 1,
    username: "alex_dev",
    name: "Alex Johnson",
    bio: "Full-stack developer passionate about React and Node.js",
    avatar: "👨‍💻",
    followers: [2, 3],
    following: [2, 4],
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    username: "sarah_design",
    name: "Sarah Chen",
    bio: "UI/UX Designer creating beautiful digital experiences",
    avatar: "👩‍🎨",
    followers: [1, 3, 4],
    following: [1],
    joinDate: "2023-02-20",
  },
  {
    id: 3,
    username: "mike_photo",
    name: "Mike Rodriguez",
    bio: "Photographer capturing life one frame at a time",
    avatar: "📸",
    followers: [1, 2],
    following: [1, 2, 4],
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    username: "emma_writer",
    name: "Emma Thompson",
    bio: "Content writer and storyteller",
    avatar: "✍️",
    followers: [2],
    following: [1, 2, 3],
    joinDate: "2023-04-05",
  },
];

export const demoPosts: Post[] = [
  {
    id: 1,
    userId: 2,
    content:
      "Just finished designing a new mobile app interface! Clean, minimal, and user-friendly. What do you think about the current design trends? #UIDesign #MobileApp",
    image: null,
    timestamp: new Date("2024-06-28T10:30:00"),
    likes: [1, 3],
    comments: [
      {
        id: 1,
        userId: 1,
        content: "Looks amazing! Love the clean aesthetic.",
        timestamp: new Date("2024-06-28T11:00:00"),
      },
      {
        id: 2,
        userId: 3,
        content: "Great work Sarah! The color palette is perfect.",
        timestamp: new Date("2024-06-28T11:15:00"),
      },
    ],
    tags: ["UIDesign", "MobileApp"],
  },
  {
    id: 2,
    userId: 1,
    content:
      "Working on a new React project with some exciting features. The component architecture is coming together nicely! Any React developers here?",
    image: null,
    timestamp: new Date("2024-06-28T09:15:00"),
    likes: [2, 4],
    comments: [
      {
        id: 3,
        userId: 2,
        content: "Would love to see the code structure!",
        timestamp: new Date("2024-06-28T09:45:00"),
      },
    ],
    tags: ["React", "Development"],
  },
  {
    id: 3,
    userId: 3,
    content: "Golden hour photography session at the beach today. The lighting was absolutely perfect! 🌅",
    image: "🏖️",
    timestamp: new Date("2024-06-28T08:00:00"),
    likes: [1, 2, 4],
    comments: [],
    tags: ["Photography", "Beach", "GoldenHour"],
  },
];
