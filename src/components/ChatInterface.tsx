import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isTyping: boolean
  disabled?: boolean
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isTyping, disabled = false }) => {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const renderMessageText = (text: string, sender: 'user' | 'ai') => {
    console.log(`Rendering message from ${sender}:`, text)
    if (sender === 'ai') {
      // Render markdown for AI responses
      return (
        <div>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-3 text-purple-800 dark:text-purple-300">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-400">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium mb-2 text-purple-600 dark:text-purple-500">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-2 leading-relaxed">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-purple-900 dark:text-purple-200">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-purple-800 dark:text-purple-300">
                {children}
              </em>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-3 space-y-1 ml-4">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">
                {children}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-purple-400 pl-4 my-3 italic bg-purple-50 dark:bg-purple-900/20 py-2 rounded-r">
                {children}
              </blockquote>
            ),
            code: ({ children, className }) => {
              const isInlineCode = !className
              return isInlineCode ? (
                <code className="bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded text-sm font-mono text-purple-800 dark:text-purple-300">
                  {children}
                </code>
              ) : (
                <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                  {children}
                </code>
              )
            },
            pre: ({ children }) => (
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-3">
                {children}
              </pre>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-3">
                <table className="min-w-full border border-gray-300 dark:border-gray-600">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                {children}
              </td>
            ),
          }}
        >
          {text}
        </ReactMarkdown>
        <div>
          {text.includes("NOT FOUND, PLEASE ESCALATE") || text.includes("I couldn't find an answer to your question. Please escalate this issue to your team lead.") ? <div className="escalation-container">
          <a href="mailto:matt@innovate.cmo" className="escalation-button">📧 Contact Manager</a>
        </div> : <div></div>}
        </div>
        </div>
      )
    } else {
      // Plain text for user messages
      return <div className="message-text">{text}</div>
    }
  }

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.sender}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-avatar">
                {message.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {renderMessageText(message.text, message.sender)}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            className="message ai typing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="message-avatar">
              <Bot size={20} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={disabled ? "Please set your API key to start chatting..." : "Ask me anything about onboarding..."}
            disabled={isTyping || disabled}
          />
          <motion.button
            type="submit"
            disabled={!inputValue.trim() || isTyping || disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </form>
    </div>
  )
}

export default ChatInterface 
