# CodeDoc Frontend - Quick Reference Cheat Sheet

## 🚀 Quick Start

### Tech Stack
- **React 18.2** + **TypeScript 5.4**
- **Vite 6.2** (Build Tool)
- **Socket.IO Client 4.7** (Real-time)
- **CodeMirror 6** (Code Editor)
- **Tailwind CSS 3.4** (Styling)
- **React Router 6.2** (Routing)

---

## 📐 Architecture at a Glance

```
App (Root)
  └── AppProvider (Context Tree)
      ├── SocketProvider
      ├── ViewContextProvider
      ├── FileContextProvider
      ├── ChatContextProvider
      └── Router
          ├── HomePage (/)
          └── EditorPage (/editor/:roomId)
```

---

## 🔑 Key Concepts

### 1. State Management (Context API)
```
AppContext      → Users, currentUser, status, activityState
SocketContext   → WebSocket connection
FileContext     → File system (tree structure)
ChatContext     → Chat messages
ViewContext     → Sidebar views
SettingContext  → Editor settings (theme, font, language)
```

### 2. Real-time Flow
```
User Action → Context Update → Socket Emit → Server → Broadcast → Other Clients
```

### 3. File System Structure
```typescript
FileSystemItem {
  id: string
  name: string
  type: "file" | "directory"
  content?: string              // Files only
  children?: FileSystemItem[]   // Directories only
  isOpen?: boolean              // Directories only
}
```

---

## 🎯 Common Interview Questions

### Q1: Why Context API over Redux?
**Answer:**
- Smaller bundle size (no external library)
- Less boilerplate
- Sufficient for this use case
- Better performance with scoped contexts
- Can migrate to Redux if needed

### Q2: How does real-time sync work?
**Answer:**
1. Optimistic updates (local state)
2. Socket emit to server
3. Server broadcasts to all clients
4. Last-write-wins conflict resolution
5. Full sync on user join

### Q3: How do you handle file conflicts?
**Answer:**
- Currently: Last-write-wins (simple)
- Could implement: Operational Transform (OT) or CRDT
- Could add: Version control, conflict indicators

### Q4: Performance optimizations?
**Answer:**
- `useMemo` for expensive calculations
- `useCallback` for event handlers
- Debouncing (1000ms for typing)
- Code splitting (Vite)
- Event cleanup on unmount

### Q5: How to scale this app?
**Answer:**
**Frontend:**
- Code splitting, lazy loading
- Virtual scrolling
- Web Workers
- Service Workers (offline)

**Backend:**
- Redis for room state
- Load balancing
- Horizontal scaling
- Message queue

### Q6: Security considerations?
**Answer:**
- Input validation
- XSS prevention (React escapes)
- Socket authentication
- Rate limiting (backend)
- File size limits
- Content sanitization

---

## 💻 Code Snippets

### Socket Connection
```typescript
const socket = useMemo(
  () => io(BACKEND_URL, { reconnectionAttempts: 2 }),
  []
)
```

### File Update with Debouncing
```typescript
const onCodeChange = (code: string) => {
  setActiveFile({ ...activeFile, content: code }) // Optimistic
  clearTimeout(timeOut)
  const newTimeOut = setTimeout(() => {
    socket.emit(SocketEvent.FILE_UPDATED, { fileId, newContent: code })
  }, 1000)
}
```

### Recursive Tree Traversal
```typescript
const updateFile = (directory: FileSystemItem): FileSystemItem => {
  if (directory.id === fileId) {
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

### Context Usage
```typescript
const { socket } = useSocket()
const { activeFile, updateFileContent } = useFileSystem()
const { messages, setMessages } = useChatRoom()
```

---

## 🔄 Socket Events

### Client → Server
- `JOIN_REQUEST` - Join room
- `FILE_UPDATED` - File content changed
- `FILE_CREATED` - New file created
- `FILE_DELETED` - File deleted
- `TYPING_START` - User started typing
- `TYPING_PAUSE` - User stopped typing
- `RECEIVE_MESSAGE` - Send chat message

### Server → Client
- `JOIN_ACCEPTED` - Join successful
- `USERNAME_EXISTS` - Username taken
- `USER_JOINED` - New user joined
- `USER_DISCONNECTED` - User left
- `FILE_UPDATED` - File updated (broadcast)
- `SYNC_FILE_STRUCTURE` - Sync on join

---

## 📦 Key Components

### 1. Editor (CodeMirror)
- Syntax highlighting (50+ languages)
- Multiple themes
- Font size customization
- Cursor tooltips (other users)
- Color picker, hyperlinks

### 2. File Management
- Create/delete/rename files
- Create/delete/rename directories
- Tree structure with recursion
- Open/close files (tabs)
- Download as ZIP

### 3. Chat System
- Real-time messaging
- Message history
- New message indicator
- Auto-scroll

### 4. Drawing Mode (tldraw)
- Collaborative whiteboard
- Vector graphics
- Built-in collaboration (Yjs)

### 5. Code Execution
- Piston API integration
- 50+ languages
- Output/error display
- Stdin support

---

## 🎨 Styling (Tailwind)

### Design System
```typescript
Colors:
  dark: "#0a0e27"
  darkHover: "#1a1f3a"
  darkLight: "#151b35"
  primary: "#6366f1" (indigo)
  secondary: "#8b5cf6" (purple)
  accent: "#ec4899" (pink)
