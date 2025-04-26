"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Lock, Key, RefreshCw, Copy, Check, Shield, Settings } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function EncryptionManager() {
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)
  const [encryptionMethod, setEncryptionMethod] = useState<"password" | "key">("password")
  const [password, setPassword] = useState("••••••••••••")
  const [confirmPassword, setConfirmPassword] = useState("••••••••••••")
  const [encryptionKey, setEncryptionKey] = useState("a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6")
  const [showPassword, setShowPassword] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [autoEncrypt, setAutoEncrypt] = useState(true)

  const generateRandomKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
    let key = ""
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setEncryptionKey(key)
  }

  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText(encryptionKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-500" />
            <CardTitle>Encryption Manager</CardTitle>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Secure your downloads with end-to-end encryption</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="encryption" className="text-sm">
              End-to-end encryption
            </Label>
          </div>
          <Switch id="encryption" checked={encryptionEnabled} onCheckedChange={setEncryptionEnabled} />
        </div>

        {encryptionEnabled && (
          <>
            <Alert className="border-emerald-900/50 bg-emerald-950/20">
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-slate-700 bg-slate-800 pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-slate-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-slate-700 bg-slate-800"
                  />
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
                      className="h-7 border-slate-700 bg-slate-800 text-xs hover:bg-slate-700"
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
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                      className="border-slate-700 bg-slate-800 pr-10 font-mono text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-slate-400"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-700 bg-slate-800 hover:bg-slate-700"
                  onClick={copyKeyToClipboard}
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

                <Alert className="border-amber-900/50 bg-amber-950/20">
                  <AlertDescription className="flex items-start gap-2 text-sm text-amber-300">
                    <Key className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      Store this key in a secure location. If you lose it, you won't be able to decrypt your files.
                    </span>
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>

            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-medium">Encryption Settings</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-encrypt" className="text-sm">
                    Automatically encrypt sensitive files
                  </Label>
                  <Switch id="auto-encrypt" checked={autoEncrypt} onCheckedChange={setAutoEncrypt} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="encrypt-cloud" className="text-sm">
                    Encrypt files before cloud upload
                  </Label>
                  <Switch id="encrypt-cloud" defaultChecked />
                </div>
              </div>
            </div>

            <div className="rounded-md border border-slate-800 bg-slate-900/50 p-3">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">Encryption Status</span>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Algorithm:</span>
                  <span>AES-256-GCM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Protected files:</span>
                  <span>12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last encrypted:</span>
                  <span>Today, 2:45 PM</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
