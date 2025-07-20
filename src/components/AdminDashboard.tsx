import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, Trash2, Download, Settings } from 'lucide-react'

interface Role {
  id: string
  name: string
  description?: string
}

interface Document {
  id: string
  name: string
  type: string
  size: number
  content: string
  uploadedAt: Date
  roleIds?: string[]  // Support multiple roles per document
  contentType?: 'file' | 'text' | 'link'  // New content types
  url?: string  // For link content
  linkTitle?: string  // For link previews
}

function AdminDashboard() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDescription, setNewRoleDescription] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [hoveredDocument, setHoveredDocument] = useState<Document | null>(null)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isTextInputMode, setIsTextInputMode] = useState(false)
  const [isLinkInputMode, setIsLinkInputMode] = useState(false)
  const [textContent, setTextContent] = useState('')
  const [textTitle, setTextTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkTitle, setLinkTitle] = useState('')
  const [showLinkPreview, setShowLinkPreview] = useState(false)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize IndexedDB
  useEffect(() => {
    initializeDB()
    loadDocuments()
    loadRoles()
  }, [])

  const initializeDB = () => {
    const request = indexedDB.open('OnboardAIDB', 2) // Increased version number for schema update
    
    request.onerror = () => {
      console.error('Failed to open database')
    }
    
    request.onsuccess = () => {
      console.log('Database opened successfully')
    }
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      // Create documents store if it doesn't exist
      if (!db.objectStoreNames.contains('documents')) {
        const store = db.createObjectStore('documents', { keyPath: 'id' })
        store.createIndex('uploadedAt', 'uploadedAt', { unique: false })
        store.createIndex('roleId', 'roleId', { unique: false })
      } else if (event.oldVersion < 2) {
        // If upgrading from version 1, add roleId index
        const transaction = (event.target as IDBOpenDBRequest).transaction;
        if (transaction) {
          const store = transaction.objectStore('documents');
          if (!store.indexNames.contains('roleId')) {
            store.createIndex('roleId', 'roleId', { unique: false });
          }
        }
      }
      
      // Create roles store
      if (!db.objectStoreNames.contains('roles')) {
        const store = db.createObjectStore('roles', { keyPath: 'id' })
        store.createIndex('name', 'name', { unique: true })
      }
    }
  }

  const loadDocuments = () => {
    const request = indexedDB.open('OnboardAIDB', 2)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['documents'], 'readonly')
      const store = transaction.objectStore('documents')
      
      // Get all documents and filter client-side for multi-role support
      const getAllRequest = store.getAll()
      
      getAllRequest.onsuccess = () => {
        let filteredDocuments = getAllRequest.result
        
        // Filter by selected roles if any are selected
        if (selectedRoleIds.length > 0) {
          filteredDocuments = filteredDocuments.filter(doc => {
            // Support both old single roleId and new multiple roleIds format
            const docRoles = doc.roleIds || ((doc as any).roleId ? [(doc as any).roleId] : [])
            return docRoles.some((roleId: string) => selectedRoleIds.includes(roleId))
          })
        }
        
        setDocuments(filteredDocuments.sort((a, b) => 
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        ))
      }
    }
  }
  
  const loadRoles = () => {
    const request = indexedDB.open('OnboardAIDB', 2)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['roles'], 'readonly')
      const store = transaction.objectStore('roles')
      const getAllRequest = store.getAll()
      
      getAllRequest.onsuccess = () => {
        setRoles(getAllRequest.result)
      }
    }
  }

  const saveDocument = (document: Document) => {
    const request = indexedDB.open('OnboardAIDB', 2)
    
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
    const request = indexedDB.open('OnboardAIDB', 2)
    
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
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          content,
          uploadedAt: new Date(),
          roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
          contentType: 'file'
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

  const createRole = () => {
    if (!newRoleName.trim()) return
    
    const request = indexedDB.open('OnboardAIDB', 2)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['roles'], 'readwrite')
      const store = transaction.objectStore('roles')
      
      // Check if role name already exists
      const index = store.index('name')
      const getRequest = index.get(newRoleName.trim())
      
      getRequest.onsuccess = () => {
        if (getRequest.result) {
          alert('A role with this name already exists')
          return
        }
        
        // Add new role
        const role: Role = {
          id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: newRoleName.trim(),
          description: newRoleDescription.trim() || undefined
        }
        
        store.add(role)
        
        transaction.oncomplete = () => {
          loadRoles()
          setNewRoleName('')
          setNewRoleDescription('')
        }
      }
    }
  }
  
  const deleteRole = (id: string) => {
    const request = indexedDB.open('OnboardAIDB', 2)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['roles'], 'readwrite')
      const store = transaction.objectStore('roles')
      store.delete(id)
      
      transaction.oncomplete = () => {
        // Remove deleted role from selection if it was selected
        setSelectedRoleIds(prev => prev.filter(roleId => roleId !== id))
        loadRoles()
        loadDocuments() // Reload documents to update UI
      }
    }
  }
  
  const toggleRoleSelection = (roleId: string) => {
    setSelectedRoleIds(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId)
      } else {
        return [...prev, roleId]
      }
    })
  }
  
  const clearRoleSelection = () => {
    setSelectedRoleIds([])
  }
  
  const removeRoleFromSelection = (roleId: string) => {
    setSelectedRoleIds(prev => prev.filter(id => id !== roleId))
  }
  
  useEffect(() => {
    loadDocuments()
  }, [selectedRoleIds])
  
  // Document Preview Functions
  const handleDocumentHover = (doc: Document, event: React.MouseEvent) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }
    
    // Set new timeout for hover delay
    const timeout = setTimeout(() => {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const scrollY = window.scrollY || 0
      const scrollX = window.scrollX || 0
      
      setPreviewPosition({
        x: rect.right + scrollX + 15,
        y: rect.top + scrollY
      })
      setHoveredDocument(doc)
    }, 300) // Reduced delay to 300ms for better UX
    
    setHoverTimeout(timeout)
  }
  
  const handleDocumentLeave = () => {
    // Clear timeout on leave
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setHoveredDocument(null)
  }
  
  const getPreviewContent = (doc: Document) => {
    if (doc.contentType === 'text') {
      return doc.content.substring(0, 500) + (doc.content.length > 500 ? '...' : '')
    } else if (doc.contentType === 'link') {
      return `Link: ${doc.url}\n\nTitle: ${doc.linkTitle || 'No title'}\n\nClick to visit this link.`
    } else {
      // File content
      const isTextFile = doc.type.startsWith('text/') || 
                        doc.type === 'application/json' ||
                        doc.name.endsWith('.md') ||
                        doc.name.endsWith('.txt')
      
      if (isTextFile) {
        return doc.content.substring(0, 500) + (doc.content.length > 500 ? '...' : '')
      } else {
        return `Preview not available for ${doc.type} files. File size: ${formatFileSize(doc.size)}`
      }
    }
  }
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [])
  
  // Enhanced Content Input Functions
  const handleTextSubmit = async () => {
    if (!textContent.trim() || !textTitle.trim()) return
    
    setIsUploading(true)
    setUploadProgress(50)
    
    const document: Document = {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: textTitle.trim(),
      type: 'text/plain',
      size: textContent.length,
      content: textContent,
      uploadedAt: new Date(),
      roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
      contentType: 'text'
    }
    
    try {
      saveDocument(document)
      setUploadProgress(100)
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        setIsTextInputMode(false)
        setTextContent('')
        setTextTitle('')
      }, 1000)
    } catch (error) {
      console.error('Error saving text document:', error)
      setIsUploading(false)
    }
  }
  
  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }
  
  const handleLinkSubmit = async () => {
    if (!linkUrl.trim() || !isValidUrl(linkUrl)) return
    
    setIsUploading(true)
    setUploadProgress(30)
    
    // Extract title from URL if not provided
    const finalTitle = linkTitle.trim() || new URL(linkUrl).hostname
    
    const document: Document = {
      id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: finalTitle,
      type: 'text/html',
      size: linkUrl.length,
      content: `Link: ${linkUrl}`,
      uploadedAt: new Date(),
      roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
      contentType: 'link',
      url: linkUrl,
      linkTitle: finalTitle
    }
    
    try {
      saveDocument(document)
      setUploadProgress(100)
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        setIsLinkInputMode(false)
        setLinkUrl('')
        setLinkTitle('')
        setShowLinkPreview(false)
      }, 1000)
    } catch (error) {
      console.error('Error saving link document:', error)
      setIsUploading(false)
    }
  }
  
  const handleLinkUrlChange = (url: string) => {
    setLinkUrl(url)
    if (isValidUrl(url)) {
      // Auto-generate title from URL if not set
      if (!linkTitle) {
        try {
          setLinkTitle(new URL(url).hostname)
        } catch (e) {
          // Ignore error
        }
      }
      // Show preview after short delay
      setTimeout(() => {
        if (isValidUrl(url)) {
          setIsLoadingPreview(true)
          setShowLinkPreview(true)
        }
      }, 1000)
    } else {
      setShowLinkPreview(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <div className="company-logo-container">
            <img 
              src="/logo.svg" 
              alt="Company Logo" 
              className="company-logo"
              onError={(e) => {
                // Fallback to a styled placeholder if logo doesn't exist
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="logo-fallback hidden">
              <span className="fallback-icon">🏢</span>
            </div>
          </div>
          <span className="logo-text">OnboardAI Admin</span>
        </div>
        <div className="status">
          <div className="top-bar-left">
            <div className="role-selector">
              <div className="multi-select-container">
                <motion.button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="role-dropdown-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedRoleIds.length === 0 
                    ? 'Select Roles' 
                    : `${selectedRoleIds.length} Role${selectedRoleIds.length > 1 ? 's' : ''} Selected`
                  }
                  <motion.div
                    animate={{ rotate: isRoleDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.div>
                </motion.button>
                
                {isRoleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="role-dropdown-menu"
                  >
                    <div className="role-dropdown-header">
                      <span>Select Roles</span>
                      {selectedRoleIds.length > 0 && (
                        <button onClick={clearRoleSelection} className="clear-selection-btn">
                          Clear All
                        </button>
                      )}
                    </div>
                    
                    {roles.map(role => (
                      <motion.label
                        key={role.id}
                        className="role-option"
                        whileHover={{ backgroundColor: 'rgba(102, 126, 234, 0.1)' }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRoleIds.includes(role.id)}
                          onChange={() => toggleRoleSelection(role.id)}
                        />
                        <div className="role-option-content">
                          <span className="role-name">{role.name}</span>
                          {role.description && (
                            <small className="role-desc">{role.description}</small>
                          )}
                        </div>
                      </motion.label>
                    ))}
                    
                    {roles.length === 0 && (
                      <div className="no-roles-message">
                        No roles available. Create some roles first.
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              
              <motion.button
                onClick={() => setIsRoleModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="role-manage-btn"
              >
                <Settings size={20} />
              </motion.button>
            </div>
          </div>
          
          <div className="top-bar-center">
            {/* Selected Roles Chips */}
            {selectedRoleIds.length > 0 && (
              <div className="selected-roles-chips">
                {selectedRoleIds.map(roleId => {
                  const role = roles.find(r => r.id === roleId)
                  return role ? (
                    <motion.div
                      key={roleId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="role-chip"
                    >
                      <span>{role.name}</span>
                      <button
                        onClick={() => removeRoleFromSelection(roleId)}
                        className="remove-role-btn"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ) : null
                })}
              </div>
            )}
          </div>
          
          <div className="top-bar-right">
            <div className="status-dot connected"></div>
            <span>Admin Dashboard</span>
          </div>
        </div>
      </header>
      
      <main className="admin-main">
        <div className="admin-content">
          {/* Enhanced Upload Section */}
          <div className="upload-section">
            <h2>Content Management {selectedRoleIds.length > 0 ? `for ${selectedRoleIds.length} Selected Role${selectedRoleIds.length > 1 ? 's' : ''}` : ''}</h2>
            <p>Add files, text content, or links to enhance the AI assistant's knowledge{selectedRoleIds.length > 0 ? ` for the selected role${selectedRoleIds.length > 1 ? 's' : ''}` : ' for all roles'}</p>
            
            {/* Content Type Tabs */}
            <div className="content-tabs">
              <motion.button
                className={`tab-btn ${!isTextInputMode && !isLinkInputMode ? 'active' : ''}`}
                onClick={() => {
                  setIsTextInputMode(false)
                  setIsLinkInputMode(false)
                  setShowLinkPreview(false)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📁 Files
              </motion.button>
              <motion.button
                className={`tab-btn ${isTextInputMode ? 'active' : ''}`}
                onClick={() => {
                  setIsTextInputMode(true)
                  setIsLinkInputMode(false)
                  setShowLinkPreview(false)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📝 Text
              </motion.button>
              <motion.button
                className={`tab-btn ${isLinkInputMode ? 'active' : ''}`}
                onClick={() => {
                  setIsTextInputMode(false)
                  setIsLinkInputMode(true)
                  setShowLinkPreview(false)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🔗 Links
              </motion.button>
            </div>
            
            {/* File Upload Mode */}
            {!isTextInputMode && !isLinkInputMode && (
              <motion.div 
                className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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
            )}
            
            {/* Text Input Mode */}
            {isTextInputMode && (
              <motion.div 
                className="text-input-area"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-form">
                  <input
                    type="text"
                    value={textTitle}
                    onChange={(e) => setTextTitle(e.target.value)}
                    placeholder="Document title (e.g., Company Policies)"
                    className="text-title-input"
                  />
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter your text content here...\n\nThis could be company policies, procedures, guidelines, or any other important information for onboarding."
                    className="text-content-input"
                    rows={8}
                  />
                  <div className="text-form-actions">
                    <span className="character-count">{textContent.length} characters</span>
                    <motion.button
                      onClick={handleTextSubmit}
                      disabled={!textContent.trim() || !textTitle.trim() || isUploading}
                      className="submit-text-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isUploading ? 'Saving...' : 'Save Text Document'}
                    </motion.button>
                  </div>
                </div>
                
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
            )}
            
            {/* Link Input Mode */}
            {isLinkInputMode && (
              <motion.div 
                className="link-input-area"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="link-form">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => handleLinkUrlChange(e.target.value)}
                    placeholder="Paste a URL here (e.g., https://company-handbook.com)"
                    className="link-url-input"
                  />
                  <input
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="Link title (auto-generated from URL)"
                    className="link-title-input"
                  />
                  <div className="link-form-actions">
                    <span className="url-status">
                      {isValidUrl(linkUrl) ? '✅ Valid URL' : linkUrl ? '❌ Invalid URL' : 'Enter a URL'}
                    </span>
                    <motion.button
                      onClick={handleLinkSubmit}
                      disabled={!isValidUrl(linkUrl) || isUploading}
                      className="submit-link-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isUploading ? 'Saving...' : 'Save Link'}
                    </motion.button>
                  </div>
                </div>
                
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
            )}
            
            {/* Link Preview Iframe */}
            {showLinkPreview && isValidUrl(linkUrl) && (
              <motion.div
                className="link-preview-popup"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="preview-popup-header">
                  <h4>Link Preview</h4>
                  <button
                    onClick={() => setShowLinkPreview(false)}
                    className="close-preview-btn"
                  >
                    ✕
                  </button>
                </div>
                <div className="preview-popup-content">
                  <div className="preview-url">
                    <strong>URL:</strong> {linkUrl}
                  </div>
                  <div className="iframe-container">
                    <iframe
                      src={linkUrl}
                      title="Link Preview"
                      className="preview-iframe"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      loading="lazy"
                      onLoad={() => setIsLoadingPreview(false)}
                      onError={() => setIsLoadingPreview(false)}
                    />
                    {isLoadingPreview && (
                      <div className="iframe-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading preview...</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="preview-popup-footer">
                  <p>This is a preview of the linked content. The link will be saved to your database.</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Documents List */}
          <div className="documents-section">
            <h3>Uploaded Documents ({documents.length}) {selectedRoleIds.length > 0 ? `for ${selectedRoleIds.length} Selected Role${selectedRoleIds.length > 1 ? 's' : ''}` : ''}</h3>
            
            <AnimatePresence>
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  className="document-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={(e) => handleDocumentHover(doc, e)}
                  onMouseLeave={handleDocumentLeave}
                >
                  <div className="document-info">
                    {doc.contentType === 'link' ? (
                      <span className="content-type-icon link-icon">🔗</span>
                    ) : doc.contentType === 'text' ? (
                      <span className="content-type-icon text-icon">📝</span>
                    ) : (
                      <File size={28} className="document-icon" />
                    )}
                    <div className="document-details">
                      <h4>{doc.name}</h4>
                      <p>
                        {doc.contentType === 'link' ? (
                          <span>
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="document-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Visit Link
                            </a> • {doc.type}
                          </span>
                        ) : (
                          <span>{formatFileSize(doc.size)} • {doc.type}</span>
                        )}
                      </p>
                      <small>Added {doc.uploadedAt.toLocaleDateString()}</small>
                      {/* Display all associated roles */}
                      {(() => {
                        const docRoles = doc.roleIds || ((doc as any).roleId ? [(doc as any).roleId] : [])
                        return docRoles.length > 0 && (
                          <div className="document-roles">
                            {docRoles.map((roleId: string) => {
                              const role = roles.find(r => r.id === roleId)
                              return role ? (
                                <small key={roleId} className="document-role">
                                  {role.name}
                                </small>
                              ) : null
                            })}
                          </div>
                        )
                      })()}
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
      
      {/* Document Preview Popup */}
      <AnimatePresence>
        {hoveredDocument && (
          <motion.div
            className="document-preview-popup"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              left: Math.min(previewPosition.x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 340),
              top: Math.min(previewPosition.y, (typeof window !== 'undefined' ? window.innerHeight : 800) - 220)
            }}
          >
            <div className="preview-header">
              <h4>{hoveredDocument.name}</h4>
              <span className="preview-type">{hoveredDocument.type}</span>
            </div>
            <div className="preview-content">
              <pre>{getPreviewContent(hoveredDocument)}</pre>
            </div>
            <div className="preview-footer">
              <small>Size: {formatFileSize(hoveredDocument.size)}</small>
              <small>Uploaded: {hoveredDocument.uploadedAt.toLocaleDateString()}</small>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Role Management Modal */}
      {isRoleModalOpen && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <h2>Role Management</h2>
            <p>Create and manage employee roles for document categorization</p>
            
            <div className="role-form">
              <div className="role-form-inputs">
                <input 
                  type="text" 
                  value={newRoleName} 
                  onChange={(e) => setNewRoleName(e.target.value)} 
                  placeholder="Role name (e.g., Sales Manager)"
                  className="role-input"
                />
                <input 
                  type="text" 
                  value={newRoleDescription} 
                  onChange={(e) => setNewRoleDescription(e.target.value)} 
                  placeholder="Role description (optional)"
                  className="role-input role-description-input"
                />
              </div>
              <motion.button
                onClick={createRole}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="role-add-btn"
                disabled={!newRoleName.trim()}
              >
                Add Role
              </motion.button>
            </div>
            
            <div className="role-list">
              <h3>Existing Roles</h3>
              {roles.length === 0 ? (
                <p>No roles created yet</p>
              ) : (
                <ul>
                  {roles.map(role => (
                    <li key={role.id} className="role-item">
                      <div className="role-item-content">
                        <span className="role-item-name">{role.name}</span>
                        {role.description && (
                          <small className="role-item-description">{role.description}</small>
                        )}
                      </div>
                      <motion.button
                        onClick={() => deleteRole(role.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="role-delete-btn"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="modal-actions">
              <motion.button
                onClick={() => setIsRoleModalOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="modal-close-btn"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard 