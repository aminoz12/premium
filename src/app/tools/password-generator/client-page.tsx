"use client"

import React, { useState, useCallback, useId, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import {
  Copy, RefreshCw, Shield, ShieldAlert, ShieldCheck,
  Check, CheckCircle2, Zap, Lock, HelpCircle, Link2, KeyRound
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function PasswordGeneratorPage({ embedMode = false }: { embedMode?: boolean }) {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)

  const { copy } = useClipboard()
  const [isCopied, setIsCopied] = useState(false)
  const id = useId()

  const generatePassword = useCallback(() => {
    let chars = ""
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) chars += "0123456789"
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (chars.length === 0) {
      setPassword("Select at least one option")
      return
    }

    let result = ""
    const array = new Uint32Array(length)
    window.crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    setPassword(result)
    setIsCopied(false)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generatePassword()
  }, [generatePassword])

  const handleCopy = async () => {
    if (!password || password === "Select at least one option") return
    await copy(password)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const getPasswordStrength = () => {
    let score = 0
    if (length >= 8) score++
    if (length >= 12) score++
    if (length >= 16) score++
    if (includeUppercase) score++
    if (includeLowercase) score++
    if (includeNumbers) score++
    if (includeSymbols) score++

    const progress = Math.min((score / 7) * 100, 100)

    if (score <= 3) return { strength: "Weak", color: "text-red-500", barColor: "bg-red-500", icon: ShieldAlert, progress }
    if (score <= 5) return { strength: "Medium", color: "text-yellow-500", barColor: "bg-yellow-500", icon: Shield, progress }
    return { strength: "Strong", color: "text-green-500", barColor: "bg-green-500", icon: ShieldCheck, progress }
  }

  const { strength, color, barColor, icon: StrengthIcon, progress } = getPasswordStrength()

  const content = (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">

      {/* Header Section */}
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
          <KeyRound className="h-4 w-4" aria-hidden="true" /> Security Utility
        </div>
        <p className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
          Free Random Password Generator
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Instantly create strong, cryptographically secure passwords to protect your online accounts. Processed 100% locally in your browser for total privacy.
        </p>
      </header>

      {/* Interactive Tool Section */}
      <section aria-label="Password Generator Tool" className="grid gap-6 lg:grid-cols-2 items-start">

        {/* Result Panel */}
        <ToolCard title="1. Generated Password" className="lg:sticky lg:top-6">
          <div className="space-y-8 flex flex-col justify-center py-4">
            <div className="relative group">
              <Label htmlFor={`${id}-password`} className="sr-only">Your Secure Password</Label>
              <Input
                id={`${id}-password`}
                type="text"
                value={password}
                readOnly
                className={`pr-24 font-mono text-xl sm:text-2xl h-16 sm:h-20 text-center tracking-wider bg-muted/30 border-2 focus-visible:ring-1 ${strength === "Strong" ? "border-green-500/50" :
                    strength === "Medium" ? "border-yellow-500/50" : "border-red-500/50"
                  }`}
                aria-label="Generated password output"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={generatePassword}
                  className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
                  aria-label="Regenerate password"
                  title="Generate New Password"
                >
                  <RefreshCw className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button
                  size="icon"
                  variant={isCopied ? "default" : "secondary"}
                  onClick={handleCopy}
                  className={`h-10 w-10 transition-all ${isCopied ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                  aria-label="Copy password to clipboard"
                  title="Copy Password"
                >
                  {isCopied ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
                </Button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            <div className="space-y-3 p-5 rounded-xl border bg-card shadow-sm">
              <div className="flex items-center justify-between">
                <div className={cn("flex items-center gap-2", color)}>
                  <StrengthIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="font-bold text-lg">{strength} Password</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {length} Chars
                </span>
              </div>

              <div className="h-2 w-full bg-muted rounded-full overflow-hidden" aria-hidden="true">
                <div
                  className={cn("h-full transition-all duration-500 ease-out rounded-full", barColor)}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm text-muted-foreground pt-1 leading-relaxed">
                {strength === "Weak" && "Too short or missing character varieties. Easily crackable."}
                {strength === "Medium" && "Good for standard accounts, but could be longer or more complex."}
                {strength === "Strong" && "Excellent! Highly resistant to dictionary and brute-force attacks."}
              </p>
            </div>
          </div>
        </ToolCard>

        {/* Configuration Panel */}
        <ToolCard title="2. Customization Options">
          <div className="space-y-8">

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor={`${id}-length`} className="text-base font-semibold">Password Length</Label>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-md font-bold text-lg">
                  {length}
                </div>
              </div>
              <Slider
                id={`${id}-length`}
                value={[length]}
                onValueChange={([value]) => setLength(value)}
                min={4}
                max={64}
                step={1}
                className="py-4 cursor-pointer"
                aria-label="Adjust password length"
              />
              <div className="flex justify-between text-xs font-medium text-muted-foreground px-1">
                <span>4</span>
                <span>16</span>
                <span>32</span>
                <span>64</span>
              </div>
            </div>

            <div className="grid gap-4 bg-muted/20 p-5 rounded-xl border border-border/50">
              <div className="flex items-center justify-between group">
                <Label htmlFor={`${id}-uppercase`} className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors">
                  Uppercase Letters (A-Z)
                </Label>
                <Switch
                  id={`${id}-uppercase`}
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                  aria-label="Include uppercase letters"
                />
              </div>
              <div className="flex items-center justify-between group border-t pt-4">
                <Label htmlFor={`${id}-lowercase`} className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors">
                  Lowercase Letters (a-z)
                </Label>
                <Switch
                  id={`${id}-lowercase`}
                  checked={includeLowercase}
                  onCheckedChange={setIncludeLowercase}
                  aria-label="Include lowercase letters"
                />
              </div>
              <div className="flex items-center justify-between group border-t pt-4">
                <Label htmlFor={`${id}-numbers`} className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors">
                  Numbers (0-9)
                </Label>
                <Switch
                  id={`${id}-numbers`}
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                  aria-label="Include numbers"
                />
              </div>
              <div className="flex items-center justify-between group border-t pt-4">
                <Label htmlFor={`${id}-symbols`} className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors">
                  Symbols (!@#$%)
                </Label>
                <Switch
                  id={`${id}-symbols`}
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                  aria-label="Include symbols"
                />
              </div>
            </div>

            <Button
              className="w-full py-6 text-base gap-2 font-semibold shadow-sm"
              onClick={generatePassword}
              aria-label="Generate a new secure password based on selected options"
            >
              <RefreshCw className="h-5 w-5" aria-hidden="true" />
              Generate New Password
            </Button>

          </div>
        </ToolCard>
      </section>

    </div>
  )

  if (embedMode) {
    return content
  }

  return (
    <ToolLayout toolId="password-generator">
      {content}
    </ToolLayout>
  )
}
