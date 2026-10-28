<div align="center">

# 🎬 Gemini Video Studio

**AI-powered generative video studio & scene director built with Google Veo and Gemini 2.5**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Remotion](https://img.shields.io/badge/Remotion-4.0-0b84f3.svg?logo=react&logoColor=white)](https://www.remotion.dev/)
[![Google GenAI SDK](https://img.shields.io/badge/Google%20Gen%20AI-SDK%201.28-4285f4.svg?logo=google&logoColor=white)](https://www.npmjs.com/package/@google/genai)

<br/>

Create stunning high-definition cinematic videos from text prompts or starting images, seamlessly chain and extend video scenes into continuous narratives, and generate AI soundscape scores tailored to your footage.

</div>

---

## ✨ Features

- 🎥 **Text-to-Video Generation**: Turn creative ideas into photorealistic videos using Google's **Veo 3.1** model (`veo-3.1-generate-preview`).
- 🖼️ **Image-to-Video Storyboarding**: Upload an initial photo or concept art and direct Veo to bring it into dynamic motion.
- 🎞️ **Continuous Scene Extension**: Extend any existing clip into multi-scene films with full narrative coherence.
- ⚡ **Remotion Motion Graphics Studio**: Integrated `@remotion/player` rendering programmatic React title cards, spring physics entrances, animated progress bars, and kinetic typography over your AI footage with full theme customization and one-click Remotion code export.
- 🎬 **Cinematography Preset Chips**: Clickable camera angles (*dolly shot, FPV drone flyover, 360 orbit*), lighting moods (*golden hour, cyberpunk neon, film noir*), and visual styles (*vintage 16mm film, 3D animation, photorealistic 8K*).
- 🎵 **AI Audio Soundscape Designer**: Powered by **Gemini 2.5 Flash**, generate custom musical scores, ambient foley soundscapes, and tempo recommendations for each scene.
- 📽️ **Session Video Reel & History**: Horizontal timeline carousel tracking all generated iterations and extensions in your session with one-click MP4 download.
- 🔑 **Universal Setup & Key Management**: Runs smoothly both locally (`npm run dev`) with in-app `localStorage` API key persistence, or inside the Google AI Studio cloud runner.
- 📐 **Multiple Aspect Ratios**: Supports Landscape (16:9 for YouTube / widescreen) and Portrait (9:16 for Reels, Shorts, and TikTok).

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/apravint/Video-Editor.git
   cd Video-Editor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Key (Choose one):**
   - **Option A (In-App)**: Run the app and enter your key directly in the secure UI prompt (stored locally in browser storage).
   - **Option B (.env.local)**: Create `.env.local` based on `.env.example`:
     ```bash
     cp .env.example .env.local
     ```
     Add your key:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🎥 Veo Prompting Guide

For the best results with Google Veo, structure prompts with cinematic descriptors:

| Element | Examples |
|---|---|
| **Subject** | *A cybernetic red fox with luminous amber eyes* |
| **Action & Motion** | *sprinting through puddles at high speed, splashing droplets* |
| **Camera Movement** | *smooth low-angle tracking dolly shot, dynamic 45-degree pan* |
| **Lighting & Mood** | *foggy night, volumetric purple neon reflections, high contrast* |
| **Aesthetic / Lens** | *35mm anamorphic lens, shallow depth of field, 8k resolution* |

### Example Prompt:
> *"Cinematic drone shot flying through a bioluminescent redwood forest at dusk, ethereal blue fireflies floating in the air, soft volumetric light rays, photorealistic 8k, slow smooth forward tracking motion."*

---

## 📁 Project Structure

```
Video-Editor/
├── components/
│   ├── ApiKeySelector.tsx    # Modal for Gemini API key input with localStorage & AI Studio support
│   ├── ClipHistory.tsx       # Session video reel showing generated & extended clips
│   ├── Header.tsx            # Sticky header with branding, key reset, and repo link
│   ├── Icons.tsx             # Clean SVG iconography set
│   ├── ImageUploader.tsx     # Drag & drop starter image uploader
│   ├── LoadingIndicator.tsx  # Dynamic multi-stage video generation progress indicator
│   ├── PromptInput.tsx       # Textarea input for scene descriptions
│   ├── PromptPresets.tsx     # Quick-click cinematography and lighting chips
│   └── VideoPlayer.tsx       # HTML5 player with scene extension, MP4 export, & audio suggestions
├── services/
│   └── geminiService.ts      # @google/genai SDK integration (Veo 3.1 & Gemini 2.5 Flash)
├── utils/
│   └── fileUtils.ts          # File to base64 conversion utilities
├── types.ts                  # TypeScript definitions for Veo options and operations
├── App.tsx                   # Main application controller and state
├── index.html                # Entry HTML
├── package.json              # Project scripts and dependencies
├── vite.config.ts            # Vite bundler configuration
└── LICENSE                   # MIT License
```

---

## 🛠️ Built With

- **[React 19](https://react.dev/)**
- **[Vite](https://vitejs.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[Google Gen AI SDK (`@google/genai`)](https://www.npmjs.com/package/@google/genai)**
- **[Google Veo](https://deepmind.google/technologies/veo/)** & **[Gemini 2.5](https://deepmind.google/technologies/gemini/)**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for personal and commercial use.
