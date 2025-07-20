import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, Trash2, Download, Settings } from 'lucide-react'

interface Role {
  id: string
  name: string
}

interface Document {
  id: string
  name: string
  type: string
  size: number
  content: string
  uploadedAt: Date
  roleIds?: string[]  // Support multiple roles per document
}

function AdminDashboard() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [hoveredDocument, setHoveredDocument] = useState<Document | null>(null)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
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
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          content,
          uploadedAt: new Date(),
          roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined
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
          name: newRoleName.trim()
        }
        
        store.add(role)
        
        transaction.oncomplete = () => {
          loadRoles()
          setNewRoleName('')
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
      setPreviewPosition({
        x: rect.right + 10,
        y: rect.top
      })
      setHoveredDocument(doc)
    }, 500) // 500ms delay
    
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
    // Check if it's a text-based file
    const isTextFile = doc.type.startsWith('text/') || 
                      doc.type === 'application/json' ||
                      doc.name.endsWith('.md') ||
                      doc.name.endsWith('.txt')
    
    if (isTextFile) {
      // For text files, show first 500 characters
      return doc.content.substring(0, 500) + (doc.content.length > 500 ? '...' : '')
    } else {
      return `Preview not available for ${doc.type} files. File size: ${formatFileSize(doc.size)}`
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
                      <span>{role.name}</span>
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
              <Settings size={16} />
            </motion.button>
          </div>
          
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
          <div className="status-dot connected"></div>
          <span>Admin Dashboard</span>
        </div>
      </header>
      
      <main className="admin-main">
        <div className="admin-content">
          {/* Upload Section */}
          <div className="upload-section">
            <h2>Document Management {selectedRoleIds.length > 0 ? `for ${selectedRoleIds.length} Selected Role${selectedRoleIds.length > 1 ? 's' : ''}` : ''}</h2>
            <p>Upload onboarding documents to enhance the AI assistant's knowledge{selectedRoleIds.length > 0 ? ` for the selected role${selectedRoleIds.length > 1 ? 's' : ''}` : ' for all roles'}</p>
            
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
                    <File size={24} className="document-icon" />
                    <div className="document-details">
                      <h4>{doc.name}</h4>
                      <p>{formatFileSize(doc.size)} • {doc.type}</p>
                      <small>Uploaded {doc.uploadedAt.toLocaleDateString()}</small>
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
      {hoveredDocument && (
        <motion.div
          className="document-preview-popup"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          style={{
            left: Math.min(previewPosition.x, window.innerWidth - 320),
            top: Math.min(previewPosition.y, window.innerHeight - 200)
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
              <input 
                type="text" 
                value={newRoleName} 
                onChange={(e) => setNewRoleName(e.target.value)} 
                placeholder="Enter new role name"
                className="role-input"
              />
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
                      <span>{role.name}</span>
                      <motion.button
                        onClick={() => deleteRole(role.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="role-delete-btn"
                      >
                        <Trash2 size={16} />
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