import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'
import ChatApp from './components/ChatApp'
import AdminDashboard from './components/AdminDashboard'
import trainingDocuments from './assets/training-documents'

function App() {
  const [showCitationWindow, setShowCitationWindow] = useState(false)
  const [citationIndex, setCitationIndex] = useState<number | null>(null)
  const [quotedText, setQuotedText] = useState<string | null>(null)
  const citationContentRef = useRef<HTMLDivElement>(null)

  const handleShowCitation = (index?: number, quote?: string) => {
    if (typeof index === 'number') setCitationIndex(index)
    if (quote) setQuotedText(quote)
    setShowCitationWindow(true)
  }

  const handleCloseCitation = () => {
    setShowCitationWindow(false)
    setCitationIndex(null)
    setQuotedText(null)
  }

  // Auto-scroll to highlighted text when citation window opens
  useEffect(() => {
    if (showCitationWindow && citationContentRef.current && quotedText) {
      // Use a small delay to ensure the window is fully rendered
      setTimeout(() => {
        const highlightedElement = citationContentRef.current?.querySelector('.highlighted-text')
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          })
        }
      }, 100)
    }
  }, [showCitationWindow, quotedText])

  // Function to highlight quoted text in the document
  const highlightQuotedText = (documentContent: string, quote: string) => {
    if (!quote) return documentContent
    
    // Escape special regex characters in the quote
    const escapedQuote = quote.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuote})`, 'gi')
    
    return documentContent.replace(regex, '<span class="highlighted-text">$1</span>')
  }

  return (
    <Router>
      <div className="app">
        <div className="app-layout">
          <Routes>
            <Route path="/" element={<ChatApp onShowCitation={handleShowCitation} citationOpen={showCitationWindow} />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          
          {showCitationWindow && citationIndex !== null && (
            <div className="citation-window">
              <div className="citation-window-header">
                <div className="citation-window-title">
                  <span className="logo-icon">📄</span>
                  <span className="logo-text">Source Document</span>
                </div>
                <div className="status">
                  <div className="status-dot connected"></div>
                  <span>Document {citationIndex + 1}</span>
                </div>
                <button className="close-citation-btn" onClick={handleCloseCitation}>
                  ✕
                </button>
              </div>
              <main className="citation-window-main">
                <div className="citation-content" ref={citationContentRef}>
                  <div className="document-content">
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
                        p: ({ children }) => {
                          const content = typeof children === 'string' ? children : children?.toString() || ''
                          const highlightedContent = quotedText ? highlightQuotedText(content, quotedText) : content
                          return (
                            <p 
                              className="mb-2 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: highlightedContent }}
                            />
                          )
                        },
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
                      {trainingDocuments[citationIndex]}
                    </ReactMarkdown>
                  </div>
                </div>
              </main>
            </div>
          )}
        </div>
      </div>
    </Router>
  )
}

export default App
