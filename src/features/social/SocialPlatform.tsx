import React, { useMemo, useState } from "react";
import { demoPosts, demoUsers } from "./data";
import { AppView, Notification, NotificationKind, Post, User } from "./types";

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

const SocialPlatform = () => {
  const [users, setUsers] = useState<User[]>(demoUsers);
  const [posts, setPosts] = useState<Post[]>(demoPosts);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loginError, setLoginError] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});

  const userById = useMemo(
    () => users.reduce<Record<number, User>>((acc, user) => ({ ...acc, [user.id]: user }), {}),
    [users]
  );

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (currentView === "profile" && currentUser) {
      filtered = posts.filter((post) => post.userId === currentUser.id);
    } else if (currentView === "home" && currentUser) {
      filtered = posts.filter(
        (post) => currentUser.following.includes(post.userId) || post.userId === currentUser.id
      );
    }

    if (!searchQuery.trim()) return filtered;
    const q = searchQuery.toLowerCase();
    return filtered.filter(
      (post) =>
        post.content.toLowerCase().includes(q) || post.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [posts, currentUser, currentView, searchQuery]);

  const trending = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const addNotification = (userId: number, type: NotificationKind, fromUser: string, postId?: number) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        userId,
        type,
        fromUser,
        postId: postId ?? null,
        timestamp: new Date(),
        read: false,
      },
      ...prev,
    ]);
  };

  const handleLogin = (username: string) => {
    const normalized = username.trim().toLowerCase();
    const user = users.find((u) => u.username.toLowerCase() === normalized);
    if (!user) {
      setLoginError("User not found. Try: alex_dev, sarah_design, mike_photo, emma_writer.");
      return;
    }
    setCurrentUser(user);
    setShowLogin(false);
    setLoginError("");
  };

  const handleSignUp = (form: { username: string; name: string; bio: string }) => {
    const username = form.username.trim().toLowerCase();
    if (users.some((u) => u.username.toLowerCase() === username)) {
      setLoginError("That username is already taken.");
      return;
    }
    const newUser: User = {
      id: users.length + 1,
      username,
      name: form.name.trim(),
      bio: form.bio.trim(),
      avatar: "👤",
      followers: [],
      following: [],
      joinDate: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setShowLogin(false);
    setLoginError("");
  };

  const createPost = (content: string, tags: string, image: string) => {
    if (!currentUser) return;
    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const newPost: Post = {
      id: posts.length + 1,
      userId: currentUser.id,
      content: content.trim(),
      image: image.trim() || null,
      timestamp: new Date(),
      likes: [],
      comments: [],
      tags: parsedTags,
    };
    setPosts((prev) => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  const toggleLike = (postId: number) => {
    if (!currentUser) return;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const isLiked = post.likes.includes(currentUser.id);
        const likes = isLiked ? post.likes.filter((id) => id !== currentUser.id) : [...post.likes, currentUser.id];
        if (!isLiked && post.userId !== currentUser.id) {
          addNotification(post.userId, "like", currentUser.username, postId);
        }
        return { ...post, likes };
      })
    );
  };

  const addComment = (postId: number) => {
    if (!currentUser) return;
    const content = (commentDrafts[postId] ?? "").trim();
    if (!content) return;

    const comment = { id: Date.now(), userId: currentUser.id, content, timestamp: new Date() };
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        if (post.userId !== currentUser.id) {
          addNotification(post.userId, "comment", currentUser.username, postId);
        }
        return { ...post, comments: [...post.comments, comment] };
      })
    );
    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
  };

  const toggleFollow = (targetUserId: number) => {
    if (!currentUser) return;
    const isFollowing = currentUser.following.includes(targetUserId);
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === currentUser.id) {
          const following = isFollowing
            ? user.following.filter((id) => id !== targetUserId)
            : [...user.following, targetUserId];
          const nextCurrent = { ...user, following };
          setCurrentUser(nextCurrent);
          return nextCurrent;
        }
        if (user.id === targetUserId) {
          const followers = isFollowing
            ? user.followers.filter((id) => id !== currentUser.id)
            : [...user.followers, currentUser.id];
          return { ...user, followers };
        }
        return user;
      })
    );
    if (!isFollowing) addNotification(targetUserId, "follow", currentUser.username);
  };

  const logout = () => {
    setCurrentUser(null);
    setShowLogin(true);
    setCurrentView("home");
    setShowCreatePost(false);
    setSearchQuery("");
  };

  if (showLogin) {
    return <LoginCard onLogin={handleLogin} onSignUp={handleSignUp} error={loginError} />;
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-100">
        <Sidebar
          currentUser={currentUser}
          currentView={currentView}
          onView={setCurrentView}
          onLogout={logout}
          isDark={theme === "dark"}
          onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        />

        <aside className="fixed right-0 top-0 h-screen w-80 p-6 space-y-6 overflow-y-auto">
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts or tags..."
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5">
            <h3 className="mb-3 font-semibold">Trending</h3>
            <div className="space-y-2 text-sm">
              {trending.map((item) => (
                <div key={item.tag} className="flex justify-between">
                  <span>#{item.tag}</span>
                  <span className="text-neutral-500">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5">
            <h3 className="mb-3 font-semibold">Who to follow</h3>
            <div className="space-y-3">
              {users
                .filter((u) => u.id !== currentUser?.id && !currentUser?.following.includes(u.id))
                .slice(0, 4)
                .map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <span className="text-sm">@{user.username}</span>
                    <button
                      onClick={() => toggleFollow(user.id)}
                      className="rounded-full bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 px-3 py-1 text-xs text-white"
                    >
                      Follow
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </aside>

        <main className="ml-64 mr-80 px-6 py-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-2xl font-semibold capitalize">{currentView}</h2>

            {(currentView === "home" || currentView === "profile") && (
              <Composer
                showCreatePost={showCreatePost}
                onOpen={() => setShowCreatePost(true)}
                onClose={() => setShowCreatePost(false)}
                onCreate={createPost}
                currentUser={currentUser}
              />
            )}

            {currentView === "notifications" && (
              <div className="space-y-3">
                {notifications.filter((n) => n.userId === currentUser?.id).map((n) => (
                  <div key={n.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-sm">
                    <span className="font-medium">@{n.fromUser}</span> {n.type}d your {n.type === "follow" ? "profile" : "post"}.
                  </div>
                ))}
                {notifications.filter((n) => n.userId === currentUser?.id).length === 0 && (
                  <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center text-neutral-500">
                    No notifications yet.
                  </div>
                )}
              </div>
            )}

            {(currentView === "home" || currentView === "explore" || currentView === "profile") && (
              <div className="space-y-5">
                {filteredPosts.map((post) => {
                  const author = userById[post.userId];
                  const liked = !!currentUser && post.likes.includes(currentUser.id);
                  return (
                    <article key={post.id} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-sm">
                          <div className="font-semibold">{author?.name}</div>
                          <div className="text-neutral-500">@{author?.username}</div>
                        </div>
                        <div className="text-xs text-neutral-500">{formatTime(post.timestamp)}</div>
                      </div>
                      <p className="mb-3 text-sm leading-6">{post.content}</p>
                      {!!post.image && <div className="mb-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-6 text-center text-4xl">{post.image}</div>}
                      <div className="mb-3 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3 text-sm">
                        <button onClick={() => toggleLike(post.id)} className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1">
                          {liked ? "Unlike" : "Like"} ({post.likes.length})
                        </button>
                        <button onClick={() => toggleFollow(post.userId)} className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1">
                          {currentUser?.following.includes(post.userId) ? "Following" : "Follow"}
                        </button>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <input
                          value={commentDrafts[post.id] ?? ""}
                          onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Write a comment..."
                          className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm"
                        />
                        <button onClick={() => addComment(post.id)} className="rounded-lg bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 px-3 py-2 text-sm text-white">
                          Comment
                        </button>
                      </div>
                    </article>
                  );
                })}
                {filteredPosts.length === 0 && (
                  <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-center text-neutral-500">
                    No posts available for this view.
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const LoginCard = ({
  onLogin,
  onSignUp,
  error,
}: {
  onLogin: (username: string) => void;
  onSignUp: (data: { username: string; name: string; bio: string }) => void;
  error: string;
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-semibold">SocialHub</h1>
        <p className="mb-6 text-sm text-neutral-400">Modern social platform prototype</p>
        <div className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm" />
          {isSignUp && (
            <>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm" />
              <input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm" />
            </>
          )}
          <button
            onClick={() => (isSignUp ? onSignUp({ username, name, bio }) : onLogin(username))}
            className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-neutral-900"
          >
            {isSignUp ? "Create account" : "Sign in"}
          </button>
          {!!error && <p className="text-xs text-red-400">{error}</p>}
        </div>
        <button onClick={() => setIsSignUp((v) => !v)} className="mt-4 text-sm text-neutral-400 underline">
          {isSignUp ? "Have an account? Sign in" : "New here? Create account"}
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({
  currentView,
  onView,
  currentUser,
  onLogout,
  isDark,
  onToggleTheme,
}: {
  currentView: AppView;
  onView: (view: AppView) => void;
  currentUser: User | null;
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}) => {
  const items: AppView[] = ["home", "explore", "notifications", "profile", "settings"];
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
      <h1 className="mb-6 text-2xl font-semibold">SocialHub</h1>
      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onView(item)}
            className={`block w-full rounded-xl px-4 py-2 text-left text-sm capitalize ${
              currentView === item
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="mt-6 space-y-2">
        <button onClick={onToggleTheme} className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm">
          Theme: {isDark ? "Dark" : "Light"}
        </button>
        <button onClick={onLogout} className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm">
          Logout
        </button>
      </div>
      <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 p-3 text-sm">
        <div className="font-medium">{currentUser?.name}</div>
        <div className="text-neutral-500">@{currentUser?.username}</div>
      </div>
    </aside>
  );
};

const Composer = ({
  showCreatePost,
  onOpen,
  onClose,
  onCreate,
  currentUser,
}: {
  showCreatePost: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCreate: (content: string, tags: string, image: string) => void;
  currentUser: User | null;
}) => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");

  if (!showCreatePost) {
    return (
      <button onClick={onOpen} className="mb-5 w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-left text-sm">
        Share something, {currentUser?.name}
      </button>
    );
  }

  return (
    <div className="mb-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent p-3 text-sm" placeholder="Write your post..." />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tag1, tag2" className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm" />
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Emoji image" className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm" />
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={onClose} className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm">
          Cancel
        </button>
        <button
          onClick={() => {
            if (!content.trim()) return;
            onCreate(content, tags, image);
            setContent("");
            setTags("");
            setImage("");
          }}
          className="rounded-lg bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 px-4 py-2 text-sm text-white"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default SocialPlatform;
