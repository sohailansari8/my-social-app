import React, { useState, useEffect } from "react";

// --- INTERFACES ---

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

interface CommentType {
  id: number;
  userId: number;
  content: string;
  timestamp: Date;
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

type NotificationTypeEnum = "like" | "comment" | "follow";
interface NotificationType {
  id: number;
  userId: number;
  type: NotificationTypeEnum;
  fromUser: string;
  postId?: number | null;
  timestamp: Date;
  read: boolean;
}

// --- MAIN COMPONENT ---
const SocialMediaPlatform = () => {
  // State management
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [currentView, setCurrentView] = useState<"home" | "explore" | "profile" | "notifications" | "settings">("home");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Effect to Initialize Demo Data ---
  useEffect(() => {
    const demoUsers: UserType[] = [
      {
        id: 1,
        username: "alex_dev",
        name: "Alex Johnson",
        bio: "Full-stack developer passionate about React and Node.js",
        avatar: "👨‍💻",
        followers: ["2", "3"],
        following: ["2", "4"],
        joinDate: "2023-01-15",
      },
      {
        id: 2,
        username: "sarah_design",
        name: "Sarah Chen",
        bio: "UI/UX Designer creating beautiful digital experiences",
        avatar: "👩‍🎨",
        followers: ["1", "3", "4"],
        following: ["1"],
        joinDate: "2023-02-20",
      },
      {
        id: 3,
        username: "mike_photo",
        name: "Mike Rodriguez",
        bio: "Photographer capturing life one frame at a time",
        avatar: "📸",
        followers: ["1", "2"],
        following: ["1", "2", "4"],
        joinDate: "2023-03-10",
      },
      {
        id: 4,
        username: "emma_writer",
        name: "Emma Thompson",
        bio: "Content writer and storyteller",
        avatar: "✍️",
        followers: ["2"],
        following: ["1", "2", "3"],
        joinDate: "2023-04-05",
      },
    ];
    const demoPosts: PostType[] = [
      {
        id: 1,
        userId: 2,
        content: "Just finished designing a new mobile app interface! Clean, minimal, and user-friendly. What do you think about the current design trends? #UIDesign #MobileApp",
        image: null,
        timestamp: new Date("2024-06-28T10:30:00"),
        likes: ["1", "3"],
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
        content: "Working on a new React project with some exciting features. The component architecture is coming together nicely! Any React developers here?",
        image: null,
        timestamp: new Date("2024-06-28T09:15:00"),
        likes: ["2", "4"],
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
        likes: ["1", "2", "4"],
        comments: [],
        tags: ["Photography", "Beach", "GoldenHour"],
      },
    ];
    setUsers(demoUsers);
    setPosts(demoPosts);
  }, []);

  // --- AUTHENTICATION ---
  const handleLogin = (username: string) => {
    const user = users.find((u) => u.username === username);
    if (user) {
      setCurrentUser(user);
      setShowLogin(false);
    } else {
      alert("User not found! Try: alex_dev, sarah_design, mike_photo, or emma_writer");
    }
  };

  const handleSignUp = (userData: { username: string; name: string; bio: string }) => {
    const newUser: UserType = {
      id: users.length + 1,
      ...userData,
      avatar: "👤",
      followers: [],
      following: [],
      joinDate: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setShowLogin(false);
  };

  // --- POSTS ---
  const createPost = (content: string, tags: string[], image: string | null) => {
    if (!currentUser) return;
    const newPost: PostType = {
      id: posts.length + 1,
      userId: currentUser.id,
      content,
      image,
      timestamp: new Date(),
      likes: [],
      comments: [],
      tags: tags || [],
    };
    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
  };

  const toggleLike = (postId: number) => {
    if (!currentUser) return;
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(currentUser.id.toString());
          const newLikes = isLiked
            ? post.likes.filter((id) => id !== currentUser.id.toString())
            : [...post.likes, currentUser.id.toString()];
          if (!isLiked && post.userId !== currentUser.id) {
            addNotification(post.userId, "like", currentUser.username, postId);
          }
          return { ...post, likes: newLikes };
        }
        return post;
      })
    );
  };

  const addComment = (postId: number, content: string) => {
    if (!currentUser) return;
    const newComment: CommentType = {
      id: Date.now(),
      userId: currentUser.id,
      content,
      timestamp: new Date(),
    };
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          if (post.userId !== currentUser.id) {
            addNotification(post.userId, "comment", currentUser.username, postId);
          }
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
  };

  // --- FOLLOW SYSTEM ---
  const toggleFollow = (targetUserId: number) => {
    if (!currentUser) return;
    const targetUser = users.find((u) => u.id === targetUserId);
    if (!targetUser) return;
    const isFollowing = currentUser.following.includes(targetUserId.toString());
    setUsers(
      users.map((user) => {
        if (user.id === currentUser.id) {
          const newFollowing = isFollowing
            ? user.following.filter((id) => id !== targetUserId.toString())
            : [...user.following, targetUserId.toString()];
          setCurrentUser({ ...user, following: newFollowing });
          return { ...user, following: newFollowing };
        }
        if (user.id === targetUserId) {
          const newFollowers = isFollowing
            ? user.followers.filter((id) => id !== currentUser.id.toString())
            : [...user.followers, currentUser.id.toString()];
          return { ...user, followers: newFollowers };
        }
        return user;
      })
    );
    if (!isFollowing) {
      addNotification(targetUserId, "follow", currentUser.username);
    }
  };

  // --- NOTIFICATIONS ---
  const addNotification = (
    userId: number,
    type: NotificationTypeEnum,
    fromUser: string,
    postId: number | null = null
  ) => {
    const newNotification: NotificationType = {
      id: Date.now(),
      userId,
      type,
      fromUser,
      postId,
      timestamp: new Date(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  // --- UTILITIES ---
  const getFilteredPosts = (): PostType[] => {
    let filtered = posts;
    if (currentView === "profile" && currentUser) {
      filtered = posts.filter((post) => post.userId === currentUser.id);
    } else if (currentView === "home" && currentUser) {
      const followingIds = currentUser.following.map((id) => parseInt(id));
      filtered = posts.filter(
        (post) =>
          followingIds.includes(post.userId) || post.userId === currentUser.id
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }
    return filtered;
  };

  const getTrendingTags = (): string[] => {
    const tagCounts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "now";
  };

  // --- SIDEBAR COMPONENT ---
  const Sidebar = () => (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 p-6 shadow-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          SocialHub
        </h1>
        <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
      </div>
      
      <nav className="space-y-2">
        {[
          { key: "home", icon: "🏠", label: "Home" },
          { key: "explore", icon: "🔍", label: "Explore" },
          { key: "notifications", icon: "🔔", label: "Notifications" },
          { key: "profile", icon: "👤", label: "Profile" },
          { key: "settings", icon: "⚙️", label: "Settings" }
        ].map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setCurrentView(key as any)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === key 
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105" 
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <span className="text-xl">{icon}</span>
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {currentUser && (
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentUser.avatar}</span>
              <div>
                <div className="text-white font-semibold text-sm">{currentUser.name}</div>
                <div className="text-gray-400 text-xs">@{currentUser.username}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // --- LOGIN FORM ---
  const LoginForm = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
      username: "",
      name: "",
      bio: "",
    });

    const handleSubmit = () => {
      if (isSignUp) {
        if (formData.username && formData.name && formData.bio) {
          handleSignUp(formData);
        } else {
          alert("Please fill in all fields");
        }
      } else {
        if (formData.username) {
          handleLogin(formData.username);
        } else {
          alert("Please enter a username");
        }
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SocialHub
            </h1>
            <p className="text-gray-300">Connect with the world</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm"
            />
            
            {isSignUp && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm"
                />
                <input
                  type="text"
                  placeholder="Bio"
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm"
                />
              </>
            )}
            
            <button 
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </div>

          <div className="text-center mt-6">
            <span className="text-gray-300">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-gray-300 mb-2">Demo accounts:</p>
              <div className="text-xs text-gray-400 space-y-1">
                <div>@alex_dev • @sarah_design</div>
                <div>@mike_photo • @emma_writer</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- CREATE POST FORM ---
  const CreatePostForm = () => {
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [image, setImage] = useState<string | null>(null);

    const handleCreate = () => {
      if (!content.trim()) {
        alert("Please write something!");
        return;
      }
      createPost(content, tags.split(",").map(t => t.trim()).filter(Boolean), image);
      setContent("");
      setTags("");
      setImage(null);
    };

    return (
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 mb-6 transform transition-all duration-200">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl">{currentUser?.avatar}</span>
          <div className="flex-1">
            <div className="text-gray-600 text-sm">What's on your mind, {currentUser?.name}?</div>
          </div>
        </div>
        
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Share your thoughts with the world..."
          rows={4}
          className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
        />
        
        <div className="flex gap-3 mt-4">
          <input
            type="text"
            placeholder="Add tags (comma separated)"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
          />
          <input
            type="text"
            placeholder="Image emoji"
            value={image ?? ""}
            onChange={e => setImage(e.target.value || null)}
            className="w-32 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm text-center"
          />
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <span>📷</span>
              <span className="text-sm">Photo</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <span>📍</span>
              <span className="text-sm">Location</span>
            </button>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowCreatePost(false)}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreate}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- RIGHT SIDEBAR ---
  const RightSidebar = () => {
    const trendingTags = getTrendingTags();
    const suggestedUsers = users.filter(u => 
      u.id !== currentUser?.id && 
      !currentUser?.following.includes(u.id.toString())
    ).slice(0, 3);

    return (
      <div className="fixed right-0 top-0 h-screen w-80 p-6 space-y-6 overflow-y-auto">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search posts, people, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-400 transition-all text-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔥</span>
            Trending Topics
          </h3>
          <div className="space-y-3">
            {trendingTags.map((tag, index) => (
              <div key={tag} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                <div>
                  <div className="font-medium text-gray-800">#{tag}</div>
                  <div className="text-xs text-gray-500">{posts.filter(p => p.tags.includes(tag)).length} posts</div>
                </div>
                <div className="text-xs text-gray-400">#{index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>👥</span>
            Who to Follow
          </h3>
          <div className="space-y-4">
            {suggestedUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{user.avatar}</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{user.name}</div>
                    <div className="text-gray-500 text-xs">@{user.username}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(user.id)}
                  className="px-4 py-1.5 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors font-medium"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-gray-50">
      {showLogin && <LoginForm />}

      {!showLogin && (
        <>
          <Sidebar />
          <RightSidebar />
          
          <div className="ml-64 mr-80 min-h-screen">
            <div className="max-w-2xl mx-auto py-8 px-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {currentView === 'home' && '🏠 Home Feed'}
                  {currentView === 'explore' && '🔍 Explore'}
                  {currentView === 'profile' && '👤 My Profile'}
                  {currentView === 'notifications' && '🔔 Notifications'}
                  {currentView === 'settings' && '⚙️ Settings'}
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
              </div>

              {(currentView === 'home' || currentView === 'profile') && (
                <>
                  {showCreatePost ? (
                    <CreatePostForm />
                  ) : (
                    <button 
                      onClick={() => setShowCreatePost(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl mb-6 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 font-medium"
                    >
                      <span className="text-xl">✨</span>
                      Create Something Amazing
                    </button>
                  )}
                </>
              )}

              <div className="space-y-6">
                {getFilteredPosts().map((post) => {
                  const postUser = users.find((u) => u.id === post.userId);
                  const isLiked = post.likes.includes(currentUser?.id.toString() ?? "");
                  
                  return (
                    <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                      <div className="p-6 pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <span className="text-3xl">{postUser?.avatar}</span>
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                              <div className="font-bold text-gray-800">{postUser?.name}</div>
                              <div className="text-gray-500 text-sm">@{postUser?.username}</div>
                            </div>
                          </div>
                          <div className="text-gray-400 text-sm">{formatTime(post.timestamp)}</div>
                        </div>
                        
                        <div className="text-gray-800 leading-relaxed mb-4">{post.content}</div>
                        
                        {post.image && (
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-4 text-center">
                            <div className="text-6xl">{post.image}</div>
                          </div>
                        )}
                        
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                              <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium hover:bg-blue-200 transition-colors cursor-pointer">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-6">
                            <button 
                              onClick={() => toggleLike(post.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                isLiked 
                                  ? "bg-red-100 text-red-600 hover:bg-red-200" 
                                  : "hover:bg-gray-100 text-gray-600 hover:text-red-500"
                              }`}
                            >
                              <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
                              <span className="font-medium">{post.likes.length}</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                const content = prompt("💬 Add a comment:");
                                if (content) addComment(post.id, content);
                              }}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-all duration-200"
                            >
                              <span className="text-lg">💬</span>
                              <span className="font-medium">{post.comments.length}</span>
                            </button>
                            
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-green-100 text-gray-600 hover:text-green-600 transition-all duration-200">
                              <span className="text-lg">🔄</span>
                              <span className="font-medium">Share</span>
                            </button>
                          </div>
                          
                          <button className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                            <span className="text-lg">🔖</span>
                          </button>
                        </div>
                      </div>
                      
                      {post.comments.length > 0 && (
                        <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100">
                          <div className="space-y-3">
                            {post.comments.slice(0, 3).map((comment) => {
                              const commentUser = users.find((u) => u.id === comment.userId);
                              return (
                                <div key={comment.id} className="flex gap-3">
                                  <span className="text-lg">{commentUser?.avatar}</span>
                                  <div className="flex-1">
                                    <div className="bg-white rounded-xl p-3 shadow-sm">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-800 text-sm">{commentUser?.name}</span>
                                        <span className="text-gray-400 text-xs">{formatTime(comment.timestamp)}</span>
                                      </div>
                                      <div className="text-gray-700 text-sm">{comment.content}</div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {post.comments.length > 3 && (
                              <button className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors ml-12">
                                View {post.comments.length - 3} more comments
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {getFilteredPosts().length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts yet</h3>
                  <p className="text-gray-500">
                    {currentView === 'profile' 
                      ? "Share your first post to get started!" 
                      : "Follow some users to see their posts in your feed."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialMediaPlatform;