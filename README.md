# Markdown Preview PWA

A beautiful, modern Progressive Web App for editing, previewing, and managing markdown files with offline support.

![Markdown Preview](https://img.shields.io/badge/PWA-Enabled-8a50ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge&logo=vite)

## ✨ Features

### Core Functionality
- 📝 **Live Markdown Preview** - See your markdown rendered in real-time as you type
- 💾 **Auto-Save** - Files automatically saved to localStorage
- 📁 **Multiple Files** - Create and manage multiple markdown documents
- ⬇️ **Export** - Download your markdown files to your computer
- 🎨 **Beautiful UI** - Modern dark theme with vibrant gradients and smooth animations

### PWA Features
- 📱 **Installable** - Install as a standalone app on any device
- 🔄 **Auto-Updates** - Automatic service worker updates with user notification
- 💨 **Offline Support** - Works completely offline after first visit
- ⚡ **Fast Loading** - Cached assets for instant loading
- 🎯 **App-like Experience** - Runs in standalone mode without browser chrome

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app runs on `http://localhost:5173/` by default. The PWA features are enabled in development mode for testing.

## 📱 Installing as PWA

### Desktop (Chrome, Edge, Brave)
1. Open the app in your browser
2. Click the install prompt in the bottom-right corner, or
3. Click the install icon in the address bar
4. Click "Install" in the confirmation dialog

### Mobile (iOS Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Mobile (Android Chrome)
1. Open the app in Chrome
2. Tap the install prompt, or
3. Tap the menu (⋮) and select "Install app"
4. Tap "Install" in the confirmation dialog

## 🎨 Markdown Syntax Support

The app supports full GitHub Flavored Markdown (GFM):

- **Headers** - `# H1` through `###### H6`
- **Emphasis** - `*italic*`, `**bold**`, `~~strikethrough~~`
- **Lists** - Ordered and unordered lists with nesting
- **Links** - `[text](url)`
- **Images** - `![alt](url)`
- **Code** - Inline \`code\` and fenced code blocks
- **Blockquotes** - `> quote`
- **Tables** - Full table support
- **Horizontal Rules** - `---` or `***`

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite 7** - Build tool and dev server
- **Vite PWA Plugin** - PWA functionality
- **Workbox** - Service worker and caching strategies
- **marked.js** - Markdown parsing
- **react-icons** - Beautiful icon set
- **localStorage** - Client-side data persistence

## 📦 PWA Configuration

The app uses the following PWA configuration:

- **Service Worker**: Auto-updating with user notification
- **Caching Strategy**: 
  - App shell: Cache-first
  - Google Fonts: Cache-first with 1-year expiration
  - Runtime caching for external resources
- **Offline Support**: Full offline functionality
- **Manifest**: Configured for standalone display mode

## 🎯 Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Brave
- ✅ Opera

## 📝 Usage Tips

1. **Creating Files**: Click "New File" button in the header or sidebar
2. **Switching Files**: Click on any file in the left sidebar
3. **Deleting Files**: Hover over a file and click the trash icon
4. **Downloading**: Click the download icon in the header
5. **Auto-Save**: Files save automatically as you type
6. **Updates**: When an update is available, you'll see a notification in the bottom-right

## 🔒 Privacy

All your markdown files are stored locally in your browser's localStorage. No data is sent to any server. The app works completely offline after the initial load.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Made with ❤️ using React + Vite + PWA
