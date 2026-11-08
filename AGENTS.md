# AGENTS.md - Developer & AI Agent Operations Manual for `Video-Editor-work` 🤖

This document is the definitive operational guide for autonomous AI coding agents (Antigravity, Claude, Cursor, OpenAI Codex, OpenHands) operating within this repository.

---

## 🎯 1. System Overview & Core Philosophy

**🎬 Gemini Video Studio**
> AI-powered generative video studio & scene director built with Google Veo and Gemini 2.5 Create stunning high-definition cinematic videos from text prompts or starting images, seamlessly chain and extend video scenes into continuous narratives, and generate AI soundscape scores tailored to your footage. - 🎥 Text-to-Video Generation: Turn creative ideas into photorealistic videos using Google's Veo 3.1 model (veo-3.1-generate-preview).

### Key Architectural Capabilities
- **Dual Player Modes**: Seamlessly toggle between **📹 Raw Video** and **⚡ Remotion Studio Player** with live keyframe scrubbing.
- **Physics-Based Spring Animations**: Fluid entrance and exit animations computed with Remotion's `spring()` and `interpolate()` math primitives.
- **4 Visual Themes**: 
- **Parametric Placements**: Position overlays as **Lower Third**, **Centered Intro Card**, or **Top Banner**.
- **Synchronized Progress Bar**: Frame-accurate visual timeline tracker.
- **One-Click Remotion Code Export**: Export standalone Remotion JSX composition code pre-populated with your video URL and overlay parameters.

---

## 🏗️ 2. Repository Structure & Directory Map

| Path | Role & Architectural Responsibility |
| :--- | :--- |
| `.github/` | Subsystem directory (.github) |
| `components/` | Subsystem directory (components) |
| `global.d.ts` | TypeScript / JavaScript source component |
| `package.json` | Node.js dependencies, build scripts, and metadata |
| `services/` | Subsystem directory (services) |
| `types.ts` | TypeScript / JavaScript source component |
| `utils/` | Subsystem directory (utils) |
| `vite.config.ts` | TypeScript / JavaScript source component |

---

## ⚙️ 3. Executable Verification Pipeline

Before marking any task complete, an AI agent **must** run the following verification steps sequentially:

### Tier 1: TypeScript Compilation & Type Safety Check
```bash
npx tsc --noEmit
```

### Tier 2: Production Bundle Verification
```bash
npm run build
```

### Tier 3: Automated Test Runner
```bash
npm test --if-present
```

---

## 🛡️ 4. Architectural Invariants & Non-Negotiable Rules

### Strict Invariants ("Never Do" List):
1. **Strict TypeScript (No Implicit Any):** All variables, props, and return types must be explicitly typed.
2. **Clean Component Unmounting:** Always clean up event listeners, timers, and abort controllers in `useEffect` cleanup return functions.
3. **Zero Hardcoded API Endpoints:** Read service URLs from Vite environment variables (`import.meta.env`).

### Security & Environment Variables:
- All API keys and secrets must be loaded strictly from environment variables.
- Never commit `.env`, `.pem`, token files, or private credentials.

---

## 🤖 5. Autonomous Agent Operational Protocol

When dispatched to resolve an issue, implement a feature, or refactor code in this repo:

1. **Phase 1 — Explore & Plan:**
   - Read this `AGENTS.md` and relevant source files.
   - Check existing tests to establish the baseline.
2. **Phase 2 — Act (Surgical Implementation):**
   - Implement changes with minimal blast radius.
   - Adhere to the established code style and existing conventions.
3. **Phase 3 — Verify:**
   - Run the Tier 1, 2, and 3 verification commands listed above.
   - Ensure all existing and new tests pass cleanly.
4. **Phase 4 — Reflect:**
   - Review `git diff` to confirm zero unintended whitespace or collateral changes.
   - Confirm no untracked scratch files remain.

---
*Maintained by Ayyappa Pravin • Engineered for Antigravity, Claude, Cursor & Modern Autonomous AI Agents.*
