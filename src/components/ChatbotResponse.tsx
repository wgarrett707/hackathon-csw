import React, { useRef, useEffect } from 'react'
import { Bot, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface ChatbotResponseProps {
  messages: Message[]
  isTyping: boolean
}

const ChatbotResponse: React.FC<ChatbotResponseProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const renderMessageText = (text: string, sender: 'user' | 'ai') => {
    console.log(`Rendering message from ${sender}:`, text)
    console.log("asdfasd")
    if (sender === 'ai') {
      // Render markdown for AI responses
      return (
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom styling for markdown elements
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
      )
    } else {
      // Plain text for user messages
      return <div className="message-text">{text}</div>
    }
  }

  return (
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
              {message.sender === 'ai' ? (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
              )}
            </div>
            <div className="message-content">
              <div className={`message-bubble ${message.sender === 'ai' ? 'ai-message' : 'user-message'}`}>
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
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
          </div>
          <div className="message-content">
            <div className="message-bubble ai-message">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      <div ref={messagesEndRef} />
      
      <style>{`
        .message {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 20px;
          animation: slideInUp 0.3s ease-out;
        }
        
        .message.user {
          flex-direction: row-reverse;
        }
        
        .message-content {
          max-width: 70%;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .message.user .message-content {
          align-items: flex-end;
        }
        
        .message-bubble {
          padding: 16px 20px;
          border-radius: 20px;
          position: relative;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }
        
        .message-bubble:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .ai-message {
          background: linear-gradient(135deg, 
            rgba(147, 51, 234, 0.1) 0%, 
            rgba(219, 39, 119, 0.1) 100%);
          border: 1px solid rgba(147, 51, 234, 0.2);
          color: #1f2937;
        }
        
        .user-message {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.1) 0%, 
            rgba(6, 182, 212, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #1f2937;
        }
        
        .dark .ai-message {
          background: linear-gradient(135deg, 
            rgba(147, 51, 234, 0.2) 0%, 
            rgba(219, 39, 119, 0.2) 100%);
          border: 1px solid rgba(147, 51, 234, 0.3);
          color: #f9fafb;
        }
        
        .dark .user-message {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.2) 0%, 
            rgba(6, 182, 212, 0.2) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #f9fafb;
        }
        
        .message-time {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }
        
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 8px 0;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333ea, #db2777);
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .markdown-content {
          line-height: 1.6;
        }
        
        .markdown-content > *:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}

export default ChatbotResponse
