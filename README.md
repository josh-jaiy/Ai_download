# AI Download Manager

![AI Download Manager Logo](public/logo.png)

A next-generation download management system with real-time monitoring, analytics, cloud storage integration, and scheduling capabilities.

## Features

- 📊 **Real-time Download Dashboard**: Monitor download speed, progress, remaining time, and errors with visual representations
- 📈 **Download Analytics**: Track download behavior with charts and statistics for sources, file types, and user demographics
- ☁️ **Cloud Storage Integration**: Connect with AWS S3, Google Cloud Storage, and Azure Blob Storage for secure file storage and retrieval
- ⏱️ **Download Scheduler**: Schedule downloads with start/end times, recurring options, and reliable task management
- 🧵 **Multi-Threaded Downloads**: Split downloads into multiple threads for faster speeds
- 🔄 **Download Management**: Pause, resume, cancel, and prioritize downloads
- 🔍 **Search & Filter**: Find and organize downloads by name, source, type, and status
- 🌙 **Dark Mode**: Modern dark-themed interface for comfortable viewing

## Screenshots

![Dashboard](public/screenshots/dashboard.png)
![Analytics](public/screenshots/analytics.png)
![Cloud Storage](public/screenshots/cloud-storage.png)
![Scheduler](public/screenshots/scheduler.png)

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- PostgreSQL database

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/ai-download-manager.git
   cd ai-download-manager
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file with your database connection details and other required variables.

4. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### Dashboard Navigation

The application features a tabbed interface with four main sections:

- **Status Dashboard**: Monitor active and completed downloads
- **Analytics**: View download statistics and charts
- **Cloud Storage**: Manage cloud storage connections and file uploads
- **Scheduler**: Schedule downloads for specific times

### Managing Downloads

- **Start/Pause/Resume**: Control download progress with intuitive controls
- **Filter by Source**: Filter downloads by source (YouTube, documents, applications, etc.)
- **Search**: Find specific downloads by name or other attributes
- **View Details**: See comprehensive information about each download

## Documentation

For detailed documentation, see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md).

## Contributing

Contributions are welcome! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with Next.js and React
- Styled with Tailwind CSS
- Charts powered by Recharts
- Icons provided by Lucide React
- UI components from shadcn/ui

---

Made with ❤️ by Your Team
