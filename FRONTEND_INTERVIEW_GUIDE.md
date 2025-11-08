# CodeDoc Frontend - Complete Interview Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Design Patterns](#architecture--design-patterns)
4. [State Management](#state-management)
5. [Real-time Communication](#real-time-communication)
6. [Key Features & Implementation](#key-features--implementation)
7. [Code Organization](#code-organization)
8. [Performance Optimizations](#performance-optimizations)
9. [Interview Questions & Answers](#interview-questions--answers)
10. [Best Practices](#best-practices)
11. [Areas for Improvement](#areas-for-improvement)

---

## 🎯 Project Overview

**CodeDoc** is a real-time collaborative code editor built with React and TypeScript. It allows multiple users to:
- Edit code together in real-time
- Chat with team members
- Share files and folders
- Run code in the browser
- Draw/write on a shared canvas
- Preview HTML files

### Core Functionality
- **Real-time Code Editing**: Multiple users can edit the same file simultaneously
- **File Management**: Create, delete, rename files and folders
- **Team Collaboration**: Chat, see active users, and their cursor positions
- **Code Execution**: Run code using external APIs (Piston API)
- **Drawing Mode**: Collaborative whiteboard using tldraw
- **Settings**: Customize editor theme, font size, language syntax

---

## 🛠 Technology Stack

### Core Technologies
```json
{
  "framework": "React 18.2.0",
  "language": "TypeScript 5.4.5",
  "buildTool": "Vite 6.2.2",
  "styling": "Tailwind CSS 3.4.1",
  "routing": "React Router DOM 6.22.3"
}
```

### Key Libraries

#### 1. **Code Editor**
- `@uiw/react-codemirror` (v4.21.21): React wrapper for CodeMirror 6
- `codemirror` (v6.0.1): Advanced code editor with syntax highlighting
- **Why?** Provides real-time syntax highlighting, multiple language support, and extensibility

#### 2. **Real-time Communication**
- `socket.io-client` (v4.7.3): WebSocket client for real-time updates
- **Why?** Handles reconnection, rooms, and bidirectional communication efficiently

#### 3. **UI Components**
- `react-icons` (v5.2.1): Icon library
- `react-hot-toast` (v2.4.1): Toast notifications
- `react-tooltip` (v5.28.0): Tooltip component
- `react-split` (v2.0.14): Resizable split panes
- `react-avatar` (v5.0.3): User avatars

#### 4. **File Operations**
- `file-saver` (v2.0.5): Download files
- `jszip` (v3.10.1): Create zip files for bulk downloads
- `uuid` (v9.0.1): Generate unique IDs

#### 5. **Drawing/Whiteboard**
- `tldraw` (v2.1.4): Collaborative drawing board
- **Why?** Provides real-time collaborative drawing with vector graphics

#### 6. **Code Execution**
- `axios` (v1.8.2): HTTP client for API calls
- External APIs: Piston API (code execution), Pollinations API (image generation)

### Development Tools
- **Vite**: Fast build tool with HMR (Hot Module Replacement)
- **TypeScript**: Type safety and better developer experience
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first CSS framework

---

## 🏗 Architecture & Design Patterns

### 1. **Component Architecture**

#### Component Hierarchy
```
App
├── AppProvider (Context Provider Tree)
│   ├── Router
│   │   ├── HomePage
│   │   │   └── FormComponent
│   │   └── EditorPage
│   │       └── SplitterComponent
│   │           ├── Sidebar
│   │           │   ├── SidebarButton (Navigation)
│   │           │   └── View Components (Files, Chat, etc.)
│   │           └── WorkSpace
│   │               ├── EditorComponent
│   │               │   ├── FileTab
│   │               │   └── Editor (CodeMirror)
│   │               └── DrawingEditor (tldraw)
│   ├── Toast (Global)
│   └── GitHubCorner (Global)
```

### 2. **Design Patterns Used**

#### a) **Context API Pattern (State Management)**
```typescript
// Multiple contexts for separation of concerns
AppContext → Global app state (users, currentUser, status)
SocketContext → WebSocket connection management
FileContext → File system operations
ChatContext → Chat messages
ViewContext → Sidebar view management
SettingContext → Editor settings
```

**Interview Question: Why multiple contexts instead of Redux?**
- **Answer**: 
  - Smaller bundle size (no external library)
  - Better performance for this use case (contexts are scoped)
  - Simpler for team collaboration features
  - Each context handles a specific domain (separation of concerns)

#### b) **Provider Composition Pattern**
```typescript
// AppProvider.tsx - Nested providers
<AppContextProvider>
  <SocketProvider>
    <SettingContextProvider>
      <ViewContextProvider>
        <FileContextProvider>
          {/* ... */}
        </FileContextProvider>
      </ViewContextProvider>
    </SettingContextProvider>
  </SocketProvider>
</AppContextProvider>
```

**Why this order?**
- `AppContext` is the base (users, status)
- `SocketProvider` depends on `AppContext`
- Other contexts depend on `SocketProvider`
- Creates a dependency hierarchy

#### c) **Custom Hooks Pattern**
```typescript
// Reusable logic extraction
useSocket() → Access socket connection
useFileSystem() → File operations
useViews() → Sidebar view management
useResponsive() → Responsive design logic
useWindowDimensions() → Window size tracking
useLocalStorage() → Local storage operations
```

**Benefits:**
- Reusability
- Separation of concerns
- Easy testing
- Clean component code

#### d) **Event-Driven Architecture**
```typescript
// Socket events for real-time updates
SocketEvent.JOIN_REQUEST → User joins room
SocketEvent.FILE_UPDATED → File content changes
SocketEvent.TYPING_START → User starts typing
SocketEvent.RECEIVE_MESSAGE → New chat message
```

---

## 📦 State Management

### Context Structure

#### 1. **AppContext** (Global State)
```typescript
interface AppContextType {
  users: RemoteUser[]           // All users in room
  currentUser: User              // Current user
  status: USER_STATUS            // Connection status
  activityState: ACTIVITY_STATE  // Coding or Drawing
  drawingData: DrawingData       // Drawing state
  setUsers: (users: RemoteUser[]) => void
  setCurrentUser: (user: User) => void
  setStatus: (status: USER_STATUS) => void
  setActivityState: (state: ACTIVITY_STATE) => void
  setDrawingData: (data: DrawingData) => void
}
```

**State Flow:**
```
User Action → Context Update → Socket Emit → Server → Broadcast → Other Clients
```

#### 2. **FileContext** (File System State)
```typescript
interface FileContextType {
  fileStructure: FileSystemItem    // Tree structure
  openFiles: FileSystemItem[]      // Currently open files
  activeFile: FileSystemItem | null // Currently editing file
  // Operations
  createFile, deleteFile, renameFile
  createDirectory, deleteDirectory
  updateFileContent, openFile, closeFile
}
```

**Data Structure:**
```typescript
interface FileSystemItem {
  id: string
  name: string
  type: "file" | "directory"
  content?: string              // Only for files
  children?: FileSystemItem[]   // Only for directories
  isOpen?: boolean              // Only for directories
}
```

**Interview Question: How do you handle file synchronization?**
- **Answer:**
  1. **Optimistic Updates**: Update local state immediately
  2. **Socket Events**: Emit changes to server
  3. **Broadcast**: Server broadcasts to all clients
  4. **Conflict Resolution**: Last write wins (simple approach)
  5. **Sync on Join**: New users receive full file structure

#### 3. **SocketContext** (WebSocket Management)
```typescript
interface SocketContextType {
  socket: Socket
}
```

**Connection Lifecycle:**
```typescript
1. User enters room → socket.connect()
2. Emit JOIN_REQUEST → Server validates
3. Server responds → JOIN_ACCEPTED or USERNAME_EXISTS
4. On disconnect → Automatic reconnection (2 attempts)
5. On error → CONNECTION_FAILED status
```

**Event Handling:**
```typescript
// Subscribe to events
socket.on(SocketEvent.FILE_UPDATED, handleFileUpdate)

// Cleanup on unmount
useEffect(() => {
  return () => {
    socket.off(SocketEvent.FILE_UPDATED)
  }
}, [socket])
```

---

## 🔄 Real-time Communication

### Socket.IO Implementation

#### Connection Setup
```typescript
// SocketContext.tsx
const socket = useMemo(
  () => io(BACKEND_URL, {
    reconnectionAttempts: 2,
  }),
  []
)
```

**Why useMemo?**
- Prevents socket recreation on every render
- Maintains connection across re-renders
- Singleton pattern for socket instance

#### Event Flow

##### 1. **User Joining**
```
Client → JOIN_REQUEST { username, roomId }
Server → Validates username
Server → JOIN_ACCEPTED { user, users[] }
Client → Updates state, syncs file structure
```

##### 2. **File Editing**
```
User types → onCodeChange()
  → Update local state (optimistic)
  → Emit FILE_UPDATED { fileId, newContent }
  → Emit TYPING_START { cursorPosition }
Server → Broadcasts to other clients
Other clients → Update their file content
```

##### 3. **Typing Indicators**
```typescript
// Debounced typing events
onCodeChange() → Emit TYPING_START
setTimeout(1000ms) → Emit TYPING_PAUSE
```

**Why debounce?**
- Reduces server load
- Prevents excessive socket events
- Better performance

#### Cursor Synchronization
```typescript
// Editor.tsx - Show other users' cursors
tooltipField(filteredUsers) // CodeMirror extension
// Shows tooltip with username at cursor position
```

**How it works:**
1. User moves cursor → Emit cursor position
2. Server broadcasts to others
3. CodeMirror extension renders tooltip
4. Shows username at cursor position

---

## ✨ Key Features & Implementation

### 1. **Code Editor (CodeMirror)**

#### Features
- Syntax highlighting (50+ languages)
- Multiple themes
- Font size customization
- Color picker extension
- Hyperlink detection
- Cursor tooltips (show other users)

#### Implementation
```typescript
// Editor.tsx
<CodeMirror
  theme={editorThemes[theme]}
  onChange={onCodeChange}
  value={activeFile?.content}
  extensions={[
    color,                    // Color picker
    hyperLink,                // Clickable links
    tooltipField(users),      // Cursor tooltips
    scrollPastEnd(),          // Scroll beyond end
    loadLanguage(language)    // Syntax highlighting
  ]}
/>
```

**Interview Question: How do you handle large files?**
- **Answer:**
  - CodeMirror handles virtualization internally
  - We debounce updates (1000ms)
  - Only send deltas (but current implementation sends full content)
  - Could implement Operational Transform (OT) or CRDT for better performance

### 2. **File Management**

#### File Operations
```typescript
// Recursive tree traversal
createFile(parentDirId, fileName)
deleteFile(fileId)
renameFile(fileId, newName)
updateFileContent(fileId, content)

// Directory operations
createDirectory(parentDirId, dirName)
deleteDirectory(dirId)  // Recursive deletion
renameDirectory(dirId, newName)
toggleDirectory(dirId)  // Expand/collapse
```

#### Tree Traversal Pattern
```typescript
// Recursive function to update nested structure
const updateFile = (directory: FileSystemItem): FileSystemItem => {
  if (directory.type === "file" && directory.id === fileId) {
    return { ...directory, content: newContent }
  } else if (directory.children) {
    return {
      ...directory,
      children: directory.children.map(updateFile)
    }
  }
  return directory
}
```

**Interview Question: How do you handle file conflicts?**
- **Answer:**
  - Currently: Last write wins (simple)
  - Better approach: Operational Transform or CRDT
  - Could implement version control
  - Could show conflict indicators

### 3. **Chat System**

#### Implementation
```typescript
// ChatContext.tsx
const [messages, setMessages] = useState<ChatMessage[]>([])
const [isNewMessage, setIsNewMessage] = useState<boolean>(false)

// Receive message
socket.on(SocketEvent.RECEIVE_MESSAGE, ({ message }) => {
  setMessages(prev => [...prev, message])
  setIsNewMessage(true)  // Show notification badge
})
```

**Features:**
- Real-time messaging
- Message history (in-memory)
- New message indicator
- Auto-scroll to bottom

### 4. **Drawing Mode (tldraw)**

#### Implementation
```typescript
// DrawingEditor.tsx
import { Tldraw } from "tldraw"

<Tldraw
  store={store}
  // Collaborative features built-in
/>
```

**How collaboration works:**
- tldraw has built-in collaboration
- Uses Yjs (CRDT) internally
- Syncs drawing data via socket

### 5. **Code Execution**

#### Piston API Integration
```typescript
// RunView.tsx
const runCode = async () => {
  const response = await axios.post(PISTON_API_URL, {
    language: selectedLanguage,
    code: activeFile.content
  })
  // Display output
}
```

**Features:**
- Execute code in 50+ languages
- Show output/errors
- Support for stdin
- Timeout handling

### 6. **Responsive Design**

#### Implementation
```typescript
// useResponsive.tsx
const useResponsive = () => {
  const { width } = useWindowDimensions()
  const isMobile = width < 768
  const viewHeight = isMobile 
    ? "calc(100vh - 60px)" 
    : "100vh"
  return { isMobile, viewHeight, minHeightReached }
}
```

**Breakpoints:**
- Mobile: < 768px (bottom navigation)
- Desktop: >= 768px (sidebar navigation)

---

## 📁 Code Organization

### Folder Structure
```
src/
├── api/              # External API integrations
│   ├── pistonApi.ts
│   └── pollinationsApi.ts
├── assets/           # Static assets
├── components/       # React components
│   ├── chats/       # Chat components
│   ├── common/      # Shared components
│   ├── connection/  # Connection status
│   ├── drawing/     # Drawing editor
│   ├── editor/      # Code editor
│   ├── files/       # File management
│   ├── forms/       # Form components
│   ├── sidebar/     # Sidebar components
│   └── workspace/   # Workspace layout
├── context/          # React contexts
├── hooks/            # Custom hooks
├── pages/            # Page components
├── resources/        # Themes, fonts
├── styles/           # Global styles
├── types/            # TypeScript types
└── utils/            # Utility functions
```

### Naming Conventions
- **Components**: PascalCase (`EditorComponent.tsx`)
- **Hooks**: camelCase with `use` prefix (`useSocket.tsx`)
- **Utils**: camelCase (`formateDate.ts`)
- **Types**: PascalCase (`FileSystemItem`)
- **Constants**: UPPER_SNAKE_CASE (`SocketEvent`)

### Import Aliases
```typescript
// tsconfig.json
"paths": {
  "@/*": ["src/*"]
}

// Usage
import { useSocket } from "@/context/SocketContext"
```

**Benefits:**
- Cleaner imports
- Easy refactoring
- Better IDE support

---

## ⚡ Performance Optimizations

### 1. **React Optimizations**

#### useMemo for Expensive Calculations
```typescript
// Filter users only when users/currentUser changes
const filteredUsers = useMemo(
  () => users.filter(u => u.username !== currentUser.username),
  [users, currentUser]
)
```

#### useCallback for Event Handlers
```typescript
// Prevent function recreation
const handleFileUpdate = useCallback((fileId, content) => {
  // ...
}, [dependencies])
```

#### Lazy Loading (Potential)
```typescript
// Could implement for large components
const DrawingEditor = lazy(() => import("./DrawingEditor"))
```

### 2. **Code Splitting**

#### Vite Configuration
```typescript
// vite.config.mts
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        // Split node_modules into separate chunks
        if (id.includes("node_modules")) {
          return id.split("node_modules/")[1].split("/")[0]
        }
      }
    }
  }
}
```

**Benefits:**
- Smaller initial bundle
- Better caching
- Parallel loading

### 3. **Debouncing**

#### Typing Events
```typescript
// Editor.tsx
const onCodeChange = (code: string) => {
  // Update immediately (optimistic)
  setActiveFile({ ...activeFile, content: code })
  
  // Debounce socket emit
  clearTimeout(timeOut)
  const newTimeOut = setTimeout(() => {
    socket.emit(SocketEvent.FILE_UPDATED, { fileId, newContent: code })
  }, 1000)
}
```

### 4. **Socket Optimization**

#### Event Cleanup
```typescript
useEffect(() => {
  socket.on(SocketEvent.FILE_UPDATED, handleUpdate)
  
  return () => {
    socket.off(SocketEvent.FILE_UPDATED)  // Cleanup
  }
}, [socket])
```

**Why important?**
- Prevents memory leaks
- Avoids duplicate listeners
- Better performance

---

## 🎤 Interview Questions & Answers

### 1. **Why did you choose React Context over Redux?**

**Answer:**
- **Smaller bundle size**: No external library needed
- **Simplicity**: Less boilerplate for this use case
- **Scoped state**: Each context handles specific domain
- **Performance**: Context updates only affect consuming components
- **Team size**: For small teams, Context API is sufficient
- **Future-proof**: Can migrate to Redux if needed

**Trade-offs:**
- ❌ No time-travel debugging
- ❌ No middleware (but can use useEffect)
- ❌ Potential performance issues with frequent updates (mitigated by context splitting)

### 2. **How do you handle real-time synchronization?**

**Answer:**
1. **Optimistic Updates**: Update local state immediately
2. **Socket Events**: Emit changes to server
3. **Broadcast**: Server broadcasts to all clients
4. **Conflict Resolution**: Currently last-write-wins
5. **Sync on Join**: New users receive full state

**Improvements:**
- Implement Operational Transform (OT)
- Use CRDT (Conflict-free Replicated Data Types)
- Add version control
- Show conflict indicators

### 3. **How would you scale this application?**

**Answer:**

**Frontend:**
- Code splitting and lazy loading
- Virtual scrolling for large file lists
- Web Workers for heavy computations
- Service Workers for offline support
- CDN for static assets

**Backend:**
- Redis for room state (instead of in-memory)
- Load balancing
- Horizontal scaling
- Database for persistent storage
- Message queue (RabbitMQ/Kafka)

**Real-time:**
- Socket.IO with Redis adapter
- Room-based scaling
- Rate limiting
- Connection pooling

### 4. **How do you handle errors?**

**Answer:**
- **Try-catch blocks**: For async operations
- **Error boundaries**: For React errors (could add)
- **Socket error handling**: Connection failures
- **Toast notifications**: User-friendly error messages
- **Fallback UI**: Connection status page

**Improvements:**
- Add React Error Boundaries
- Implement retry logic
- Log errors to monitoring service (Sentry)
- User feedback system

### 5. **How would you optimize for large files?**

**Answer:**
- **Virtualization**: CodeMirror handles this
- **Delta updates**: Send only changes (not full content)
- **Debouncing**: Already implemented (1000ms)
- **Chunking**: Split large files into chunks
- **Lazy loading**: Load file content on demand
- **Compression**: Compress socket messages

### 6. **Explain the file system data structure.**

**Answer:**
```typescript
interface FileSystemItem {
  id: string                    // UUID
  name: string                  // File/directory name
  type: "file" | "directory"   // Type discriminator
  content?: string              // File content (only files)
  children?: FileSystemItem[]   // Nested items (only directories)
  isOpen?: boolean              // Directory expansion state
}
```

**Tree Structure:**
- Root directory contains children
- Recursive structure for nested directories
- Immutable updates (create new objects)
- Efficient traversal with recursive functions

### 7. **How do you ensure type safety?**

**Answer:**
- **TypeScript**: Strict mode enabled
- **Type definitions**: All interfaces defined in `types/`
- **Generic types**: Reusable type definitions
- **Type guards**: Runtime type checking
- **Strict null checks**: Prevent null/undefined errors

### 8. **What are the security considerations?**

**Answer:**
- **Input validation**: Validate file names, content
- **XSS prevention**: React escapes by default
- **Socket authentication**: Validate user on join
- **Rate limiting**: Prevent spam (backend)
- **File size limits**: Prevent large file uploads
- **Content sanitization**: For HTML preview

**Improvements:**
- Add JWT authentication
- Implement CSP (Content Security Policy)
- Sanitize user inputs
- Add file type validation
- Implement permission system

---

## ✅ Best Practices

### 1. **Code Organization**
- ✅ Separation of concerns (contexts, components, hooks)
- ✅ Consistent naming conventions
- ✅ TypeScript for type safety
- ✅ Import aliases for clean imports

### 2. **React Patterns**
- ✅ Custom hooks for reusable logic
- ✅ Context API for state management
- ✅ Functional components
- ✅ Hooks for side effects

### 3. **Performance**
- ✅ useMemo for expensive calculations
- ✅ useCallback for event handlers
- ✅ Debouncing for frequent updates
- ✅ Code splitting with Vite

### 4. **Real-time Communication**
- ✅ Event cleanup on unmount
- ✅ Error handling
- ✅ Reconnection logic
- ✅ Optimistic updates

### 5. **User Experience**
- ✅ Loading states
- ✅ Error messages
- ✅ Toast notifications
- ✅ Responsive design

---

## 🔮 Areas for Improvement

### 1. **State Management**
- [ ] Add React Error Boundaries
- [ ] Implement undo/redo functionality
- [ ] Add state persistence (localStorage)
- [ ] Consider Redux for complex state

### 2. **Performance**
- [ ] Implement virtual scrolling for file list
- [ ] Add lazy loading for components
- [ ] Optimize re-renders with React.memo
- [ ] Implement delta updates (not full content)

### 3. **Real-time Sync**
- [ ] Implement Operational Transform (OT)
- [ ] Use CRDT for conflict-free merging
- [ ] Add version control
- [ ] Show conflict indicators

### 4. **Security**
- [ ] Add JWT authentication
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] File type validation

### 5. **Testing**
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Playwright/Cypress)
- [ ] Socket.IO testing

### 6. **Accessibility**
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast

### 7. **Documentation**
- [ ] API documentation
- [ ] Component documentation
- [ ] Architecture diagrams
- [ ] Deployment guide

---

## 📚 Key Takeaways for Interviews

### What to Highlight:
1. **Real-time Collaboration**: Socket.IO implementation
2. **State Management**: Context API with multiple contexts
3. **Code Editor**: CodeMirror integration with extensions
4. **File System**: Recursive tree operations
5. **Performance**: Debouncing, memoization, code splitting
6. **TypeScript**: Type safety throughout
7. **Responsive Design**: Mobile and desktop support

### Common Questions:
- **Why React?** Component-based, large ecosystem, great for real-time apps
- **Why Context API?** Simpler, smaller bundle, sufficient for this use case
- **Why Socket.IO?** Handles reconnection, rooms, fallbacks automatically
- **Why CodeMirror?** Advanced features, extensibility, performance
- **Why Vite?** Fast HMR, smaller bundle, better DX

### Technical Depth:
- Understand the data flow (User → Context → Socket → Server → Broadcast)
- Know the file system structure and operations
- Understand socket event lifecycle
- Know performance optimizations applied
- Understand trade-offs of chosen solutions

---

## 🚀 Deployment Considerations

### Build Process
```bash
npm run build  # TypeScript compilation + Vite build
```

### Environment Variables
```env
VITE_BACKEND_URL=http://localhost:3000
```

### Production Optimizations
- Minification
- Tree shaking
- Code splitting
- Asset optimization
- CDN deployment

---

## 📖 Additional Resources

### Learning Path:
1. React Hooks (useState, useEffect, useContext, useMemo, useCallback)
2. TypeScript (types, interfaces, generics)
3. Socket.IO (events, rooms, reconnection)
4. CodeMirror (extensions, themes, API)
5. Tailwind CSS (utility classes, responsive design)
6. Vite (build tool, HMR, plugins)

### Related Technologies:
- **Yjs**: CRDT for collaborative editing
- **Operational Transform**: For conflict resolution
- **WebRTC**: For peer-to-peer communication
- **IndexedDB**: For local storage
- **Service Workers**: For offline support

---

## 🎓 Conclusion

This frontend demonstrates:
- ✅ Modern React patterns
- ✅ Real-time collaboration
- ✅ Complex state management
- ✅ Performance optimizations
- ✅ Type safety with TypeScript
- ✅ Responsive design
- ✅ Clean code organization

**Key Strengths:**
- Well-organized codebase
- Type-safe implementation
- Real-time features
- Good user experience
- Performance considerations

**Interview Confidence:**
With this understanding, you can confidently discuss:
- Architecture decisions
- Implementation details
- Performance optimizations
- Scalability considerations
- Trade-offs and improvements

---

**Good luck with your interviews! 🚀**

