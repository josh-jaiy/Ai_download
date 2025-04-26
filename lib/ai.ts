import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Message } from "@/types/chat"
import type { Download, DownloadSource } from "@/types/download"

// Types for AI processing
export interface AIDownloadRequest {
  url: string
  name: string
  source: DownloadSource
  type: string
  fileSize?: number
  description?: string
}

export interface AIResponse {
  isDownloadRequest: boolean
  downloadInfo?: AIDownloadRequest
  response: string
  suggestedActions?: string[]
}

/**
 * Process a user message and determine if it's a download request
 * @param message The user's message
 * @returns AI response with download information if applicable
 */
export async function processUserMessage(message: string): Promise<AIResponse> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        You are an AI assistant for a download manager application. 
        Analyze the following user request and extract download information.
        If this is a download request, extract the URL, name, source type, and file type.
        If no specific URL is provided but it's a request to download something, provide a best guess URL.
        
        User request: "${message}"
        
        Respond in JSON format:
        {
          "isDownloadRequest": true/false,
          "downloadInfo": {
            "url": "extracted or guessed URL",
            "name": "suggested name for the download",
            "source": "youtube, tiktok, moviebox, book, app, or other",
            "type": "video, audio, document, application, image, archive, or other",
            "fileSize": optional estimated file size in bytes,
            "description": optional brief description
          },
          "response": "AI response to the user",
          "suggestedActions": ["action1", "action2"] // Optional suggested next actions
        }
      `,
    })

    // Parse the AI response
    const aiResponse = JSON.parse(text) as AIResponse
    return aiResponse
  } catch (error) {
    console.error("Error processing user message:", error)
    return {
      isDownloadRequest: false,
      response: "I'm sorry, I couldn't process your request. Please try again.",
    }
  }
}

/**
 * Stream an AI response to the user
 * @param message The user's message
 * @param history Previous conversation history
 * @param onChunk Callback for each chunk of the response
 * @returns The complete response text
 */
export async function streamAIResponse(
  message: string,
  history: Message[] = [],
  onChunk: (chunk: string) => void,
): Promise<string> {
  try {
    // Format history for the AI
    const formattedHistory = history
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n")

    const result = streamText({
      model: openai("gpt-4o"),
      system: `
        You are an AI assistant for a download manager application called "AI Downloader".
        Your primary purpose is to help users download various types of content including videos, 
        music, documents, applications, and more.
        
        When users ask to download something:
        1. Acknowledge their request
        2. Provide information about what you're going to download
        3. Mention any relevant features like download acceleration, encryption, or cloud storage
        
        If users ask questions about the application, provide helpful information about its features.
        Keep responses concise and focused on helping with downloads.
      `,
      prompt: `
        ${formattedHistory ? `Previous conversation:\n${formattedHistory}\n\n` : ""}
        User: ${message}
        Assistant:
      `,
      onChunk: ({ chunk }) => {
        if (chunk.type === "text-delta") {
          onChunk(chunk.text)
        }
      },
    })

    return await result.text
  } catch (error) {
    console.error("Error streaming AI response:", error)
    onChunk("I'm sorry, I encountered an error while processing your request.")
    return "I'm sorry, I encountered an error while processing your request."
  }
}

/**
 * Enhance a user prompt to make it more specific and effective
 * @param prompt The original user prompt
 * @returns Enhanced prompt
 */
export async function enhancePrompt(prompt: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        You are an AI assistant for a download manager application.
        Enhance the following user prompt to make it more specific and effective for downloading content.
        Add relevant details that might be missing, but maintain the user's original intent.
        
        Original prompt: "${prompt}"
        
        Enhanced prompt:
      `,
    })

    return text.trim()
  } catch (error) {
    console.error("Error enhancing prompt:", error)
    return prompt // Return original prompt if enhancement fails
  }
}

/**
 * Generate download suggestions based on user interests or history
 * @param interests User interests or previous downloads
 * @param count Number of suggestions to generate
 * @returns Array of download suggestions
 */
export async function generateDownloadSuggestions(interests: string[] = [], count = 3): Promise<AIDownloadRequest[]> {
  try {
    const interestsText = interests.length > 0 ? interests.join(", ") : "general content"

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Generate ${count} download suggestions based on the following interests: ${interestsText}.
        For each suggestion, provide a name, URL, source type, and file type.
        
        Respond in JSON format as an array of objects:
        [
          {
            "url": "suggested URL",
            "name": "name for the download",
            "source": "youtube, tiktok, moviebox, book, app, or other",
            "type": "video, audio, document, application, image, archive, or other",
            "description": "brief description"
          }
        ]
      `,
    })

    // Parse the AI response
    const suggestions = JSON.parse(text) as AIDownloadRequest[]
    return suggestions
  } catch (error) {
    console.error("Error generating download suggestions:", error)
    return []
  }
}

/**
 * Analyze a download to provide additional information
 * @param download The download to analyze
 * @returns Enhanced download information
 */
export async function analyzeDownload(download: Download): Promise<{
  categories: string[]
  tags: string[]
  description: string
  relatedContent: string[]
}> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze the following download and provide additional information:
        
        Download name: ${download.name}
        Source: ${download.source}
        Type: ${download.type}
        URL: ${download.url}
        
        Respond in JSON format:
        {
          "categories": ["category1", "category2"],
          "tags": ["tag1", "tag2", "tag3"],
          "description": "detailed description of the content",
          "relatedContent": ["related item 1", "related item 2"]
        }
      `,
    })

    // Parse the AI response
    return JSON.parse(text)
  } catch (error) {
    console.error("Error analyzing download:", error)
    return {
      categories: [],
      tags: [],
      description: "No description available",
      relatedContent: [],
    }
  }
}

/**
 * Extract information from a URL to determine download details
 * @param url The URL to analyze
 * @returns Download information
 */
export async function extractInfoFromUrl(url: string): Promise<AIDownloadRequest | null> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze the following URL and extract information for downloading:
        
        URL: ${url}
        
        Determine the source platform (YouTube, TikTok, etc.), content type, and suggest a name.
        
        Respond in JSON format:
        {
          "url": "${url}",
          "name": "suggested name for the download",
          "source": "youtube, tiktok, moviebox, book, app, or other",
          "type": "video, audio, document, application, image, archive, or other",
          "description": "brief description of what this content appears to be"
        }
      `,
    })

    // Parse the AI response
    return JSON.parse(text) as AIDownloadRequest
  } catch (error) {
    console.error("Error extracting info from URL:", error)
    return null
  }
}
