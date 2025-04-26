"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Lock, Key, RefreshCw, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EncryptionSettingsProps {
  onToggleEncryption: (enabled: boolean) => void
  onKeyChange: (key: string) => void
  className?: string
}

export function EncryptionSettings({ onToggleEncryption, onKeyChange, className }: EncryptionSettingsProps) {
  const [encryptionEnabled, setEncryptionEnabled] = useState(false)
  const [encryptionMethod, setEncryptionMethod] = useState<"password" | "key">("password")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [encryptionKey, setEncryptionKey] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleEncryptionToggle = (checked: boolean) => {
    setEncryptionEnabled(checked)
    onToggleEncryption(checked)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (encryptionMethod === "password") {
      onKeyChange(e.target.value)
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEncryptionKey(e.target.value)
    if (encryptionMethod === "key") {
      onKeyChange(e.target.value)
    }
  }

  const generateRandomKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
    let key = ""
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setEncryptionKey(key)
    if (encryptionMethod === "key") {
      onKeyChange(key)
    }
  }

  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText(encryptionKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const passwordsMatch = password === confirmPassword
  const passwordValid = password.length >= 8
  const keyValid = encryptionKey.length >= 16

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-medium">End-to-End Encryption</h3>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="encryption" checked={encryptionEnabled} onCheckedChange={handleEncryptionToggle} />
          <Label htmlFor="encryption" className="text-sm">
            {encryptionEnabled ? "Enabled" : "Disabled"}
          </Label>
        </div>
      </div>

      {encryptionEnabled && (
        <div className="space-y-4">
          <Alert className="border-emerald-900/50 bg-emerald-950/30">
            <AlertDescription className="text-sm text-emerald-300">
              Files will be encrypted before downloading and decrypted when accessed. This ensures your data remains
              private and secure.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="password" onValueChange={(v) => setEncryptionMethod(v as "password" | "key")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="key">Encryption Key</TabsTrigger>
            </TabsList>
            <TabsContent value="password" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">
                  Encryption Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a strong password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="border-zinc-700 bg-zinc-800 pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-zinc-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {password && !passwordValid && (
                  <p className="text-xs text-red-500">Password must be at least 8 characters long</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="border-zinc-700 bg-zinc-800"
                />
                {confirmPassword && !passwordsMatch && <p className="text-xs text-red-500">Passwords do not match</p>}
              </div>
            </TabsContent>
            <TabsContent value="key" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="encryption-key" className="text-sm">
                    Encryption Key
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border-zinc-700 bg-zinc-800 text-xs hover:bg-zinc-700"
                    onClick={generateRandomKey}
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Generate
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="encryption-key"
                    type={showKey ? "text" : "password"}
                    placeholder="Enter or generate an encryption key"
                    value={encryptionKey}
                    onChange={handleKeyChange}
                    className="border-zinc-700 bg-zinc-800 pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-zinc-400"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {encryptionKey && !keyValid && (
                  <p className="text-xs text-red-500">Encryption key must be at least 16 characters long</p>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                onClick={copyKeyToClipboard}
                disabled={!keyValid}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>

              <Alert className="border-amber-900/50 bg-amber-950/30">
                <AlertDescription className="flex items-start gap-2 text-sm text-amber-300">
                  <Key className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>
                    Store this key in a secure location. If you lose it, you won't be able to decrypt your files.
                  </span>
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
