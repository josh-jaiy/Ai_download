import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

export async function seedDatabase() {
  try {
    // Check if database is already seeded
    const userCount = await prisma.user.count()
    if (userCount > 0) {
      console.log("Database already seeded")
      return { success: true, message: "Database already seeded" }
    }

    // Create demo user
    const hashedPassword = await hash("password123", 10)
    const user = await prisma.user.create({
      data: {
        name: "Demo User",
        email: "demo@example.com",
        password: hashedPassword,
        emailVerified: new Date(),
      },
    })

    // Create user settings
    await prisma.settings.create({
      data: {
        userId: user.id,
        maxThreadsPerDownload: 4,
        downloadPath: "~/Downloads",
        theme: "system",
        maxConcurrent: 3,
        autoStartDownloads: true,
        notifyOnComplete: true,
        defaultQuality: "high",
      },
    })

    // Create sample downloads
    const downloads = [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        name: "Never Gonna Give You Up",
        size: 45000000,
        progress: 100,
        status: "completed",
        source: "youtube",
        type: "video",
        speed: 0,
        completedAt: new Date(),
        userId: user.id,
        metadata: {
          duration: 213,
          resolution: "1080p",
          format: "mp4",
          author: "Rick Astley",
        },
      },
      {
        url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
        name: "Gangnam Style",
        size: 65000000,
        progress: 45,
        status: "downloading",
        source: "youtube",
        type: "video",
        speed: 1500000,
        userId: user.id,
        metadata: {
          duration: 252,
          resolution: "720p",
          format: "mp4",
          author: "PSY",
        },
      },
      {
        url: "https://example.com/sample.pdf",
        name: "AI Research Paper.pdf",
        size: 15000000,
        progress: 0,
        status: "queued",
        source: "other",
        type: "document",
        speed: 0,
        userId: user.id,
      },
      {
        url: "https://example.com/app.zip",
        name: "Productivity App.zip",
        size: 250000000,
        progress: 75,
        status: "paused",
        source: "app",
        type: "application",
        speed: 0,
        userId: user.id,
      },
      {
        url: "https://example.com/book.epub",
        name: "Machine Learning Fundamentals.epub",
        size: 8500000,
        progress: 100,
        status: "completed",
        source: "book",
        type: "book",
        speed: 0,
        completedAt: new Date(Date.now() - 86400000), // 1 day ago
        userId: user.id,
      },
    ]

    for (const download of downloads) {
      const createdDownload = await prisma.download.create({
        data: download,
      })

      // Create download threads for in-progress downloads
      if (download.status === "downloading" || download.status === "paused") {
        const chunkSize = Math.floor(download.size / 4)
        for (let i = 0; i < 4; i++) {
          await prisma.downloadThread.create({
            data: {
              downloadId: createdDownload.id,
              startByte: i * chunkSize,
              endByte: i === 3 ? download.size : (i + 1) * chunkSize - 1,
              progress: download.progress,
              speed: i === 3 ? 0 : Math.floor(download.speed / 3),
              status: download.status === "paused" ? "paused" : "active",
            },
          })
        }
      }
    }

    // Create sample conversation
    const conversation = await prisma.conversation.create({
      data: {
        title: "Download Recommendations",
        userId: user.id,
      },
    })

    // Create sample messages
    await prisma.message.createMany({
      data: [
        {
          content: "Can you recommend some educational videos to download?",
          role: "user",
          conversationId: conversation.id,
        },
        {
          content:
            "I'd recommend checking out Khan Academy's series on machine learning, MIT OpenCourseWare's computer science lectures, and TED Talks on emerging technologies. Would you like me to find specific links for any of these?",
          role: "assistant",
          conversationId: conversation.id,
        },
        {
          content: "Yes, please find me some good MIT OpenCourseWare videos on AI.",
          role: "user",
          conversationId: conversation.id,
        },
        {
          content:
            "Here are some excellent MIT OpenCourseWare videos on AI:\n\n1. Introduction to Artificial Intelligence - https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-034-artificial-intelligence-fall-2010/lecture-videos/\n\n2. Deep Learning - https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-s191-introduction-to-deep-learning-january-iap-2020/lecture-videos/\n\n3. Machine Learning - https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-867-machine-learning-fall-2006/\n\nWould you like me to add any of these to your download queue?",
          role: "assistant",
          conversationId: conversation.id,
        },
      ],
    })

    console.log("Database seeded successfully")
    return { success: true, message: "Database seeded successfully" }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, message: "Error seeding database", error }
  } finally {
    await prisma.$disconnect()
  }
}
