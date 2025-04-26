import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "@/types/chat"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={cn("flex items-start gap-3 max-w-[85%]", message.role === "user" ? "ml-auto" : "")}>
      {message.role === "assistant" && (
        <Avatar className="h-8 w-8 border border-slate-700">
          <AvatarFallback className="bg-emerald-900 text-emerald-200">AI</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "rounded-lg p-3",
          message.role === "user"
            ? message.enhanced
              ? "bg-emerald-900/30 border border-emerald-700/50 text-slate-200"
              : "bg-slate-800 text-slate-200"
            : "bg-slate-900 border border-slate-800 text-slate-200",
        )}
      >
        {message.enhanced && (
          <div className="flex items-center gap-1 mb-1 text-xs text-emerald-400">
            <Sparkles size={12} />
            <span>Enhanced prompt</span>
          </div>
        )}
        <p className="text-sm">{message.content}</p>
        <span className="text-xs text-slate-500 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {message.role === "user" && (
        <Avatar className="h-8 w-8 border border-slate-700">
          <AvatarFallback className="bg-slate-700 text-slate-200">
            <User size={16} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
