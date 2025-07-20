# Technical Architecture

## Technology Stack

OnboardAI is built using the following technologies:

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **UI Animation**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: OpenAI API (gpt-3.5-turbo model)
- **Client-side Storage**: IndexedDB
- **Styling**: CSS with custom styling

## System Architecture

The application follows a client-side architecture with the following components:

```
OnboardAI
│
├── App                      # Main application container with routing
│   ├── ChatApp              # User-facing chat interface
│   │   ├── ChatInterface    # Message display and input handling
│   │   └── Mascot           # Animated visual assistant
│   │
│   └── AdminDashboard       # Document management interface
│
├── External APIs
│   └── OpenAI API           # Natural language processing
│
└── Storage
    └── IndexedDB            # Client-side document storage
```

## Data Flow

1. **User Input**: The user enters a question or request via the ChatInterface component
2. **Request Processing**: 
   - User input is sent to the OpenAI API along with system prompt and conversation context
   - API key is retrieved from environment variables
3. **AI Response**: 
   - The OpenAI API processes the request and returns a response
   - Response is displayed to the user in the ChatInterface
4. **Document Management**:
   - Administrators can upload documents through the AdminDashboard
   - Documents are stored in IndexedDB for persistence
   - Document content can potentially be used to enhance AI responses (not currently implemented)

## Component Communication

Components communicate primarily through props and state management within React's component hierarchy. The application does not use any global state management libraries, with state being managed at the component level.

## Environment Variables

The application requires the following environment variables:

- `VITE_OPENAI_API_KEY`: API key for accessing OpenAI's services

## Browser Storage

The application uses IndexedDB for document storage with the following structure:

- Database: 'OnboardAIDB'
- Object Store: 'documents'
- Index: 'uploadedAt'

## Security Considerations

- API keys are stored in environment variables, not hardcoded in the application
- Client-side only architecture means there's no backend server to secure
- Document storage is limited to the user's browser

## Future Architecture Considerations

Potential architectural improvements could include:

1. Server-side component to securely handle API keys and requests
2. Database integration for persistent storage across devices
3. Authentication system for better security and user management
4. Vector database for semantic search capabilities on uploaded documents
