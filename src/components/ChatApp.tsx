import { useState } from 'react'
import Mascot from './Mascot'
import ChatInterface from './ChatInterface'
import trainingDocuments from '../assets/training-documents'
import { Pencil } from 'lucide-react'

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
  onShowCitation?: (citationIndex?: number, quotedText?: string) => void
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
  // Gradient color options for mascot
  const colorOptions = [
    {
      color: '#a78bfa',
      gradient: 'linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)'
    },
    {
      color: '#f472b6',
      gradient: 'linear-gradient(135deg, #f472b6 0%, #f9a8d4 100%)'
    },
    {
      color: '#60a5fa',
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)'
    },
    {
      color: '#34d399',
      gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
    },
    {
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e42 100%)'
    },
    {
      color: '#f87171',
      gradient: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'
    },
    {
      color: '#facc15',
      gradient: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)'
    },
  ]

  const [avatarColor, setAvatarColor] = useState<string>(colorOptions[0].color)
  const [avatarGradient, setAvatarGradient] = useState<string>(colorOptions[0].gradient)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const callChatGPT = async (userMessage: string): Promise<string> => {
    try {
      const systemPrompt = `
      You are a professional onboarding guide for InnovateTech Solutions. Your goal is to help new Customer Support employees by answering their questions **using only the provided internal Markdown documents** [1], [2], [3], etc.

---

Response Requirements:

1. Use ONLY information found verbatim in the provided documents.  
2. Your response MUST include exactly ONE citation formatted as: [x]["quoted content"], where:  
   - [x] is the document number  
   - "quoted content" is the exact sentence or passage from that document, preserving Markdown formatting such as headings, bold, italics, lists, and inline code whenever possible.  
3. If multiple relevant passages exist, pick the most complete and relevant one to quote.  
4. DO NOT summarize or paraphrase document content. Use direct quotes only.  
5. If no relevant information is found, respond exactly with:  
   NOT FOUND, PLEASE ESCALATE  
6. Always end your response with 2-3 actionable next steps or resources that the employee can follow.

---

Markdown Quoting:

- Preserve original Markdown formatting in your quote as much as possible.  
- If preserving exact formatting is impossible, quoting the full accurate sentence or passage is mandatory.

---

Unacceptable:

- Statements without quotes.  
- Paraphrasing or partial quotes.  
- Multiple citations.  
- Using “NOT FOUND” unless you truly cannot find any answer.

---

Example:

Question: What is the expected response time for customer inquiries?

Answer:  
Customer inquiries must be responded to within 24 hours [1]["**Response Time:** All customer inquiries should receive a first response within _24 hours_ of receipt. This ensures we meet our SLA commitments."]

Next steps:  
1. Review the full SLA policy in Document [1]  
2. Set calendar reminders to check open tickets  
3. Ask your team lead how to handle delayed responses

---

Now, answer onboarding questions strictly following this format.

Here are the documents you can use to answer questions:

${trainingDocuments.map((doc: string, index: number) => `Document ${index + 1}: ${doc}`).join('\n')}  
      `

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
          temperature: 0,
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

      // Check if API key is available for ChatGPT
      if (!OPENAI_API_KEY) {
        aiResponse = "I'd be happy to help! However, I need an API key to provide detailed responses. For now, try asking me to 'give a citation' to see how I can reference source materials."
      } else {
        // Regular ChatGPT response
        aiResponse = await callChatGPT(message)
      }

      // Check if response contains citation patterns [1], [2], [3], etc.
      const citationPattern = /\[(\d+)\]\s*\["([^"]+)"\]/g
      const match = citationPattern.exec(aiResponse)
      if (match) {
        const citationNum = parseInt(match[1], 10)
        const quotedText = match[2]
        if (!isNaN(citationNum)) {
          // Add extra delay for citation to simulate thinking
          await new Promise(resolve => setTimeout(resolve, 1000))
          onShowCitation?.(citationNum - 1, quotedText)
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
        <div className="mascot-container" style={{ position: 'relative' }}>
          <Mascot isTyping={isTyping} color={avatarColor} gradient={avatarGradient} />
          <button
            className="avatar-edit-btn"
            style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}
            onClick={() => setShowColorPicker((v) => !v)}
            aria-label="Edit avatar color"
          >
            <Pencil size={18} color="#888" />
          </button>
          {showColorPicker && (
            <div className="avatar-color-picker">
              {colorOptions.map((opt) => (
                <button
                  key={opt.color}
                  className={`avatar-color-swatch${avatarColor === opt.color ? ' selected' : ''}`}
                  style={{ background: opt.gradient }}
                  onClick={() => {
                    setAvatarColor(opt.color)
                    setAvatarGradient(opt.gradient)
                    setShowColorPicker(false)
                  }}
                  aria-label={`Set avatar color to ${opt.color}`}
                />
              ))}
            </div>
          )}
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