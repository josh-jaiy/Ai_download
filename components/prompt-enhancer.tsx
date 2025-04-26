"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lightbulb, Check, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface PromptEnhancerProps {
  originalPrompt: string
  onApplyEnhancement: (enhancedPrompt: string) => void
  onDismiss: () => void
  className?: string
}

export function PromptEnhancer({ originalPrompt, onApplyEnhancement, onDismiss, className }: PromptEnhancerProps) {
  const [selectedEnhancement, setSelectedEnhancement] = useState<string | null>(null)

  // Generate enhancement suggestions based on the original prompt
  const enhancementSuggestions = generateEnhancements(originalPrompt)

  return (
    <Card className={cn("p-4 bg-slate-900 border-emerald-600/30 shadow-lg", className)}>
      <div className="flex items-center gap-2 mb-3 text-emerald-400">
        <Sparkles size={18} />
        <h3 className="font-medium">Prompt Enhancer</h3>
      </div>

      <p className="text-sm text-slate-400 mb-3">Enhance your download request with these suggestions:</p>

      <div className="space-y-2 mb-4">
        {enhancementSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className={cn(
              "p-2 rounded-md cursor-pointer flex items-start gap-2 transition-colors",
              selectedEnhancement === suggestion.enhanced
                ? "bg-emerald-900/40 border border-emerald-600/50"
                : "bg-slate-800/50 hover:bg-slate-800 border border-transparent",
            )}
            onClick={() => setSelectedEnhancement(suggestion.enhanced)}
          >
            <Lightbulb size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-300">{suggestion.enhanced}</p>
              <p className="text-xs text-slate-400 mt-1">{suggestion.reason}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={onDismiss} className="text-slate-400 hover:text-slate-300">
          <X size={16} className="mr-1" /> Dismiss
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={() => selectedEnhancement && onApplyEnhancement(selectedEnhancement)}
          disabled={!selectedEnhancement}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Check size={16} className="mr-1" /> Apply
        </Button>
      </div>
    </Card>
  )
}

// Helper function to generate enhancement suggestions
function generateEnhancements(prompt: string): { enhanced: string; reason: string }[] {
  const lowercasePrompt = prompt.toLowerCase()
  const suggestions: { enhanced: string; reason: string }[] = []

  // Add specific format suggestion
  if (!lowercasePrompt.includes("format") && !lowercasePrompt.includes("quality")) {
    suggestions.push({
      enhanced: `${prompt} in high quality MP4 format`,
      reason: "Specifying format and quality ensures optimal download settings",
    })
  }

  // Add subtitle suggestion for video content
  if (
    (lowercasePrompt.includes("video") || lowercasePrompt.includes("youtube") || lowercasePrompt.includes("movie")) &&
    !lowercasePrompt.includes("subtitle")
  ) {
    suggestions.push({
      enhanced: `${prompt} with English subtitles`,
      reason: "Adding subtitle preference improves accessibility",
    })
  }

  // Add resolution suggestion
  if (
    (lowercasePrompt.includes("video") || lowercasePrompt.includes("youtube")) &&
    !lowercasePrompt.includes("1080p") &&
    !lowercasePrompt.includes("720p") &&
    !lowercasePrompt.includes("4k")
  ) {
    suggestions.push({
      enhanced: `${prompt} in 1080p resolution`,
      reason: "Specifying resolution ensures desired video quality",
    })
  }

  // Add audio quality suggestion
  if (
    (lowercasePrompt.includes("audio") || lowercasePrompt.includes("music") || lowercasePrompt.includes("song")) &&
    !lowercasePrompt.includes("kbps") &&
    !lowercasePrompt.includes("mp3") &&
    !lowercasePrompt.includes("flac")
  ) {
    suggestions.push({
      enhanced: `${prompt} in high quality 320kbps MP3`,
      reason: "Specifying audio quality ensures better listening experience",
    })
  }

  // Add destination suggestion
  if (!lowercasePrompt.includes("save") && !lowercasePrompt.includes("download to")) {
    suggestions.push({
      enhanced: `${prompt} and save to Downloads folder`,
      reason: "Specifying destination folder organizes your downloads",
    })
  }

  // If no specific suggestions, add a generic one
  if (suggestions.length === 0) {
    suggestions.push({
      enhanced: `Download ${prompt} with highest quality and fastest speed`,
      reason: "Optimizing for quality and speed improves download experience",
    })
  }

  return suggestions
}
