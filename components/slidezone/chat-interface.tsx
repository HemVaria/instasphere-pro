"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  Smile,
  Hash,
  Plus,
  Search,
  MoreHorizontal,
  MessageCircle,
  Home,
  Bell,
  Compass,
  Send,
  Lock,
  Trash2,
  Users,
  Rss,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { useChat } from "@/hooks/use-chat"
import { useChannels } from "@/hooks/use-channels"
import { CreateChannelModal } from "./create-channel-modal"
import { cn } from "@/lib/utils"
import { EmojiPicker } from "./emoji-picker"
import { NotificationsPanel } from "./notifications-panel"
import { useNotifications } from "@/hooks/use-notifications"

interface Message {
  id: string
  content: string
  user_id: string
  user_name: string
  created_at: string
  avatar_url?: string
}

interface SlideZoneProps {
  onNavigateToExplore: () => void
  onNavigateToSettings: () => void
  onNavigateToFeed: () => void
}

export function SlideZone({ onNavigateToExplore, onNavigateToSettings, onNavigateToFeed }: SlideZoneProps) {
  const { user, signOut } = useAuth()
  const { messages, users, sendMessage, isConnected, deleteMessage, activeChannel, setActiveChannel } = useChat()
  const { channels, createChannel, deleteChannel, loading: channelsLoading } = useChannels()
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileView, setMobileView] = useState<"channels" | "chat" | "users">("chat")
  const [isMobile, setIsMobile] = useState(false)
  const [showClearChatModal, setShowClearChatModal] = useState(false)
  const { unreadCount } = useNotifications()

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Set active channel to first available channel when channels load
  useEffect(() => {
    if (!activeChannel && channels.length > 0) {
      setActiveChannel(channels[0].id)
    }
  }, [channels, activeChannel, setActiveChannel])

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
      await sendMessage(newMessage, activeChannel)
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const navigationItems = [
    { icon: Home, label: "Home", active: true },
    {
      icon: Bell,
      label: "Notifications",
      active: false,
      onClick: () => setShowNotifications(true),
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { icon: MessageCircle, label: "Messages", active: false },
    { icon: Rss, label: "Feed", active: false, onClick: onNavigateToFeed },
    { icon: Compass, label: "Explore", active: false, onClick: onNavigateToExplore },
  ]

  const activeChannelData = channels.find((ch) => ch.id === activeChannel) || {
    id: activeChannel,
    name: "loading...",
    description: "Loading channel...",
  }

  const handleDeleteChannel = async (channelId: string) => {
    if (confirm("Are you sure you want to delete this channel? All messages will be lost.")) {
      try {
        await deleteChannel(channelId)
        // If we deleted the active channel, switch to the first available channel
        if (activeChannel === channelId && channels.length > 1) {
          const remainingChannels = channels.filter((c) => c.id !== channelId)
          if (remainingChannels.length > 0) {
            setActiveChannel(remainingChannels[0].id)
          }
        }
      } catch (error: any) {
        alert(error.message || "Failed to delete channel")
      }
    }
  }

  const handleClearChatHistory = async () => {
    if (!activeChannel) return

    try {
      // Delete all messages in the current channel
      const messagesToDelete = messages.filter((msg) => msg.user_id === user?.id)

      for (const message of messagesToDelete) {
        await deleteMessage(message.id)
      }

      setShowClearChatModal(false)
      console.log("Chat history cleared successfully")
    } catch (error: any) {
      console.error("Failed to clear chat history:", error)
      alert("Failed to clear chat history. Please try again.")
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId)
    } catch (error: any) {
      alert(error.message || "Failed to delete message")
    }
  }

  if (channelsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Clear Chat History Modal
  const ClearChatModal = () => (
    <AnimatePresence>
      {showClearChatModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowClearChatModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl p-6 max-w-md w-full shadow-modern-lg border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Clear Chat History</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-foreground mb-6">
              Are you sure you want to delete all your messages in #{activeChannelData.name}? This will only delete
              messages you've sent.
            </p>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowClearChatModal(false)} className="border-border">
                Cancel
              </Button>
              <Button
                onClick={handleClearChatHistory}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Clear History
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Mobile Layout - Horizontal Tab Layout (Different from Discord's vertical)
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        {/* Mobile Tab Navigation - Horizontal at top */}
        <div className="flex border-b border-border bg-card/50 backdrop-blur-sm">
          <button
            onClick={() => setMobileView("channels")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 p-4 transition-all duration-200",
              mobileView === "channels"
                ? "bg-primary text-primary-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <Hash className="h-4 w-4" />
            <span className="text-sm font-medium">Channels</span>
          </button>
          <button
            onClick={() => setMobileView("chat")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 p-4 transition-all duration-200",
              mobileView === "chat"
                ? "bg-primary text-primary-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Chat</span>
          </button>
          <button
            onClick={() => setMobileView("users")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 p-4 transition-all duration-200",
              mobileView === "users"
                ? "bg-primary text-primary-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Users</span>
          </button>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Channels View */}
            {mobileView === "channels" && (
              <motion.div
                key="channels"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full bg-card p-4 overflow-y-auto"
              >
                {/* Navigation Grid Layout */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Navigation</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {navigationItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={item.onClick}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 border",
                          item.active
                            ? "bg-primary text-primary-foreground border-primary shadow-modern"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent border-border",
                        )}
                      >
                        <div className="relative">
                          <item.icon className="h-6 w-6" />
                          {item.badge && (
                            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {item.badge > 99 ? "99+" : item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search channels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary rounded-xl"
                  />
                </div>

                {/* Channels as Cards */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-foreground">Text Channels</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCreateChannel(true)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    {channels.map((channel) => (
                      <div
                        key={channel.id}
                        onClick={() => {
                          setActiveChannel(channel.id)
                          setMobileView("chat")
                        }}
                        className={cn(
                          "p-4 rounded-xl border cursor-pointer transition-all duration-200 group",
                          activeChannel === channel.id
                            ? "bg-accent border-primary shadow-modern"
                            : "border-border hover:border-primary/50 hover:bg-accent/50",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Hash className="h-5 w-5 text-muted-foreground" />
                          {channel.is_private && <Lock className="h-4 w-4 text-muted-foreground" />}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-foreground truncate">{channel.name}</h5>
                            <p className="text-xs text-muted-foreground truncate">
                              {channel.description || "No description"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteChannel(channel.id)
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Chat View */}
            {mobileView === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col"
              >
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Hash className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-foreground truncate">{activeChannelData.name}</h2>
                      <p className="text-sm text-muted-foreground truncate">
                        {activeChannelData.description || `Welcome to #${activeChannelData.name}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowNotifications(true)}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent relative"
                    >
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowClearChatModal(true)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Clear chat history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
                      Today
                    </span>
                  </div>

                  <AnimatePresence>
                    {messages.map((message, index) => {
                      const isOwnMessage = message.user_id === user?.id
                      const showTime =
                        index === 0 ||
                        new Date(message.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() >
                          300000

                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-2"
                        >
                          {showTime && (
                            <div className="text-center">
                              <span className="text-xs text-muted-foreground">{formatTime(message.created_at)}</span>
                            </div>
                          )}

                          <div className={cn("flex gap-3", isOwnMessage ? "justify-end" : "justify-start")}>
                            {!isOwnMessage && (
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={message.avatar_url || "/placeholder.svg"} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {message.user_name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div className={cn("max-w-[75%] group", isOwnMessage ? "order-first" : "")}>
                              {!isOwnMessage && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-foreground">{message.user_name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(message.created_at)}
                                  </span>
                                </div>
                              )}

                              <div className="relative">
                                <div
                                  className={cn(
                                    "px-4 py-3 rounded-2xl shadow-modern border",
                                    isOwnMessage
                                      ? "bg-primary text-primary-foreground border-primary ml-auto"
                                      : "bg-card text-card-foreground border-border",
                                  )}
                                >
                                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                </div>

                                {(isOwnMessage || user?.user_metadata?.role === "admin") && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteMessage(message.id)}
                                    className="absolute -top-2 -right-2 h-6 w-6 bg-destructive hover:bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>

                              {isOwnMessage && (
                                <div className="flex items-center justify-end mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(message.created_at)}
                                  </span>
                                  <div className="w-3 h-3 text-primary ml-1 text-xs">✓✓</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 bg-card/50 backdrop-blur-sm border-t border-border">
                  <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message #${activeChannelData.name}`}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary pr-10 rounded-xl"
                        disabled={!isConnected || !activeChannel}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                      <EmojiPicker
                        isOpen={showEmojiPicker}
                        onClose={() => setShowEmojiPicker(false)}
                        onEmojiSelect={handleEmojiSelect}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={!newMessage.trim() || !isConnected || !activeChannel}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-modern"
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Users View */}
            {mobileView === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full bg-card p-4 overflow-y-auto"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Online Users ({users.length})</h3>
                <div className="grid gap-3">
                  {users.map((chatUser) => (
                    <motion.div
                      key={chatUser.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent transition-all duration-200"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={chatUser.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {chatUser.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{chatUser.name}</p>
                        <p className="text-xs text-muted-foreground">Online</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ClearChatModal />
        <CreateChannelModal isOpen={showCreateChannel} onClose={() => setShowCreateChannel(false)} />
        <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      </div>
    )
  }

  // Desktop Layout - Top Navigation Bar (Different from Discord's left sidebar)
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Instasphere</h1>
          </div>

          <nav className="flex items-center gap-1">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 relative",
                  item.active
                    ? "bg-primary text-primary-foreground shadow-modern"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary rounded-lg"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigateToSettings}
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Channels */}
        <div className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Channels</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateChannel(true)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer group transition-all duration-200 border",
                    activeChannel === channel.id
                      ? "bg-primary text-primary-foreground border-primary shadow-modern"
                      : "border-transparent hover:border-border hover:bg-accent",
                  )}
                >
                  <Hash className="h-4 w-4 flex-shrink-0" />
                  {channel.is_private && <Lock className="h-3 w-3 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{channel.name}</p>
                    <p className="text-xs opacity-70 truncate">{channel.description || "No description"}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteChannel(channel.id)
                    }}
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Hash className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                {activeChannelData.is_private && <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-foreground truncate">{activeChannelData.name}</h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {activeChannelData.description || `Welcome to #${activeChannelData.name}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowClearChatModal(true)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Clear chat history"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center">
              <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
                Today
              </span>
            </div>

            <AnimatePresence>
              {messages.map((message, index) => {
                const isOwnMessage = message.user_id === user?.id
                const showTime =
                  index === 0 ||
                  new Date(message.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 300000

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-2"
                  >
                    {showTime && (
                      <div className="text-center">
                        <span className="text-xs text-muted-foreground">{formatTime(message.created_at)}</span>
                      </div>
                    )}

                    <div className={cn("flex gap-3", isOwnMessage ? "justify-end" : "justify-start")}>
                      {!isOwnMessage && (
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={message.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {message.user_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={cn("max-w-xs lg:max-w-md group", isOwnMessage ? "order-first" : "")}>
                        {!isOwnMessage && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-foreground">{message.user_name}</span>
                            <span className="text-xs text-muted-foreground">{formatTime(message.created_at)}</span>
                          </div>
                        )}

                        <div className="relative">
                          <div
                            className={cn(
                              "px-4 py-3 rounded-2xl shadow-modern border",
                              isOwnMessage
                                ? "bg-primary text-primary-foreground border-primary ml-auto"
                                : "bg-card text-card-foreground border-border",
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                          </div>

                          {(isOwnMessage || user?.user_metadata?.role === "admin") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMessage(message.id)}
                              className="absolute -top-2 -right-2 h-6 w-6 bg-destructive hover:bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        {isOwnMessage && (
                          <div className="flex items-center justify-end mt-1">
                            <span className="text-xs text-muted-foreground">{formatTime(message.created_at)}</span>
                            <div className="w-4 h-4 text-primary ml-1">✓✓</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-card/50 backdrop-blur-sm border-t border-border">
            <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-accent flex-shrink-0"
              >
                <Plus className="h-5 w-5" />
              </Button>

              <div className="flex-1 relative min-w-0">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${activeChannelData.name}`}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary pr-12 rounded-xl"
                  disabled={!isConnected || !activeChannel}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  <EmojiPicker
                    isOpen={showEmojiPicker}
                    onClose={() => setShowEmojiPicker(false)}
                    onEmojiSelect={handleEmojiSelect}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!newMessage.trim() || !isConnected || !activeChannel}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 flex-shrink-0 rounded-xl shadow-modern"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Right Panel - Online Users */}
        <div className="w-60 bg-card border-l border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Online — {users.length}</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {users.map((chatUser) => (
                <motion.div
                  key={chatUser.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-all duration-200 cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={chatUser.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {chatUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{chatUser.name}</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ClearChatModal />
      <CreateChannelModal isOpen={showCreateChannel} onClose={() => setShowCreateChannel(false)} />
      <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  )
}
