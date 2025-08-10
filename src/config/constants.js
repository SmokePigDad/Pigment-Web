// Configuration constants for the Pigment application

export const INSPIRE_PROMPTS = [
  "A futuristic city floating above clouds, airships drifting by",
  "Misty enchanted forest at dawn glowing with magical wildlife",
  "Portrait of a robot artist creating a vibrant masterpiece",
  "Where the ocean merges with a swirling galaxy of stars",
  "Steampunk airship hovering over neon-lit metropolis",
  "Sunbeams shining through a stained glass medieval castle",
  "Cyberpunk rainy streets with vivid neon signs and umbrellas",
  "Glass-winged dragonfly perched delicately on a blooming iris",
  "Cozy home library, cat curled up beside raindrop-streaked window",
  "Abstract swirling patterns representing boundless curiosity",
  "Crystal cavern illuminated by bioluminescent fungi and gems",
  "Grand temple floating on water under golden sunrise",
  "Astronaut exploring ancient alien ruins on Mars",
  "A city park where trees have luminous, floating leaves",
  "Fantasy village built inside giant mushrooms at dusk",
  "Dragon soaring over snowy peaks, casting a long shadow",
  "Retro diner at midnight, rain outside, neon lights",
  "Vast cosmic whale gliding through violet star clouds",
  "Glitch-art city where reality bends around every corner",
  "Peaceful zen garden with raked sand and cherry blossoms",
  "Surreal parade of clockwork animals down cobbled streets",
  "Giant crystal flower blooming in a moonlit desert",
  "Deep jungle waterfall pouring into a glowing lagoon",
  "Wizard's study cluttered with potions, books, and candles",
  "Children flying kites shaped like mythical beasts",
  "Ancient oak tree with lanterns and secret doorways",
  "Sky filled with hot air balloons during sunrise",
  "Miniature mountain range on a painter's wooden palette",
  "A ship sailing through clouds as if they were oceans",
  "Urban rooftop garden glowing with bioluminescent plants",
  "Viking longship frozen in an ice cavern",
  "Floating library orbiting a distant blue planet",
  "Epic showdown between a giant and a tiny hero",
  "Magician pulling stardust from an endless top hat",
  "Antique clock tower overtaken by sprawling foliage",
  "Shadowy figure walking into a swirling portal",
  "Art deco cityscape drenched in gold and turquoise light",
  "Playful fox and crow together in a blossoming field",
  "Train racing through a thunderstorm under Northern Lights",
  "Underwater palace made of coral and pearls",
  "Time traveler's workshop filled with clockwork gadgets",
  "Majestic phoenix rising from ashes in a volcanic landscape",
  "Secret garden hidden behind a waterfall",
  "Space station orbiting a ringed planet",
  "Medieval knight riding a mechanical dragon",
  "Floating islands connected by rainbow bridges",
  "Enchanted bookstore where stories come to life",
  "Crystal palace reflecting aurora borealis",
  "Pirate ship sailing through a storm of shooting stars"
];

export const DEFAULT_MODELS = [
  { "name": "gptimage", "description": "Premium model with advanced features like transparency." },
  { "name": "flux", "description": "High-quality image generation.", "is_default": true },
  { "name": "turbo", "description": "A very fast image generation model." }
];

export const IMAGE_SIZES = [
  { value: "512,512", label: "512×512 (Square)" },
  { value: "1024,1024", label: "1024×1024 (Square)", selected: true },
  { value: "640,960", label: "640×960 (2:3 Portrait)" },
  { value: "960,640", label: "960×640 (3:2 Landscape)" },
  { value: "1296,972", label: "1296×972 (4:3 Standard)" },
  { value: "1728,972", label: "1728×972 (16:9 HD)" }
];

export const IMAGE_COUNTS = [
  { value: 2, label: "2 images" },
  { value: 4, label: "4 images", selected: true },
  { value: 10, label: "10 images" },
  { value: 25, label: "25 images" },
  { value: 50, label: "50 images" },
  { value: 100, label: "100 images" },
  { value: 200, label: "200 images" }
];

export const API_CONFIG = {
  POLLINATIONS_BASE_URL: 'https://image.pollinations.ai',
  TEXT_API_URL: 'https://text.pollinations.ai',
  RATE_LIMIT_DELAY: 1200, // milliseconds between requests
  MAX_RETRIES: 3,
  RETRY_DELAY: 950 // milliseconds between retries
};

export const UI_CONFIG = {
  PROGRESS_UPDATE_INTERVAL: 100,
  STATUS_MESSAGE_TIMEOUT: 2200,
  JSZIP_CDN_URL: "https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js"
};
