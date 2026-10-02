import React from 'react';

interface PromptPresetsProps {
  onAddTag: (tag: string) => void;
}

const PRESET_GROUPS = [
  {
    category: "🎥 Camera Angles",
    tags: [
      "FPV drone flyover",
      "slow orbital 360 camera",
      "smooth tracking dolly shot",
      "extreme close-up macro",
      "wide cinematic establishing shot",
    ],
  },
  {
    category: "💡 Lighting & Atmosphere",
    tags: [
      "golden hour sunset lighting",
      "cyberpunk neon glow with rain reflections",
      "moody volumetric fog and rays",
      "high-contrast film noir chiaroscuro",
      "soft studio beauty lighting",
    ],
  },
  {
    category: "🎨 Visual Styles",
    tags: [
      "photorealistic 8k cinematic footage",
      "Pixar-style 3D animation",
      "retro 90s anime style",
      "vintage 16mm grainy film stock",
      "stop-motion claymation",
    ],
  },
];

const PromptPresets: React.FC<PromptPresetsProps> = ({ onAddTag }) => {
  return (
    <div className="w-full space-y-3 pt-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        ✨ Cinematic Presets & Camera Tags (Click to append):
      </div>
      <div className="space-y-2">
        {PRESET_GROUPS.map((group) => (
          <div key={group.category} className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-gray-400 font-medium mr-1">{group.category}:</span>
            {group.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onAddTag(tag)}
                className="px-2.5 py-1 bg-gray-700/60 hover:bg-blue-600/80 hover:text-white text-gray-300 rounded-full border border-gray-600/50 transition-all duration-150 transform active:scale-95 text-xs"
              >
                + {tag}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptPresets;
