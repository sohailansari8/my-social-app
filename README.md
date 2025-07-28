# SocialHub - React Social Media Platform

A modern, fully-featured social media platform built with React, TypeScript, and Tailwind CSS. Features a beautiful gradient UI with real-time interactions, user authentication, and comprehensive social features.

## 🌟 Features

### Core Functionality
- **User Authentication** - Login/Signup with demo accounts
- **Post Creation** - Rich text posts with images, tags, and emoji support
- **Social Interactions** - Like, comment, and share posts
- **Follow System** - Follow/unfollow users with real-time updates
- **Real-time Notifications** - Get notified for likes, comments, and new followers
- **Search & Discovery** - Search posts, users, and hashtags
- **Trending Topics** - Dynamic trending hashtags based on post activity

### User Interface
- **Modern Design** - Gradient backgrounds with glassmorphism effects
- **Responsive Layout** - Three-column layout with fixed sidebars
- **Interactive Elements** - Hover effects, animations, and micro-interactions
- **Dark Theme Elements** - Dark sidebar with gradient accents
- **Emoji Support** - Avatar system and image posts using emojis

### Views & Navigation
- **Home Feed** - See posts from followed users
- **Explore** - Discover all posts and trending content
- **Profile** - View and manage your own posts
- **Notifications** - Track all your social interactions
- **Settings** - User preferences and account management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project files**
   ```bash
   # Make sure you have these files:
   # - social-media-platform.tsx
   # - index.css
   # - tailwind.config.js
   ```

2. **Set up a new React project (if needed)**
   ```bash
   npx create-react-app socialhub --template typescript
   cd socialhub
   ```

3. **Install Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Replace the generated files**
   - Copy `social-media-platform.tsx` to `src/`
   - Replace `src/index.css` with the provided index.css
   - Replace `tailwind.config.js` with the provided config

5. **Update src/App.tsx**
   ```tsx
   import React from 'react';
   import SocialMediaPlatform from './social-media-platform';
   import './index.css';

   function App() {
     return <SocialMediaPlatform />;
   }

   export default App;
   ```

6. **Start the development server**
   ```bash
   npm start
   ```

## 🎮 Demo Accounts

The app comes with pre-configured demo accounts for testing:

| Username | Name | Role |
|----------|------|------|
| `alex_dev` | Alex Johnson | Full-stack Developer |
| `sarah_design` | Sarah Chen | UI/UX Designer |
| `mike_photo` | Mike Rodriguez | Photographer |
| `emma_writer` | Emma Thompson | Content Writer |

### Login Instructions
1. Click "Sign In" on the login screen
2. Enter one of the demo usernames (e.g., `alex_dev`)
3. Click "Sign In" to access the platform

## 📱 Usage Guide

### Creating Posts
1. Navigate to Home or Profile view
2. Click "Create Something Amazing" button
3. Write your content in the text area
4. Add optional tags (comma-separated)
5. Add an optional emoji image
6. Click "Post" to publish

### Social Interactions
- **Like Posts**: Click the heart icon (🤍/❤️)
- **Comment**: Click the comment icon (💬) and enter your message
- **Follow Users**: Click "Follow" button in the right sidebar suggestions
- **Search**: Use the search bar in the right sidebar

### Navigation
- **Sidebar**: Use the left sidebar to switch between views
- **Home** (🏠): See posts from users you follow
- **Explore** (🔍): Discover all posts and trending content
- **Notifications** (🔔): View your social interactions
- **Profile** (👤): Manage your posts and profile
- **Settings** (⚙️): Access account settings

## 🏗️ Architecture

### Component Structure
```
SocialMediaPlatform (Main Component)
├── LoginForm - Authentication interface
├── Sidebar - Navigation menu
├── RightSidebar - Search, trends, suggestions
├── CreatePostForm - Post creation interface
└── PostList - Dynamic post rendering
```

### State Management
The app uses React hooks for state management:
- `useState` for component state
- `useEffect` for initialization and side effects
- Local state stored in memory (no external database)

### Data Models
```typescript
interface UserType {
  id: number;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followers: string[];
  following: string[];
  joinDate: string;
}

interface PostType {
  id: number;
  userId: number;
  content: string;
  image: string | null;
  timestamp: Date;
  likes: string[];
  comments: CommentType[];
  tags: string[];
}
```

## 🎨 Styling & Design

### Tailwind CSS Configuration
The app uses Tailwind CSS for styling with:
- **Gradient backgrounds** for visual appeal
- **Glassmorphism effects** with backdrop blur
- **Hover animations** and transitions
- **Responsive design** principles
- **Custom color schemes** with blue/purple gradients

### Key Design Elements
- **Gradient Branding**: Blue to purple gradients throughout
- **Card-based Layout**: Posts and UI elements in rounded cards
- **Micro-interactions**: Hover effects and smooth transitions
- **Emoji Integration**: Visual avatars and image system
- **Modern Typography**: Clean, readable font hierarchy

## 🔧 Customization

### Adding New Features
1. **New Post Types**: Extend the `PostType` interface
2. **Additional Views**: Add new cases to the navigation system
3. **Enhanced Notifications**: Expand the `NotificationType` enum
4. **User Roles**: Add role-based permissions to `UserType`

### Styling Modifications
- Modify gradient colors in Tailwind classes
- Update the color scheme in `tailwind.config.js`
- Customize animations and transitions
- Add new UI components following the existing patterns

### Data Persistence
Currently, all data is stored in memory. To add persistence:
1. Replace state management with a backend API
2. Add local storage for offline functionality
3. Integrate with a database (Firebase, Supabase, etc.)
4. Implement user authentication with JWT tokens

## 🐛 Troubleshooting

### Tailwind CSS Not Working
1. **Check file paths** in `tailwind.config.js`
2. **Restart development server** after Tailwind setup
3. **Verify CSS imports** in `src/index.css`
4. **Use CDN as fallback**: Add `<script src="https://cdn.tailwindcss.com"></script>` to `public/index.html`

### Common Issues
- **Posts not showing**: Make sure you're following users or switch to Explore view
- **Login not working**: Use exact demo usernames (case-sensitive)
- **Styles not applying**: Clear browser cache and restart dev server
- **TypeScript errors**: Ensure all dependencies are installed

## 📦 Dependencies

### Core Dependencies
- React 18+
- TypeScript
- Tailwind CSS

### Development Dependencies
- PostCSS
- Autoprefixer
- Create React App (if using CRA)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use `gh-pages` package
- **Firebase Hosting**: Use Firebase CLI

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review the demo account setup
3. Ensure all dependencies are properly installed
4. Verify Tailwind CSS configuration

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**