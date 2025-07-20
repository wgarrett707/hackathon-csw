import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, Trash2, Download, Settings } from 'lucide-react'

interface Document {
  id: string
  name: string
  type: string
  size: number
  content: string
  uploadedAt: Date
}

function AdminDashboard() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize IndexedDB
  useEffect(() => {
    initializeDB()
    loadDocuments()
  }, [])

  const initializeDB = () => {
    const request = indexedDB.open('OnboardAIDB', 1)
    
    request.onerror = () => {
      console.error('Failed to open database')
    }
    
    request.onsuccess = () => {
      console.log('Database opened successfully')
    }
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      if (!db.objectStoreNames.contains('documents')) {
        const store = db.createObjectStore('documents', { keyPath: 'id' })
        store.createIndex('uploadedAt', 'uploadedAt', { unique: false })
      }
    }
  }

  const loadDocuments = () => {
    const request = indexedDB.open('OnboardAIDB', 1)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['documents'], 'readonly')
      const store = transaction.objectStore('documents')
      const getAllRequest = store.getAll()
      
      getAllRequest.onsuccess = () => {
        setDocuments(getAllRequest.result.sort((a, b) => 
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        ))
      }
    }
  }

  const saveDocument = (document: Document) => {
    const request = indexedDB.open('OnboardAIDB', 1)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['documents'], 'readwrite')
      const store = transaction.objectStore('documents')
      store.add(document)
      
      transaction.oncomplete = () => {
        loadDocuments()
      }
    }
  }

  const deleteDocument = (id: string) => {
    const request = indexedDB.open('OnboardAIDB', 1)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['documents'], 'readwrite')
      const store = transaction.objectStore('documents')
      store.delete(id)
      
      transaction.oncomplete = () => {
        loadDocuments()
      }
    }
  }

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const fileArray = Array.from(files)
    
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      setUploadProgress((i / fileArray.length) * 100)
      
      try {
        const content = await readFileContent(file)
        const document: Document = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          content,
          uploadedAt: new Date()
        }
        
        saveDocument(document)
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate upload time
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }
    
    setUploadProgress(100)
    setTimeout(() => {
      setIsUploading(false)
      setUploadProgress(0)
    }, 1000)
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const content = e.target?.result as string
        resolve(content)
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        reader.readAsText(file)
      } else {
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadDocument = (document: Document) => {
    const blob = new Blob([document.content], { type: document.type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = document.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">⚙️</span>
          <span className="logo-text">OnboardAI Admin</span>
        </div>
        <div className="status">
          <div className="status-dot connected"></div>
          <span>Admin Dashboard</span>
        </div>
      </header>
      
      <main className="admin-main">
        <div className="admin-content">
          {/* Upload Section */}
          <div className="upload-section">
            <h2>Document Management</h2>
            <p>Upload onboarding documents to enhance the AI assistant's knowledge</p>
            
            <motion.div 
              className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.txt,.md,.json,.csv"
              />
              
              <Upload size={48} className="upload-icon" />
              <h3>Drop files here or click to upload</h3>
              <p>Supports PDF, DOC, DOCX, TXT, MD, JSON, CSV</p>
              
              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Documents List */}
          <div className="documents-section">
            <h3>Uploaded Documents ({documents.length})</h3>
            
            <AnimatePresence>
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  className="document-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="document-info">
                    <File size={24} className="document-icon" />
                    <div className="document-details">
                      <h4>{doc.name}</h4>
                      <p>{formatFileSize(doc.size)} • {doc.type}</p>
                      <small>Uploaded {doc.uploadedAt.toLocaleDateString()}</small>
                    </div>
                  </div>
                  
                  <div className="document-actions">
                    <motion.button
                      onClick={() => downloadDocument(doc)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="action-btn download"
                    >
                      <Download size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => deleteDocument(doc.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="action-btn delete"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {documents.length === 0 && (
              <div className="empty-state">
                <File size={48} className="empty-icon" />
                <p>No documents uploaded yet</p>
                <span>Upload your first document to get started</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard 