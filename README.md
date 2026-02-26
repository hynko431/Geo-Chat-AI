# 🌍 GeoChat AI

An interactive, map-based chatbot that uses real-time Google Maps data to answer location-specific questions. Built with Gemini 2.5 Flash and Google Maps Grounding.

![GeoChat AI](https://picsum.photos/seed/geochat/1200/600?blur=2)

## ✨ Features

- **Real-Time Location Insights**: Ask about restaurants, landmarks, or services and get data directly from Google Maps.
- **Interactive Map**: A live Leaflet-based map that centers on your location to provide visual context.
- **Smart Grounding**: Every recommendation includes a direct link to the official Google Maps entry for reviews, photos, and directions.
- **Dual Intelligence**: Combines Google Maps grounding with Google Search for the most accurate and up-to-date information.
- **Modern UI**: A clean, responsive split-pane design optimized for both desktop and mobile exploration.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4.0
- **AI Model**: `gemini-2.5-flash` (via `@google/genai`)
- **Mapping**: Leaflet & React-Leaflet
- **Icons**: Lucide React
- **Animations**: Motion

## 🚀 Getting Started

### Prerequisites

- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

### Environment Variables

Create a `.env` file in the root directory (or use the AI Studio Secrets panel):

```env
GEMINI_API_KEY=your_api_key_here
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 Usage Examples

Try asking GeoChat AI:
- *"Where's the best place to get coffee within 10 minutes of me?"*
- *"Find a highly-rated Italian restaurant that's open now."*
- *"Are there any parks nearby with a playground?"*
- *"What are the top-rated tourist attractions in San Francisco?"*

## 🛡️ Privacy & Permissions

This app requests **Geolocation** permissions to provide accurate "near me" results. Your location data is used only to ground the AI's search queries and is not stored permanently.

---

Built with ❤️ using Google AI Studio.