```

### Custom Classes
```css
.card → Rounded card with border
.btn-primary → Gradient button
.input-modern → Modern input field
.text-gradient → Gradient text
.glass-effect → Backdrop blur
```

---

## 🚦 Data Flow Example

### User Types in Editor
```
1. User types character
2. onCodeChange() called
3. setActiveFile() → Local state update (optimistic)
4. socket.emit(FILE_UPDATED) → Send to server
5. Server validates & broadcasts
6. Other clients receive FILE_UPDATED
7. Other clients update their file content
```

### User Joins Room
```
1. User enters room ID & username
2. socket.emit(JOIN_REQUEST)
3. Server validates username
4. Server responds JOIN_ACCEPTED
5. Client receives file structure
6. Client syncs drawing data
7. Client updates user list
```

---

## 🔧 Custom Hooks

```typescript
useSocket()           → Socket connection
useFileSystem()       → File operations
useViews()            → Sidebar views
useChatRoom()         → Chat messages
useResponsive()       → Responsive logic
useWindowDimensions() → Window size
useLocalStorage()     → Local storage
useFullScreen()       → Fullscreen mode
```

---

## 📊 Performance Metrics

### Optimizations Applied
- ✅ Debouncing (1000ms)
- ✅ useMemo (filtered users)
- ✅ useCallback (event handlers)
- ✅ Code splitting (Vite)
- ✅ Event cleanup
- ✅ Optimistic updates

### Could Improve
- ⚠️ Delta updates (currently full content)
- ⚠️ Virtual scrolling (file list)
- ⚠️ Lazy loading (components)
- ⚠️ React.memo (components)
- ⚠️ Web Workers (heavy computations)

---

## 🛡️ Error Handling

### Current Implementation
- Try-catch for async operations
- Socket error handling
- Toast notifications
- Connection status page
- Fallback UI

### Could Add
- React Error Boundaries
- Retry logic
- Error logging (Sentry)
- User feedback system

---

## 🎯 Interview Talking Points

### Strengths
1. **Real-time Collaboration** - Socket.IO implementation
2. **State Management** - Context API with separation
3. **Code Editor** - CodeMirror with extensions
4. **File System** - Recursive tree operations
5. **Performance** - Debouncing, memoization
6. **Type Safety** - TypeScript throughout
7. **Responsive** - Mobile & desktop support

### Improvements
1. Operational Transform (OT) for conflicts
2. CRDT for conflict-free merging
3. Error boundaries
4. Testing (unit, integration, E2E)
5. Authentication (JWT)
6. Virtual scrolling
7. Delta updates

---

## 📚 Key Files

```
src/
  App.tsx                    → Root component, routing
  main.tsx                   → Entry point
  context/
    AppProvider.tsx         → Context composition
    SocketContext.tsx       → WebSocket management
    FileContext.tsx         → File system state
    ChatContext.tsx         → Chat state
  components/
    editor/Editor.tsx       → CodeMirror wrapper
    sidebar/Sidebar.tsx     → Navigation
    workspace/index.tsx     → Main workspace
  pages/
    HomePage.tsx            → Landing page
    EditorPage.tsx          → Editor page
```

---

## 🎓 Study Checklist

- [ ] Understand Context API pattern
- [ ] Know Socket.IO event flow
- [ ] Understand file system structure
- [ ] Know performance optimizations
- [ ] Understand debouncing
- [ ] Know TypeScript types
- [ ] Understand responsive design
- [ ] Know error handling
- [ ] Understand state management
- [ ] Know scalability considerations

---

**Quick Tips:**
1. Always mention optimistic updates
2. Explain debouncing for performance
3. Discuss Context API trade-offs
4. Mention scalability improvements
5. Highlight TypeScript benefits
6. Discuss real-time challenges
7. Mention performance optimizations
8. Explain data flow clearly

---

**Good luck! 🚀**

