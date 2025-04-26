import type { Download, YouTubePlaylist } from "@/types/download"

export function generateSampleDownloads(): Download[] {
  return [
    {
      id: "1",
      url: "https://example.com/video1.mp4",
      name: "How to Build a React App",
      progress: 75,
      size: 1.2 * 1024 * 1024 * 1024, // 1.2 GB
      status: "downloading",
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      source: "youtube",
      type: "video",
      speed: 3.2,
      icon: "video",
      category: "video",
      thumbnail: "/placeholder.svg?height=120&width=200",
      duration: 1845, // 30:45
      metadata: {
        author: "TechTutorials",
        resolution: "1080p",
      },
    },
    {
      id: "2",
      url: "https://example.com/playlist1",
      name: "JavaScript Fundamentals Course",
      progress: 45,
      size: 3.5 * 1024 * 1024 * 1024, // 3.5 GB
      status: "downloading",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      source: "youtube-playlist",
      type: "playlist",
      speed: 2.8,
      icon: "video",
      category: "video",
      thumbnail: "/placeholder.svg?height=120&width=200",
      metadata: {
        playlistId: "playlist123",
        playlistTitle: "JavaScript Fundamentals",
        videoCount: 24,
        completedVideos: 11,
      },
    },
    {
      id: "3",
      url: "https://example.com/book1.pdf",
      name: "Clean Code: A Handbook of Agile Software Craftsmanship",
      progress: 100,
      size: 12.5 * 1024 * 1024, // 12.5 MB
      status: "completed",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
      source: "book",
      type: "book",
      speed: 0,
      icon: "file-text",
      category: "document",
      thumbnail: "/placeholder.svg?height=120&width=200",
      metadata: {
        author: "Robert C. Martin",
        pageCount: 464,
        publisher: "Prentice Hall",
      },
    },
    {
      id: "4",
      url: "https://example.com/tiktok1",
      name: "Viral TikTok Dance Tutorial",
      progress: 100,
      size: 45 * 1024 * 1024, // 45 MB
      status: "completed",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      completedAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000), // 4.5 hours ago
      source: "tiktok",
      type: "video",
      speed: 0,
      icon: "video",
      category: "video",
      thumbnail: "/placeholder.svg?height=120&width=200",
      duration: 62, // 1:02
      metadata: {
        author: "@dancepro",
        views: "2.4M",
      },
    },
    {
      id: "5",
      url: "https://example.com/app1.dmg",
      name: "Photoshop 2023",
      progress: 35,
      size: 2.8 * 1024 * 1024 * 1024, // 2.8 GB
      status: "paused",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      source: "app",
      type: "application",
      speed: 0,
      icon: "app",
      category: "application",
      metadata: {
        version: "24.5.0",
        developer: "Adobe Inc.",
        platform: "macOS",
      },
    },
    {
      id: "6",
      url: "https://example.com/movie1.mp4",
      name: "Nature Documentary: Oceans",
      progress: 90,
      size: 4.2 * 1024 * 1024 * 1024, // 4.2 GB
      status: "downloading",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      source: "moviebox",
      type: "video",
      speed: 5.1,
      icon: "video",
      category: "video",
      thumbnail: "/placeholder.svg?height=120&width=200",
      duration: 5820, // 1:37:00
      metadata: {
        director: "David Attenborough",
        resolution: "4K",
        year: 2023,
      },
    },
    {
      id: "7",
      url: "https://example.com/ebook1.epub",
      name: "The Pragmatic Programmer",
      progress: 100,
      size: 8.7 * 1024 * 1024, // 8.7 MB
      status: "completed",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      completedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), // 1.5 days ago
      source: "book",
      type: "book",
      speed: 0,
      icon: "file-text",
      category: "document",
      thumbnail: "/placeholder.svg?height=120&width=200",
      metadata: {
        author: "Andrew Hunt, David Thomas",
        pageCount: 352,
        publisher: "Addison-Wesley",
      },
    },
    {
      id: "8",
      url: "https://example.com/software1.exe",
      name: "Visual Studio Code",
      progress: 100,
      size: 85 * 1024 * 1024, // 85 MB
      status: "completed",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      completedAt: new Date(Date.now() - 11.8 * 60 * 60 * 1000), // 11.8 hours ago
      source: "app",
      type: "application",
      speed: 0,
      icon: "app",
      category: "application",
      metadata: {
        version: "1.80.1",
        developer: "Microsoft",
        platform: "Windows",
      },
    },
  ]
}

export function generateSampleYouTubePlaylist(): YouTubePlaylist {
  return {
    id: "playlist123",
    title: "JavaScript Fundamentals Course",
    channelName: "TechTutorials",
    thumbnail: "/placeholder.svg?height=120&width=200",
    videoCount: 24,
    videos: [
      {
        id: "video1",
        title: "Introduction to JavaScript",
        thumbnail: "/placeholder.svg?height=120&width=200",
        duration: 1245, // 20:45
        views: "245K",
        size: 350 * 1024 * 1024, // 350 MB
        quality: "1080p",
      },
      {
        id: "video2",
        title: "Variables and Data Types",
        thumbnail: "/placeholder.svg?height=120&width=200",
        duration: 1532, // 25:32
        views: "198K",
        size: 420 * 1024 * 1024, // 420 MB
        quality: "1080p",
      },
      {
        id: "video3",
        title: "Functions and Scope",
        thumbnail: "/placeholder.svg?height=120&width=200",
        duration: 1845, // 30:45
        views: "176K",
        size: 480 * 1024 * 1024, // 480 MB
        quality: "1080p",
      },
      {
        id: "video4",
        title: "Arrays and Objects",
        thumbnail: "/placeholder.svg?height=120&width=200",
        duration: 2132, // 35:32
        views: "152K",
        size: 520 * 1024 * 1024, // 520 MB
        quality: "1080p",
      },
      {
        id: "video5",
        title: "DOM Manipulation",
        thumbnail: "/placeholder.svg?height=120&width=200",
        duration: 1923, // 32:03
        views: "143K",
        size: 490 * 1024 * 1024, // 490 MB
        quality: "1080p",
      },
    ],
  }
}

export function generateSampleMessages() {
  return [
    {
      id: "1",
      content: "Hello! I can help you download files, videos, music, and more. What would you like to download today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: "2",
      content: "I want to download a YouTube video about React hooks",
      sender: "user",
      timestamp: new Date(Date.now() - 4 * 60 * 1000), // 4 minutes ago
    },
    {
      id: "3",
      content:
        "I've found several videos about React hooks. Would you like me to download 'React Hooks Explained' by CodeWithMosh?",
      sender: "ai",
      timestamp: new Date(Date.now() - 3.5 * 60 * 1000), // 3.5 minutes ago
    },
    {
      id: "4",
      content: "Yes, please download that one in high quality",
      sender: "user",
      timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    },
    {
      id: "5",
      content:
        "I've started downloading 'React Hooks Explained' in 1080p quality. You can track the progress in the downloads panel.",
      sender: "ai",
      timestamp: new Date(Date.now() - 2.5 * 60 * 1000), // 2.5 minutes ago
    },
  ]
}
