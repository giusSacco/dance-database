# Dance DB - Salsa & Bachata Personal Database

A comprehensive biomechanical archive for salsa and bachata dance moves. This personal database helps track, document, and analyze dance techniques with detailed technical breakdowns.

## Features

### 📊 Move Management
- **Create, Edit, Delete** dance moves with full technical details
- **Search functionality** to quickly find specific moves
- **Color-coded tags** for difficulty and style classification:
  - 🟢 Green: Basic moves
  - 🟤 Dark Green: Extensions
  - 🔵 Blue: Sensual/Slow moves
  - 🟡 Yellow: Intermediate
  - 🔴 Red: Complex/Advanced

### 📝 Technical Documentation
Each move includes:
- **Title & Subtitle**: Name and alternative names
- **Description**: Brief overview
- **Steps**: Detailed step-by-step breakdown
- **Preparation**: Setup requirements
- **Command**: Lead/follow mechanics
- **Intention**: Movement purpose and feel
- **Deep Search**: Biomechanical analysis with HTML formatting support

### 🎥 Personal Area
- **Video Links**: Embed YouTube videos or external links
- **Private Notes**: Personal observations and corrections
- **Local Storage**: All data saved in browser localStorage

### 📱 Responsive Design
- Mobile-first responsive interface
- Touch-optimized sidebar navigation
- Desktop and mobile layouts

## Getting Started

### Opening the App
Simply open `index.html` in any modern web browser. No installation or server required!

### Adding Your First Move
1. Click "Nuova Mossa" (New Move) in the sidebar
2. Fill in the technical details
3. Add external references, videos, and personal notes
4. Click "Salva" (Save)

### Editing Moves
1. Select a move from the sidebar
2. Click "Modifica Scheda" (Edit Card)
3. Update fields as needed
4. Save or cancel changes

## Data Storage

All data is stored locally in your browser using `localStorage` with the key `bachata_db_data_v2`. This means:
- ✅ No internet required after initial load
- ✅ Complete privacy - data never leaves your device
- ⚠️ Data is browser-specific (won't sync across browsers)
- ⚠️ Clearing browser data will delete your moves

### Backup Your Data
To backup your database:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Run: `copy(localStorage.getItem('bachata_db_data_v2'))`
4. Paste into a text file and save

To restore:
1. Open Developer Tools Console
2. Run: `localStorage.setItem('bachata_db_data_v2', 'YOUR_BACKUP_DATA_HERE')`
3. Refresh the page

## Technology Stack

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first styling via CDN
- **Lucide Icons**: Beautiful icon set
- **Vanilla JavaScript**: No framework dependencies
- **localStorage API**: Client-side data persistence

## Dance Types Supported

- **Bachata**: Dominican, Sensual, Moderna
- **Salsa**: On1, On2, Cuban
- **Rueda**: Rueda de Casino moves

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Version History

- **v2**: Added Deep Search section with HTML support
- **v1**: Initial release with core features

## Future Enhancements

Potential features for future versions:
- Export/Import functionality
- Cloud sync option
- Move sequencing/choreography builder
- Video recording integration
- Multi-language support

## License

Personal use project - feel free to adapt for your own dance practice!

---

**Made with ❤️ for the dance community**
