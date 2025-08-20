"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Hash,
  Users,
  Settings,
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Smile,
  Home,
  Compass,
  Rss,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useChat } from "@/hooks/use-chat"
import { useChannels } from "@/hooks/use-channels"
import { CreateChannelModal } from "./create-channel-modal"
import { EmojiPicker } from "./emoji-picker"
import { NotificationsPanel } from "./notifications-panel"
import { cn } from "@/lib/utils"

interface SlideZoneProps {
  onNavigateToExplore: () => void
  onNavigateToSettings: () => void
  onNavigateToFeed: () => void
}

type MobileView = "channels" | "chat" | "users"

export function SlideZone({ onNavigateToExplore, onNavigateToSettings, onNavigateToFeed }: SlideZoneProps) {
  const { user, signOut } = useAuth()
  const { channels, activeChannel, setActiveChannel, createChannel, deleteChannel } = useChannels()
  const { messages, sendMessage, deleteMessage, clearMessages } = useChat(activeChannel?.id)

  const [newMessage, setNewMessage] = useState("")
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [mobileView, setMobileView] = useState<MobileView>("chat")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChannel) return

    try {
      await sendMessage(newMessage.trim())
      setNewMessage("")
      setShowEmojiPicker(false)
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
    inputRef.current?.focus()
  }

  const handleCreateChannel = async (name: string, description: string) => {
    try {
      await createChannel(name, description)
      setShowCreateChannel(false)
    } catch (error) {
      console.error("Failed to create channel:", error)
    }
  }

  const handleDeleteChannel = async (channelId: string) => {
    if (confirm("Are you sure you want to delete this channel?")) {
      try {
        await deleteChannel(channelId)
      } catch (error) {
        console.error("Failed to delete channel:", error)
      }
    }
  }

  const handleClearMessages = async () => {
    if (!activeChannel) return
    try {
      await clearMessages()
      setShowClearConfirm(false)
    } catch (error) {
      console.error("Failed to clear messages:", error)
    }
  }

  // Mobile Navigation Component
  const MobileNavigation = () => (
    <div className="md:hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden">
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Instasphere
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)}>
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs">
              {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-80 h-full bg-card border-r border-border/50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    setShowMobileMenu(false)
                    setMobileView("chat")
                  }}
                >
                  <Home className="h-5 w-5" />
                  Chat
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    setShowMobileMenu(false)
                    onNavigateToFeed()
                  }}
                >
                  <Rss className="h-5 w-5" />
                  Feed
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    setShowMobileMenu(false)
                    onNavigateToExplore()
                  }}
                >
                  <Compass className="h-5 w-5" />
                  Explore
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    setShowMobileMenu(false)
                    onNavigateToSettings()
                  }}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Button>
                <Separator />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => {
                    setShowMobileMenu(false)
                    signOut()
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Tab Navigation */}
      <div className="flex bg-card/80 backdrop-blur-sm border-b border-border/50">
        {[
          { id: "channels", label: "Channels", icon: Hash },
          { id: "chat", label: "Chat", icon: MessageSquare },
          { id: "users", label: "Users", icon: Users },
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant="ghost"
            className={cn(
              "flex-1 rounded-none py-4 gap-2",
              mobileView === id && "bg-primary/10 text-primary border-b-2 border-primary",
            )}
            onClick={() => setMobileView(id as MobileView)}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  )

  // Desktop Layout
  const DesktopLayout = () => (
    <div className="hidden md:flex h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-slate-900 dark:to-orange-950/20">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Instasphere
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setMobileView("chat")}>
                <Home className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button variant="ghost" size="sm" onClick={onNavigateToFeed}>
                <Rss className="h-4 w-4 mr-2" />
                Feed
              </Button>
              <Button variant="ghost" size="sm" onClick={onNavigateToExplore}>
                <Compass className="h-4 w-4 mr-2" />
                Explore
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search channels..." className="pl-10 w-64 bg-background/50" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)}>
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onNavigateToSettings}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="gap-2" onClick={signOut}>
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs">
                  {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Three Panel Layout */}
      <div className="flex w-full pt-20">
        {/* Channels Panel */}
        <div className="w-80 bg-card/50 backdrop-blur-sm border-r border-border/50 p-4">
          <ChannelsPanel />
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col">
          <ChatPanel />
        </div>

        {/* Users Panel */}
        <div className="w-64 bg-card/50 backdrop-blur-sm border-l border-border/50 p-4">
          <UsersPanel />
        </div>
      </div>
    </div>
  )

  // Channels Panel Component
  const ChannelsPanel = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Channels</h2>
        <Button variant="ghost" size="icon" onClick={() => setShowCreateChannel(true)} className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {channels.map((channel) => (
          <Card
            key={channel.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              activeChannel?.id === channel.id && "ring-2 ring-primary bg-primary/5",
            )}
            onClick={() => setActiveChannel(channel)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{channel.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteChannel(channel.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              {channel.description && <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>}
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {messages.length} messages
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(channel.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // Chat Panel Component
  const ChatPanel = () => (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">{activeChannel?.name || "Select a channel"}</h3>
              {activeChannel?.description && (
                <p className="text-sm text-muted-foreground">{activeChannel.description}</p>
              )}
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-muted-foreground">
              {activeChannel ? "Start the conversation!" : "Select a channel to begin chatting"}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 group"
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs">
                  {message.user?.user_metadata?.full_name?.[0] || message.user?.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {message.user?.user_metadata?.full_name || message.user?.email}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                  {message.user_id === user?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-sm break-words">{message.content}</p>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {activeChannel && (
        <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message #${activeChannel.name}`}
                className="pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {showEmojiPicker && (
            <div className="absolute bottom-20 right-4 z-50">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
            </div>
          )}
        </div>
      )}
    </div>
  )

  // Users Panel Component
  const UsersPanel = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Online Users</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs">
              {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.user_metadata?.full_name || user?.email} (You)</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Mobile Content based on current view
  const MobileContent = () => {
    switch (mobileView) {
      case "channels":
        return <ChannelsPanel />
      case "chat":
        return <ChatPanel />
      case "users":
        return <UsersPanel />
      default:
        return <ChatPanel />
    }
  }

  return (
    <>
      {/* Desktop Layout */}
      <DesktopLayout />

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-slate-900 dark:to-orange-950/20">
        <MobileNavigation />
        <div className="p-4">
          <MobileContent />
        </div>
      </div>

      {/* Modals */}
      <CreateChannelModal
        isOpen={showCreateChannel}
        onClose={() => setShowCreateChannel(false)}
        onCreateChannel={handleCreateChannel}
      />

      <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Clear Chat Confirmation */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Clear Chat History</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to clear all messages in this channel? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleClearMessages}>
                  Clear Messages
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Named export for the component
