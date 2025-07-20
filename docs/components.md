# Component Documentation

This document provides detailed information about each component in the OnboardAI application.

## App Component

**File Path:** `/src/App.tsx`

**Purpose:** The root component that handles routing between the main chat interface and admin dashboard.

**Key Features:**
- Uses React Router for navigation
- Routes:
  - `/`: Main chat interface (ChatApp)
  - `/admin`: Admin dashboard (AdminDashboard)

**Dependencies:**
- React Router DOM

## ChatApp Component

**File Path:** `/src/components/ChatApp.tsx`

**Purpose:** The main user-facing interface for interacting with the AI assistant.

**Key Features:**
- Manages conversation state and message history
- Handles API calls to OpenAI
- Displays the conversation interface and mascot

**Props:** None

**State:**
- `messages`: Array of message objects with fields for id, text, sender, and timestamp
- `isTyping`: Boolean indicating whether the AI is "typing"
- `error`: String containing any error messages

**Methods:**
- `callChatGPT`: Async function that sends user messages to the OpenAI API
- `handleSendMessage`: Processes user input and updates the conversation

**API Integration:**
- Connects to OpenAI's API using the gpt-3.5-turbo model
- Uses a system prompt to define the assistant's role and behavior
- Maintains conversation context by sending recent message history

**Dependencies:**
- Requires VITE_OPENAI_API_KEY environment variable

## ChatInterface Component

**File Path:** `/src/components/ChatInterface.tsx`

**Purpose:** Displays the chat conversation and provides an input field for user messages.

**Key Features:**
- Renders message bubbles with appropriate styling for user and AI messages
- Shows a typing indicator when the AI is processing a response
- Handles user input and submission
- Automatically scrolls to the latest message

**Props:**
- `messages`: Array of message objects to display
- `onSendMessage`: Callback function for sending new messages
- `isTyping`: Boolean indicating if the AI is currently "typing"
- `disabled`: Optional boolean to disable input (e.g., when API key is missing)

**Animations:**
- Uses Framer Motion for smooth animations when messages appear and disappear
- Typing indicator animation for visual feedback

**Dependencies:**
- Framer Motion for animations
- Lucide React for icons

## Mascot Component

**File Path:** `/src/components/Mascot.tsx`

**Purpose:** Provides a visual representation of the AI assistant with animated states.

**Key Features:**
- Multiple animation states: idle, thinking, typing, excited, curious
- Responds to user interaction (hover, click)
- Visual feedback coordinated with the chat state

**Props:**
- `isTyping`: Boolean indicating if the AI is currently processing a response

**State:**
- `isHovered`: Boolean tracking mouse hover state
- `mascotState`: String indicating current animation state

**Animation Methods:**
- `getStateAnimations`: Returns animation properties for the mascot body
- `getEyeAnimations`: Returns animation properties for the mascot's eyes
- `getPupilAnimations`: Returns animation properties for the mascot's pupils
- `getMouthAnimations`: Returns animation properties for the mascot's mouth
- `getPulseAnimations`: Returns animation properties for the pulse effect

**Dependencies:**
- Framer Motion for complex animations

## AdminDashboard Component

**File Path:** `/src/components/AdminDashboard.tsx`

**Purpose:** Provides an interface for administrators to manage onboarding documents.

**Key Features:**
- Document upload with drag-and-drop support
- File type validation
- Document storage using IndexedDB
- Document listing with metadata
- Download and delete functionality

**State:**
- `documents`: Array of document objects stored in IndexedDB
- `isDragOver`: Boolean for drag-and-drop UI feedback
- `isUploading`: Boolean indicating upload in progress
- `uploadProgress`: Number tracking upload progress percentage

**Database Methods:**
- `initializeDB`: Sets up the IndexedDB database structure
- `loadDocuments`: Retrieves documents from IndexedDB
- `saveDocument`: Stores a new document in IndexedDB
- `deleteDocument`: Removes a document from IndexedDB

**File Handling:**
- `handleFileUpload`: Processes file uploads and stores in IndexedDB
- `readFileContent`: Extracts content from uploaded files
- `downloadDocument`: Facilitates document download

**Dependencies:**
- IndexedDB for document storage
- Framer Motion for animations
- Lucide React for icons
