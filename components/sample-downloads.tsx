import { v4 as uuidv4 } from "uuid"
import type { Download } from "@/types/download"

// Function to generate sample downloads for demonstration
export function getSampleDownloads(): Download[] {
  const now = new Date()

  return [
    {
      id: uuidv4(),
      name: "How to Build a React App - Tutorial.mp4",
      type: "video",
      size: 1.2 * 1024 * 1024 * 1024, // 1.2 GB
      url: "https://youtube.com/watch?v=sample1",
      progress: 65,
      status: "downloading",
      createdAt: new Date(now.getTime() - 15 * 60000), // 15 minutes ago
      category: "video",
      icon: "video",
      source: "youtube",
      metadata: {
        duration: 3600, // 1 hour
      },
    },
    {
      id: uuidv4(),
      name: "JavaScript Basics - Part 1.mp4",
      type: "video",
      size: 450 * 1024 * 1024, // 450 MB
      url: "https://youtube.com/watch?v=sample2",
      progress: 30,
      status: "downloading",
      createdAt: new Date(now.getTime() - 25 * 60000), // 25 minutes ago
      category: "video",
      icon: "video",
      source: "youtube",
      metadata: {
        duration: 1800, // 30 minutes
        playlistId: "js-playlist",
        playlistTitle: "JavaScript Fundamentals",
        currentVideo: 1,
        totalVideos: 12,
      },
    },
    {
      id: uuidv4(),
      name: "JavaScript Basics - Part 2.mp4",
      type: "video",
      size: 480 * 1024 * 1024, // 480 MB
      url: "https://youtube.com/watch?v=sample3",
      progress: 10,
      status: "queued",
      createdAt: new Date(now.getTime() - 25 * 60000), // 25 minutes ago
      category: "video",
      icon: "video",
      source: "youtube",
      metadata: {
        duration: 1920, // 32 minutes
        playlistId: "js-playlist",
        playlistTitle: "JavaScript Fundamentals",
        currentVideo: 2,
        totalVideos: 12,
      },
    },
    {
      id: uuidv4(),
      name: "Clean Architecture - A Craftsman's Guide.pdf",
      type: "pdf",
      size: 15.4 * 1024 * 1024, // 15.4 MB
      url: "https://example.com/books/clean-architecture.pdf",
      progress: 100,
      status: "completed",
      createdAt: new Date(now.getTime() - 45 * 60000), // 45 minutes ago
      category: "book",
      icon: "file-text",
      source: "pdf",
      metadata: {
        author: "Robert C. Martin",
        pageCount: 432,
      },
    },
    {
      id: uuidv4(),
      name: "The Pragmatic Programmer.epub",
      type: "book",
      size: 8.7 * 1024 * 1024, // 8.7 MB
      url: "https://example.com/books/pragmatic-programmer.epub",
      progress: 100,
      status: "completed",
      createdAt: new Date(now.getTime() - 120 * 60000), // 2 hours ago
      category: "book",
      icon: "file-text",
      source: "books",
      metadata: {
        author: "Andrew Hunt & David Thomas",
        pageCount: 352,
      },
    },
    {
      id: uuidv4(),
      name: "Latest Dance Challenge.mp4",
      type: "video",
      size: 45 * 1024 * 1024, // 45 MB
      url: "https://tiktok.com/@user/video/sample2",
      progress: 100,
      status: "completed",
      createdAt: new Date(now.getTime() - 180 * 60000), // 3 hours ago
      category: "video",
      icon: "video",
      source: "tiktok",
    },
    {
      id: uuidv4(),
      name: "Inception (2010) - HD.mp4",
      type: "video",
      size: 3.7 * 1024 * 1024 * 1024, // 3.7 GB
      url: "https://moviebox.com/movies/sample3",
      progress: 35,
      status: "paused",
      createdAt: new Date(now.getTime() - 240 * 60000), // 4 hours ago
      category: "video",
      icon: "video",
      source: "moviebox",
    },
    {
      id: uuidv4(),
      name: "PhotoEditor Pro 2023.dmg",
      type: "application",
      size: 324 * 1024 * 1024, // 324 MB
      url: "https://apps.com/download/sample4",
      progress: 100,
      status: "completed",
      createdAt: new Date(now.getTime() - 300 * 60000), // 5 hours ago
      category: "application",
      icon: "package",
      source: "apps",
    },
  ]
}
