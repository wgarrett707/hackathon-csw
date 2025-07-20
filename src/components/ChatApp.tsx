import { useState } from 'react'
import Mascot from './Mascot'
import ChatInterface from './ChatInterface'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Get API key from environment variable
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

interface ChatAppProps {
  onShowCitation?: () => void
  citationOpen?: boolean
}

function ChatApp({ onShowCitation, citationOpen = false }: ChatAppProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! I'm your AI onboarding assistant. I'm here to help you get up to speed with everything you need to know. What would you like to learn about?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])

  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string>('')

  const callChatGPT = async (userMessage: string): Promise<string> => {
    try {
      const systemPrompt = `You are an AI onboarding assistant for a company. Your role is to help new employees get up to speed with company processes, tools, and culture. Be friendly, helpful, and concise. Keep responses under 200 words unless more detail is specifically requested. Focus on practical, actionable advice.`

      const chatMessages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10).map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text
        })),
        { role: 'user', content: userMessage }
      ]

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: chatMessages,
          max_tokens: 300,
          temperature: 0.7,
          stream: false
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to get response from ChatGPT')
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.'
    } catch (error) {
      console.error('ChatGPT API Error:', error)
      throw error
    }
  }

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    setError('')

    try {
      let aiResponse: string

      // Check for citation trigger
      if (message.toLowerCase().includes('give a citation')) {
        console.log('Citation trigger detected!')
        // Add extra delay for citation to simulate thinking
        await new Promise(resolve => setTimeout(resolve, 1000))
        aiResponse = "According to our Employee Handbook, standard work hours are 9:00 AM to 5:00 PM, Monday through Friday. We also offer flexible scheduling options for team members who need to accommodate personal commitments."
        onShowCitation?.()
      } else {
        // Check if API key is available for ChatGPT
        if (!OPENAI_API_KEY) {
          aiResponse = "I'd be happy to help! However, I need an API key to provide detailed responses. For now, try asking me to 'give a citation' to see how I can reference source materials."
        } else {
          // Regular ChatGPT response
          aiResponse = await callChatGPT(message)
        }
      }
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai' as const,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please check your API key and try again.',
        sender: 'ai' as const,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className={`app-container ${citationOpen ? 'citation-open' : ''}`}>
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">○</span>
          <span className="logo-text">OnboardAI</span>
        </div>
        <div className="status">
          <div className={`status-dot ${OPENAI_API_KEY ? 'connected' : 'disconnected'}`}></div>
          <span>{OPENAI_API_KEY ? 'AI Assistant Online' : 'API Key Required'}</span>
        </div>
      </header>
      
      <main className="app-main">
        <div className="mascot-container">
          <Mascot isTyping={isTyping} />
        </div>
        
        <ChatInterface 
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          disabled={false}
        />
      </main>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}


    </div>
  )
}

export default ChatApp 