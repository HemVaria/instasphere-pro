"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Send,
  Smile,
  Hash,
  Users,
  MessageCircle,
  Plus,
  Search,
  Home,
  Rss,
  Compass,
  Settings,
  Bell,
  MoreVertical,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useChat } from "@/hooks/use-chat"
import { useChannels } from "@/hooks/use-channels"
import { useAuth } from "@/hooks/use-auth"
import { useNotifications } from "@/hooks/use-notifications"
import { EmojiPicker } from "./emoji-picker"
import { CreateChannelModal } from "./create-channel-modal"
import { NotificationsPanel } from "./notifications-panel"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface SlideZoneProps {
  onNavigateToExplore: () => void
  onNavigateToSettings: () => void
  onNavigateToFeed: () => void
}

export function SlideZone({ onNavigateToExplore, onNavigateToSettings, onNavigateToFeed }: SlideZoneProps) {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { user } = useAuth()
  const { channels, activeChannel, setActiveChannel, createChannel, deleteChannel, isAdmin } = useChannels()
  const {
    messages,
    users,
    sendMessage,
    deleteMessage,
    likeMessage,
    isConnected,
    activeChannel: chatActiveChannel,
    setActiveChannel: setChatActiveChannel,
  } = useChat()
  const { unreadCount } = useNotifications()

  // Sync active channel between chat and channels
  useEffect(() => {
    if (activeChannel && chatActiveChannel !== activeChannel) {
      setChatActiveChannel(activeChannel)
    }
  }, [activeChannel, chatActiveChannel, setChatActiveChannel])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !activeChannel) return

    try {
      await sendMessage(message.trim(), activeChannel)
      setMessage("")
      setShowEmojiPicker(false)
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId)
    } catch (error) {
      console.error("Failed to delete message:", error)
    }
  }

  const handleLikeMessage = async (messageId: string) => {
    try {
      await likeMessage(messageId)
    } catch (error) {
      console.error("Failed to like message:", error)
    }
  }

  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  return (
    <div className="h-screen bg-[#36393f] text-white flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-[#2f3136] border-b border-[#40444b] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-[#ff6b35]">Instasphere</h1>
          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Chat
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToFeed}
              className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] flex items-center gap-2"
            >
              <Rss className="h-4 w-4" />
              Feed
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToExplore}
              className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] flex items-center gap-2"
            >
              <Compass className="h-4 w-4" />
              Explore
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#72767d]" />
            <Input
              placeholder="Search channels..."
              className="pl-10 w-64 bg-[#40444b] border-[#40444b] text-[#dcddde] placeholder:text-[#72767d] focus:border-[#5865f2]"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(true)}
            className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-[#ed4245] text-white text-xs flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigateToSettings}
            className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b]"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-[#5865f2] text-white">
                {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-[#dcddde]">Sign Out</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Channels Sidebar */}
        <div className="w-60 bg-[#2f3136] border-r border-[#40444b] flex flex-col">
          <div className="p-4 border-b border-[#40444b]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#dcddde] uppercase tracking-wide">Channels</h2>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateChannel(true)}
                  className="h-6 w-6 text-[#b9bbbe] hover:text-white hover:bg-[#40444b]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={cn(
                  "flex items-center justify-between p-2 rounded cursor-pointer group transition-colors mb-1",
                  activeChannel === channel.id
                    ? "bg-[#40444b] text-[#dcddde]"
                    : "text-[#8e9297] hover:bg-[#40444b] hover:text-[#dcddde]",
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{channel.name}</span>
                  </div>
                  <div className="text-xs text-[#72767d] truncate">{channel.description}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#72767d]">
                    <span>0 messages</span>
                    <span>21/7/2025</span>
                  </div>
                </div>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteChannel(channel.id)
                    }}
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-[#72767d] hover:text-[#ed4245]"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-[#36393f] border-b border-[#40444b] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-[#72767d]" />
              <span className="text-[#dcddde] font-semibold">
                {activeChannel
                  ? channels.find((c) => c.id === activeChannel)?.name || "Select a channel"
                  : "Select a channel"}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b]">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {!activeChannel ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="h-16 w-16 text-[#72767d] mb-4" />
                <h3 className="text-xl font-medium text-[#dcddde] mb-2">No messages yet</h3>
                <p className="text-[#72767d]">Start the conversation!</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="h-16 w-16 text-[#72767d] mb-4" />
                <h3 className="text-xl font-medium text-[#dcddde] mb-2">No messages yet</h3>
                <p className="text-[#72767d]">Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 group hover:bg-[#32353b] p-2 rounded"
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={msg.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-[#5865f2] text-white">{msg.user_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#dcddde]">{msg.user_name}</span>
                        <span className="text-xs text-[#72767d]">{formatTime(msg.created_at)}</span>
                      </div>
                      <p className="text-[#dcddde] break-words">{msg.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button
                          onClick={() => handleLikeMessage(msg.id)}
                          className="flex items-center gap-1 text-xs text-[#72767d] hover:text-[#dcddde] transition-colors"
                        >
                          <span>👍</span>
                          <span>{msg.likes || 0}</span>
                        </button>
                        <button className="flex items-center gap-1 text-xs text-[#72767d] hover:text-[#dcddde] transition-colors">
                          <MessageCircle className="h-3 w-3" />
                          <span>{msg.replies || 0}</span>
                        </button>
                      </div>
                    </div>
                    {msg.user_id === user?.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-[#72767d] hover:text-[#ed4245]"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="bg-[#40444b] mx-4 mb-4 rounded-lg">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message #${activeChannel ? channels.find((c) => c.id === activeChannel)?.name || "undefined" : "undefined"}`}
                  className="bg-transparent border-none text-[#dcddde] placeholder:text-[#72767d] focus:ring-0 focus:ring-offset-0 pr-10"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="h-6 w-6 text-[#b9bbbe] hover:text-white"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={!message.trim() || !activeChannel}
                size="icon"
                className="bg-[#5865f2] hover:bg-[#4752c4] text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {showEmojiPicker && (
              <div className="relative">
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  isOpen={showEmojiPicker}
                  onClose={() => setShowEmojiPicker(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Online Users Sidebar */}
        <div className="w-60 bg-[#2f3136] border-l border-[#40444b] flex flex-col">
          <div className="p-4 border-b border-[#40444b]">
            <h2 className="text-sm font-semibold text-[#dcddde] uppercase tracking-wide">Online Users</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {user && (
              <div className="flex items-center gap-3 p-2 rounded hover:bg-[#40444b] transition-colors">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-[#5865f2] text-white">
                      {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#3ba55c] rounded-full border-2 border-[#2f3136]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#dcddde] truncate">{user.email || "Current User"}</p>
                  <p className="text-xs text-[#3ba55c]">Online</p>
                </div>
              </div>
            )}

            {users.slice(0, 10).map((onlineUser, index) => (
              <div
                key={onlineUser.id || index}
                className="flex items-center gap-3 p-2 rounded hover:bg-[#40444b] transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={onlineUser.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-[#5865f2] text-white">{onlineUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#3ba55c] rounded-full border-2 border-[#2f3136]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#dcddde] truncate">{onlineUser.name}</p>
                  <p className="text-xs text-[#3ba55c]">Online</p>
                </div>
              </div>
            ))}

            {users.length === 0 && !user && (
              <div className="text-center text-[#72767d] text-sm">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No users online</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateChannelModal isOpen={showCreateChannel} onClose={() => setShowCreateChannel(false)} />
      <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  )
}
