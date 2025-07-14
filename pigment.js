// pigment.js

const AppState = {
  isGenerating: false,
  abortGeneration: false,
  currentAbortController: null,
  revokeURLs: [],
};

const FAVORITES = new Set();
const INSPIRE_PROMPTS = [
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
  "Wizard’s study cluttered with potions, books, and candles",
  "Children flying kites shaped like mythical beasts",
  "Ancient oak tree with lanterns and secret doorways",
  "Sky filled with hot air balloons during sunrise",
  "Miniature mountain range on a painter’s wooden palette",
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
  "Alien festival with floating lanterns and spiral tents",
  "Gigantic spider web spun between mountain peaks",
  "Desert nomad caravan crossing glowing glass dunes",
  "Sinister carnival at twilight with floating balloons",
  "Glass orb containing an entire miniature forest ecosystem",
  "Lost city made of mirrors reflecting endless sky",
  "Ancient ruins overtaken by giant blooming flowers",
  "Rainy night in Tokyo, puddles reflecting colorful lights",
  "Treasure chest guarded by holographic sea monsters",
  "Enormous tortoise carrying a village on its shell",
  "Mountain pass with statues of forgotten gods",
  "Kids building a rocket ship from scrap in alleyway",
  "Robot hummingbird hovering beside a glass rose",
  "Sunken pirate ship resting on glowing coral reef",
  "A sorcerer casting spells made of pure music",
  "City square with levitating street performers",
  "Gothic cathedral shimmering under a double rainbow",
  "Tribal warriors riding feathered velociraptors",
  "Clockwork garden where mechanical bees pollinate flowers",
  "Vintage biplane soaring between enormous rainbows",
  "Diver discovering Atlantis among bioluminescent fish",
  "Fox spirit curled around a blue lantern in snow",
  "Deep cave adorned with crystalline dragon eggs",
  "Epic waterfall splitting a vibrant canyon in two",
  "An old fisherman on a raft, surrounded by giant koi",
  "Giant's table set for tea on a mountain plateau",
  "Retro-futuristic city glowing under auroras",
  "Ice castle folding in on itself like origami",
  "Glowing quantum computer sitting in a zen garden",
  "Orchard where every tree grows a different fruit",
  "Deserted carnival with shadow puppets as visitors",
  "View from inside a raindrop falling toward Earth",
  "Poet writing verses in floating paper boats",
  "Sphinx with butterfly wings on golden sand dunes",
  "Glass stairway spiraling toward a floating library",
  "House built inside a giant floating lotus flower",
  "A city at dusk powered by wind turbines shaped like birds",
  "Marathon of snails carrying shimmering crystals as shells",
  "Ocean sunrise as seen through a kaleidoscope lens",
  "Blind painter painting dreams onto invisible canvases",
  "Living street-art, murals climbing off the walls",
  "A metropolis in perpetual twilight, glowing gardens everywhere",
  "Enchanted violin making northern lights dance",
  "Battle between shadow and light atop a chessboard",
  "Desert oasis where water becomes liquid light",
  "Alchemist’s apothecary filled with animated jars",
  "Ancient bridge made entirely from chiseled amethyst",
  "A child’s bedroom galaxy swirling above the bed",
  "Orbiting greenhouse bursting with extraterrestrial fruits",
  "Phantom ship sailing through clouds of floating lanterns",
  "Market square full of talking vegetables and fruits",
  "Giant owl perched atop a skyscraper at midnight",
  "Futuristic monk meditating under holographic cherry trees",
  "Clock tower whose hands point to different worlds",
  "Waves forming musical notes across a crystal lake",
  "Hot springs inside a glowing cavern",
  "City with all roads paved in blue glass",
  "Space station shaped like a blooming flower",
  "Orchestra made of animals playing magical instruments",
  "Noble elk crowned with antlers of dripping gold",
  "Telescope that reveals dreams floating above a city",
  "Silhouette of pirate galleons on a starlit sea",
  "Foggy mountains with temples glowing in the mist",
  "Dreamlike carnival with floating jellyfish lanterns",
  "Deep-sea diver discovering lost technology",
  "Galactic train racing through rings of Saturn",
  "Mirror maze reflecting infinite summer skies",
  "Ancient rune stones crackling with blue lightning",
  "Clockmaker’s workshop powered by tiny dragons",
  "Skateboarder jumping between city rooftops at sunset",
  "Epic library within a giant glass beehive",
  "Autumn market selling magical enchanted apples",
  "City island afloat on a swirling hurricane",
  "Painter capturing the northern lights as they swirl",
  "Robot dog herding sheep beneath solar panels",
  "Secret garden full of singing statues",
  "Astronaut planting a tree on an asteroid",
  "Underwater palace sheltered by a living coral reef",
  "Zen sand garden shaped into a spiral galaxy",
  "Giant bat soaring above haunted forest at dusk",
  "Electronic music festival in a glowing mushroom clearing",
  "Children riding mechanical dolphins in rainbow rivers",
  "Labyrinth made of living hedges and rainbow roses",
  "Cafe on the Moon overlooking a blue sunrise",
  "Futuristic samurai facing digital dragons",
  "Floating islands strung together by glowing webs",
  "Sea turtle ferry with boats on its back",
  "Jellyfish balloons drifting through ancient catacombs",
  "A peaceful fox curled on a mossy grave",
  "Cyborg centaur galloping across starlit plains",
  "Lantern festival in a city under the ocean",
  "Volcano erupting with swirling ribbons of light",
  "People ice skating on a frozen lava flow",
  "Raven sorceress summoning shadows in the snow",
  "Hedge maze forming a map of the world",
  "Caravan of camels with stained glass saddles",
  "Rainbow bridges linking mountain peaks across valleys",
  "Parade of skeleton musicians down a midnight alley",
  "Phoenix bursting from a river of silver flames",
  "Windmills spinning amidst fields of glass flowers",
  "Children releasing paper boats into golden mist",
  "Eagle warrior gliding above a shining canyon",
  "Garden party among carnivorous plants and giant bees",
  "Magical vending machine that dispenses wishes",
  "Old wizard with a beard made of clouds",
  "Streetlight that glows with trapped fireflies",
  "Chessboard city ruled by animal kings",
  "Rocket launch watched by a field of dandelion seeds",
  "Star maps painted onto the bellies of giant whales",
  "Mysterious circus arriving on the back of a thunderstorm",
  "Fish swimming through ancient city ruins in the desert",
  "Blindfolded oracle weaving galaxies from strands of starlight",
  "Runaway train flying off rails into the clouds",
  "Marketplace in a forest with crystal fruits and glowing roots",
  "A lone wolf howling on a snowy skyscraper rooftop",
  "Lost unicorn hiding under cherry blossoms at dusk",
  "Sailing ship tethered to a floating moon",
  "Mermaid sculptor chiseling ice beneath polar lights"
];

let batchMode = false;
const batchToggleBtn = () => document.getElementById('batch-toggle');

function isBatchModeEnabled() {
  return batchMode === true;
}

function setBatchToggleState(val) {
  batchMode = !!val;
  const btn = batchToggleBtn();
  if (!btn) return;
  btn.setAttribute('aria-checked', batchMode ? 'true' : 'false');
  btn.classList.toggle('selected', batchMode);
}

function setupBatchToggle() {
  const btn = batchToggleBtn();
  if (!btn) return;
  setBatchToggleState(false);

  btn.addEventListener('click', function (e) {
    setBatchToggleState(!batchMode);
  });

  btn.addEventListener('keydown', function (e) {
    if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
      e.preventDefault();
      setBatchToggleState(!batchMode);
    }
  });
}

async function inspireMeAPIPrompt() {
  try {
    const resp = await fetch('/api/inspire');
    
    if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || `Request failed with status: ${resp.status}`);
    }
    const data = await resp.json();
    if (data.prompt && data.prompt.trim().length > 0) {
        return data.prompt.trim();
    }
    throw new Error('API returned an empty prompt');
  } catch (err) {
    console.error("Error fetching inspiration prompt:", err);
    return INSPIRE_PROMPTS[Math.floor(Math.random() * INSPIRE_PROMPTS.length)];
  }
}

function fetchModelsAndPopulate() {
  const dropdown = document.getElementById('model');
  const modelInfo = document.getElementById('model-info');
  if (!dropdown) return;

  const models = [
    { "name": "gptimage", "description": "Premium model with advanced features like transparency." },
    { "name": "flux", "description": "High-quality image generation.", "is_default": true },
    { "name": "turbo", "description": "A very fast image generation model." }
  ];

  try {
    let optionsHTML = "";
    let defaultModel = models.find(m => m.is_default) || models[0];
    for (const model of models) {
        optionsHTML += `<option value="${model.name}"${model === defaultModel ? ' selected' : ''}>${model.name}</option>`;
    }
    dropdown.innerHTML = optionsHTML;

    window._AVAILABLE_MODELS = models;
    window._ACTIVE_MODEL = defaultModel ? defaultModel.name : models[0]?.name;

    dropdown.onchange = function () {
      window._ACTIVE_MODEL = dropdown.value;
      updateAdvancedFeatureGating();
      const info = models.find(m => m.name === dropdown.value)?.description || '';
      modelInfo.innerHTML = info
        ? `<p><strong>${dropdown.value}</strong><br>${info}</p>`
        : `<p>Select a model to see its description</p>`;
    };
    updateAdvancedFeatureGating();
    const defaultModelInfo = models.find(m => m.name === window._ACTIVE_MODEL)?.description || '';
    modelInfo.innerHTML = defaultModelInfo
        ? `<p><strong>${window._ACTIVE_MODEL}</strong><br>${defaultModelInfo}</p>`
        : `<p>Select a model to see its description</p>`;

  } catch (err) {
    dropdown.innerHTML = `<option value="error" disabled selected>Error loading models</option>`;
    if (modelInfo) modelInfo.innerHTML = '<p style="color:red;">Could not display models.</p>';
  }
}

function updateAdvancedFeatureGating() {
  const transparentCheckbox = document.getElementById('transparent');
  const transparentLabel = document.getElementById('transparent-label');
  const modelSelect = document.getElementById('model');

  if (!transparentCheckbox || !transparentLabel || !modelSelect) return;

  const isGptImageSelected = modelSelect.value === "gptimage";
  transparentLabel.style.display = isGptImageSelected ? "flex" : "none";
  if (!isGptImageSelected) {
      transparentCheckbox.checked = false;
  }
}

const artStyles = {
    // ... Art styles object omitted for brevity ...
    "Ukiyo-e": "Ukiyo-e style, Japanese woodblock print medium, flat layered colors, bold black outlines with intricate patterns, floating world themes of nature, kabuki actors, Mount Fuji, great wave, cherry blossoms, Edo period serenity, in the style of Hokusai, in the style of Hiroshige", "Photorealism": "photorealistic rendering, hyper-detailed high-resolution 8K or 16K photography medium, sharp focus on lifelike textures and reflections, natural diffused or studio lighting, meticulous skin pores and fabric weaves, shot on Hasselblad H6D-400c, Phase One XF, or large format camera", "Hyperrealism": "hyperrealistic attention to surface and light, detailed textures, cinematic lighting, objects and environments, full-body or scene, product or still-life realism, sculptural accuracy, in the style of Ron Mueck (sculpture), Chuck Close (pattern), and contemporary hyperrealists", "Digital Art": "digital painting medium, concept art with ArtStation trends, CGI and 3D rendering in Unreal Engine 5, Octane render glows and VFX effects, high-fantasy dynamic lighting, sculpted in ZBrush", "Abstract Expressionism": "abstract expressionist oil or acrylic medium, bold gestural brushstrokes and drip splatters, non-representational chaotic energy on large canvas, vibrant emotional palettes, in the style of Jackson Pollock, in the style of Willem de Kooning", "Art Deco": "Art Deco graphic design medium, geometric symmetrical patterns with streamlined motifs, gold-black metallic tones and zigzags, 1920s luxurious glamour, stylized figures and elegant sans-serif typography", "Art Nouveau": "Art Nouveau illustration medium, organic flowing whiplash lines and curves, stylized floral vines in pastel jewel tones, elegant sinuous forms with natural inspiration, in the style of Alphonse Mucha, in the style of Gustav Klimt", "Baroque": "Baroque oil painting medium, dramatic chiaroscuro and tenebrism shadows, intense emotional opulence in rich deep colors, dynamic swirling compositions, in the style of Caravaggio, in the style of Rembrandt", "Bauhaus": "Bauhaus design medium, minimalist geometric abstraction in primary colors (red, yellow, blue), clean functional lines with industrial modernism, asymmetrical balance and sans-serif type", "Cubism": "Cubist mixed media, fragmented geometric facets from multiple perspectives, abstracted forms in monochromatic earthy tones, analytical deconstruction of reality, in the style of Pablo Picasso, in the style of Georges Braque", "Expressionism": "Expressionist canvas medium, distorted emotional forms with swirling bold strokes, vivid non-naturalistic colors evoking angst, raw psychological depth, in the style of Edvard Munch, in the style of Ernst Ludwig Kirchner", "Fauvism": "Fauvist oil medium, wild expressive brushwork in intense vibrant colors, bold non-naturalistic contrasts, painterly joyful freedom, in the style of Henri Matisse, in the style of André Derain", "Impressionism": "Impressionist plein air medium, loose visible brushstrokes capturing dappled light, soft atmospheric focus on fleeting moments, pastel outdoor palettes, in the style of Claude Monet, in the style of Pierre-Auguste Renoir", "Minimalism": "minimalist sculpture or canvas medium, extreme reduction to monochromatic forms, clean geometric lines with vast negative space, uncluttered meditative simplicity, in the style of Donald Judd, in the style of Agnes Martin", "Pop Art": "Pop Art silkscreen medium, bold bright colors with Ben-Day dots and halftones, comic-inspired mass culture irony, vibrant consumer icons, in the style of Andy Warhol, in the style of Roy Lichtenstein", "Renaissance": "Renaissance fresco or oil medium, classical realism with sfumato blending and linear perspective, harmonious mythological scenes, balanced golden ratio compositions, in the style of Leonardo da Vinci, in the style of Raphael", "Romanticism": "Romanticist landscape medium, dramatic sublime nature with emotional turmoil, stormy atmospheric depths and ancient ruins, awe-inspiring light effects, in the style of J.M.W. Turner, in the style of Caspar David Friedrich", "Surrealism": "Surrealist dream canvas medium, bizarre uncanny juxtapositions with melting forms, precise subconscious symbols in illogical scenes, in the style of Salvador Dalí, in the style of René Magritte", "Street Art": "street art spray paint medium, large mural stencils on urban walls, bold vibrant political commentary, layered graffiti textures, in the style of Banksy, in the style of Shepard Fairey", "Graffiti": "graffiti aerosol medium, explosive bold colors with drips and wildstyle tags, street culture energy on concrete, high-contrast rebellious outlines", "Dadaism": "Dadaist collage medium, absurd anti-art assemblages and readymades, nonsensical avant-garde satire, chaotic experimental juxtapositions, in the style of Marcel Duchamp, in the style of Hannah Höch", "Constructivism": "Constructivist poster medium, geometric industrial shapes in red-black-white, abstract propaganda motifs with dynamic asymmetry, in the style of El Lissitzky, in the style of Aleksandr Rodchenko", "Futurism": "Futurist dynamic medium, speed and mechanization with multiple exposures, diagonal thrusting lines in vibrant fragmented energy, machine-age futurism, in the style of Umberto Boccioni, in the style of Giacomo Balla", "Synthwave": "Synthwave digital medium, 1980s retro-futuristic neon gradients, gridlines with outrun palm vibes, cyberpunk nostalgia and synth glows", "Vaporwave": "Vaporwave glitch medium, pastel 80s/90s gradients with Greek statues, lo-fi surreal nostalgia, ironic consumer glitches and palm malls", "Cyberpunk": "Cyberpunk neon digital medium, dystopian megacity with rainy reflections, high-tech holograms and low-life grit, in the style of Blade Runner, in the style of Ghost in the Shell", "Pixel Art": "pixel art digital medium, 8-bit blocky low-res sprites, limited retro palette, nostalgic arcade stylization and chiptune vibes", "Low Poly": "low poly 3D modeling medium, faceted geometric polygons with minimal edges, stylized vibrant renders, Unity or Blender abstract simplicity", "Watercolor": "watercolor paper medium, soft bleeding edges with transparent wet-on-wet layers, diffused ethereal delicacy, light airy hand-painted washes", "Oil Painting": "oil on canvas medium, thick impasto textures with layered vibrant colors, expressive dramatic lighting and depth, in the style of Vincent van Gogh", "Ink Drawing": "ink on paper medium, precise fine lines with crosshatching shading, monochrome intricate details, illustrative black-and-white precision", "Charcoal Sketch": "charcoal on paper medium, grayscale rough expressive marks, heavy smudged tonal variations, raw emotional gestural intensity", "Comic Book": "comic book inked medium, bold outlined panels with flat vibrant colors, speech bubbles and halftone action, dynamic superhero poses", "Anime": "anime cel animation medium, large expressive eyes with clean fluid lines, vibrant emotional close-ups, in the style of Studio Ghibli", "Manga": "manga ink medium, black-and-white high-contrast panels, screentone shading with action speed lines, dramatic sequential poses", "Concept Art": "concept art digital medium, detailed imaginative fantasy designs, cinematic layered compositions, game or film pre-vis painting", "Steampunk": "steampunk mixed media, Victorian gears and brass tech, brown-copper alternate history palette, adventurous mechanical details", "Gothic": "Gothic architectural medium, dark moody pointed arches, medieval stained glass shadows, eerie mystical dramatic lighting", "Art Brut": "art brut raw medium, outsider unrefined expressive forms, intense personal symbolism in naive visceral energy, in the style of Jean Dubuffet", "Dreamlike": "dreamlike ethereal medium, soft-focus haze with floating surreal elements, atmospheric mysterious pastels, subconscious narratives", "Pop Surrealism": "pop surrealism lowbrow medium, playful bizarre candy colors, whimsical dark miniatures, in the style of Mark Ryden, in the style of Audrey Kawasaki", "Children's Book": "children's book illustration medium, whimsical hand-drawn bright colors, friendly rounded playful scenes, storybook magic", "Photobash": "photobash digital collage medium, manipulated surreal photo layers, high-detail concept fusion of real and imagined elements", "Disney": "Disney animation medium, classic cartoon friendly exaggerations, vibrant family magical worlds, iconic whimsical designs", "Studio Ghibli": "Studio Ghibli hand-drawn medium, soft warm lush backgrounds, whimsical magical realism harmony, in the style of Hayao Miyazaki", "Colouring Book Page": "colouring book line art medium, bold black vector outlines with intricate fillable patterns, no shading on white background, simple stylized shapes, printable therapeutic designs, adult mandala or zentangle motifs, in the style of Dover publications", "Movie Poster": "movie poster graphic medium, dramatic cinematic composition with bold typography and billing block, high-contrast promotional lighting and title treatment, theatrical release flair, in the style of Drew Struzan, Saul Bass minimalist, or Polish film posters, IMAX format", "Blueprint": "blueprint technical medium, cyanotype white lines on Prussian blue background, precise architectural schematics with labels and dimensions, engineering diagram precision, isometric views, CAD wireframe, construction documents", "Technical Drawing": "technical drawing ink medium, isometric or orthographic views with ruled lines and annotations, exploded cross-sections, mechanical patent-style accuracy, black ink on vellum, precise linework, ISO standards, assembly instructions", "Stained Glass Window": "stained glass mosaic medium, vibrant lead came lines and translucent color panels, glowing backlit fragmentation, medieval religious iconography or Gothic cathedral motifs, light streaming effects, in the style of Tiffany or Art Nouveau glass, rose window designs", "Soviet Propaganda Poster": "Soviet propaganda lithograph medium, bold heroic red-yellow figures with Cyrillic text, socialist realism and constructivist elements, 1920s-1980s USSR aesthetics, hammer and sickle, Lenin portraits, revolutionary worker glorification", "Forensic Sketch": "forensic sketch pencil medium, monochromatic facial composites, subtle shading for witness accuracy, investigative realistic features", "Patent Illustration": "patent illustration line medium, clean exploded invention views, numbered arrows and labels, black-and-white archival precision", "Cave Painting": "cave painting pigment medium, prehistoric earthy ochre silhouettes, simple ritualistic animals and hand stencils on rock surfaces", "Tarot Card": "tarot card illustrative medium, symbolic ornate borders with esoteric archetypes, gold mystical symbols, Rider-Waite Renaissance vibe", "Victorian Illustration": "Victorian engraving medium, intricate romanticized lines with floral vignettes, sepia muted tones, in the style of Arthur Rackham", "Psychedelic": "psychedelic poster medium, swirling acid color fractals, optical hallucinogenic illusions, 1960s counterculture energy, in the style of Peter Max", "Rococo": "Rococo decorative medium, ornate playful pastel curves, frivolous rocaille shells and aristocratic scenes, light airy elegance, in the style of François Boucher", "Pointillism": "pointillism dotted medium, optical mixing of pure hue dots, scientific vibrant precision, seascape or portrait optics, in the style of Georges Seurat", "Byzantine": "Byzantine icon medium, gold-leaf flat stylized figures, religious halo mosaics, hierarchical tesserae compositions", "Folk Art": "folk art handcrafted medium, naive bright primary motifs, cultural rustic symbols, regional simplicity like Mexican tin or Scandinavian wood", "Op Art": "Op Art geometric medium, black-and-white vibrating patterns, moiré optical illusions, perceptual abstract trickery, in the style of Bridget Riley", "Kinetic Art": "kinetic sculpture medium, movable modular elements implying motion, metallic abstract dynamism, interactive wind or motor effects, in the style of Alexander Calder, Theo Jansen mobiles", "Land Art": "land art environmental medium, site-specific earthworks like spirals, aerial natural scale installations, ephemeral landscape interventions with natural materials, in the style of Robert Smithson, Andy Goldsworthy, Spiral Jetty aesthetics", "Naive Art": "naive art self-taught medium, childlike flat bright distortions, whimsical everyday scenes, primitive joyful perspective, in the style of Henri Rousseau", "Trompe-l'œil": "trompe-l'œil illusion medium, hyper-detailed fool-the-eye realism, painted deceptions on walls, classical surface mimicry", "Woodcut": "woodcut print medium, bold carved high-contrast lines, textured grain folk illustrations, antique ink relief, in the style of Albrecht Dürer", "Linocut": "linocut relief medium, bold graphic carved linoleum with high contrast, visible tool marks and reduction prints, German Expressionist energy, in the style of Pablo Picasso, block printing textures", "Etching": "etching intaglio medium, fine acid-bitten lines with crosshatched shading, detailed narrative copperplate scenes, antique depth and aquatint texture, in the style of Rembrandt, drypoint marks, old master printmaking", "Mezzotint": "mezzotint engraving medium, rich velvety blacks and tonal gradations, dramatic chiaroscuro portraits, rocker tool marks and scraper techniques, 18th-century rich print textures", "Silhouette": "silhouette paper-cut medium, black profile contrasts on light, elegant minimalist Victorian portraits, stark elegant simplicity", "Mosaic": "mosaic tile medium, colorful stone or glass tesserae fragments, geometric or figurative ancient patterns, textured surface assembly, Byzantine or Roman floor aesthetics, grouted smalti, pique assiette broken pottery", "Fresco": "fresco wet plaster medium, pigmented wall murals with soft earthy tones, Renaissance mythological scale, buon fresco mineral pigments, permanent architectural integration, in the style of Michelangelo's Sistine Chapel, Giotto narratives", "Illuminated Manuscript": "illuminated manuscript vellum medium, gold-leaf intricate borders, medieval script miniatures, vibrant jewel-toned decorations", "Heraldry": "heraldry emblem medium, bold primary color shields, symbolic lions in quadrants, medieval coat-of-arms symmetry", "Cartography": "cartography ink medium, antique map with compass roses and monsters, sepia decorative borders, exploratory vintage exploration", "Scientific Illustration": "scientific illustration watercolor medium, precise labeled botanicals or anatomy, accurate cross-sections, in the style of Ernst Haeckel", "Medical Diagram": "medical diagram schematic medium, color-coded organs with arrows, educational sterile cutaways, clinical precision illustrations", "Architectural Rendering": "architectural rendering digital medium, shaded perspective concepts, futuristic building elevations, detailed material simulations", "Fashion Sketch": "fashion sketch marker medium, elongated gestural figures, loose lines with fabric swatches, haute couture dynamic poses", "Storyboard": "storyboard sketch medium, sequential cinematic panels with notes, action thumbnails for film, pre-vis narrative flow", "Album Cover": "album cover graphic medium, thematic bold imagery with logos, psychedelic or minimalist music vibes, vinyl retro aesthetics", "Book Cover": "book cover illustrative medium, evocative genre motifs with typography, shadowy mystery or fantasy allure, promotional design", "Tattoo Design": "tattoo design ink medium, bold outlined symbolic icons, shaded traditional flash like skulls, neo-traditional colorful motifs", "Mandala": "mandala meditative medium, symmetrical intricate geometric layers, spiritual floral colors, Tibetan circular harmony", "Zentangle": "zentangle doodle medium, tangled black ink patterns on tiles, abstract meditative fills, no-erasure creative flow", "Paper Quilling": "paper quilling coiled medium, 3D filigree rolled strips in colorful swirls, delicate ornamental floral designs, tactile Renaissance craftsmanship, greeting card or sculptural forms", "Origami": "origami folded paper medium, geometric crease patterns, minimalist modular animals, precise Japanese precision", "Puppet Theater": "puppet theater shadow medium, marionette stage figures, folk narrative compositions, handcrafted whimsical charm", "Carnival Mask": "carnival mask sculptural medium, ornate feathered Venetian designs, gold jewel masquerade, mysterious exaggerated features", "Circus Poster": "circus poster lithograph medium, vintage bold acrobats and animals, hyperbolic colorful typography, 19th-century showbiz energy", "Travel Poster": "travel poster illustrative medium, retro vibrant exotic landmarks, Art Deco wanderlust graphics, inviting promotional style", "Infographic": "infographic digital medium, clean data icons and charts, color-coded educational layouts, modern simplistic visuals", "Emoji Art": "emoji art pixel medium, playful icon compositions, bright flat digital symbols, meme-like symbolic arrangements", "ASCII Art": "ASCII art text medium, character-based monochromatic drawings, monospace font terminal graphics, retro computer representations, old school emoticons, typewriter aesthetics", "Glitch Art": "glitch art digital medium, corrupted pixel distortions, color shift abstract errors, post-digital chaotic aesthetics", "Holographic": "holographic foil medium, iridescent 3D projections and rainbow refractions, lenticular printing illusions, laser hologram prismatic effects, futuristic shiny layered surfaces, foil stamping", "Neon Sign": "neon sign tube medium, glowing electric outlines, vibrant urban signage colors, buzzing retro atmospheric light", "Fireworks Illustration": "fireworks illustration explosive medium, sparkling radial burst trails, night sky colorful celebrations, dynamic pyrotechnic designs", "Kaleidoscope": "kaleidoscope optical medium, mirrored jewel-toned fractal symmetries, toy-inspired geometric repeats, hypnotic patterns", "Labyrinth": "labyrinth puzzle medium, intricate top-down maze pathways, mythical stone or hedge motifs, ancient navigational designs", "Rorschach Inkblot": "Rorschach inkblot symmetrical medium, abstract black blots on white, psychological ambiguous shapes, interpretive forms", "Dreamcatcher": "dreamcatcher webbed medium, hoop with feathers and beads, Native American protective patterns, ethereal bohemian symbolism", "Sand Art": "sand art layered medium, colored grain mandalas or bottles, transient desert motifs, ephemeral tactile designs", "Ice Sculpture": "ice sculpture carved medium, translucent frozen crystalline forms, melting ethereal details, temporary event beauty, chainsaw or hand-chiseled, crystal clear with LED lighting, ice hotel or competition aesthetics", "Balloon Art": "balloon art twisted medium, inflated colorful latex shapes, playful party figures, buoyant whimsical constructions", "Forensic Reconstruction": "forensic reconstruction 3D medium, skull-based digital facial renders, anthropological hyperrealistic accuracy, historical recreations", "Marble Sculpture": "marble sculpture chiseling medium, smooth classical figures with veined stone textures, Renaissance anatomical precision, in the style of Michelangelo", "Bronze Casting": "bronze casting metal medium, patina-finished lost-wax figures, ancient or modern abstract forms, durable tactile patination", "Embroidery": "embroidery textile medium, hand-stitched colorful threads on fabric, intricate floral or narrative patterns, crewel work or goldwork, contemporary hoop art, dimensional texture, blackwork or stumpwork techniques", "Quilt": "quilt patchwork medium, layered fabric blocks with stitching, folk narrative motifs in cozy patterns, heirloom comforting warmth", "Batik": "batik wax-resist medium, dyed fabric with cracked patterns, Indonesian intricate motifs, vibrant layered color bleeding, tjanting tool, hot wax, multiple dye baths, sarong or textile art", "Polaroid Photography": "polaroid photography instant medium, vintage faded borders, soft chemical imperfections, nostalgic snapshot aesthetics with light leaks", "Lomography": "lomography film medium, lo-fi analog distortions, high-contrast vignettes and color shifts, experimental cross-processed effects", "Cyanotype": "cyanotype photographic medium, Prussian blue monochrome sun prints, botanical specimens or object silhouettes, photogram technique, alternative process simplicity, in the style of Anna Atkins, blueprint aesthetic, white silhouettes", "Daguerreotype": "daguerreotype early photo medium, silver-plated mirror-like details, antique portrait sharpness, historical metallic sheen", "Pinhole Photography": "pinhole photography DIY medium, soft dreamlike long exposures, lensless light leaks, experimental abstract blurs", "Anamorphic Art": "anamorphic distortion medium, skewed perspective illusions, cylindrical mirror reveals, Renaissance optical trickery", "Scrimshaw": "scrimshaw bone carving medium, etched nautical motifs on ivory or whalebone, intricate sailor folk details, antique polished finish", "Encaustic": "encaustic wax painting medium, heated pigmented layers with translucent fusion, textured ancient technique, embedded objects and depth, in the style of Jasper Johns or Fayum portraits", "Sumi-e": "sumi-e ink wash medium, Japanese minimalist brush strokes, black ink gradients on rice paper, Zen philosophical simplicity", "Calligraphy": "calligraphy scripted medium, elegant flowing ink letters with ornamental flourishes, beautiful writing in Arabic, Chinese, or copperplate scripts, illuminated letters, gold ink, cultural traditions, lettering art", "Macramé": "macramé knotted medium, textured rope wall hangings or plant holders, bohemian geometric patterns, natural fiber tactile weaves, 1970s revival, fringe details", "Stencil Art": "stencil art cutout medium, layered spray or ink applications, urban repeatable motifs, precise graphic edges", "Airbrush": "airbrush spray medium, smooth gradient blends, hyperrealistic automotive or fantasy illustrations, soft diffused color transitions", "Collage": "collage mixed media medium, cut-and-paste layered elements, photomontage with found materials, surreal juxtapositions, in the style of Hannah Höch or Romare Bearden, decoupage assemblage", "Decoupage": "decoupage layered medium, glued paper cutouts on objects, varnished vintage ephemera motifs, Victorian craft furniture decoration, sealed surface transformations, Mod Podge techniques", "Pyrography": "pyrography wood burning medium, scorched line designs on timber, rustic wildlife or patterns, heated tool tonal shading", "Glassblowing": "glassblowing molten medium, colorful blown vessels or sculptures, translucent swirled forms, artisanal heat-shaped elegance, furnace work, in the style of Dale Chihuly or Murano glass, hot shop glory hole annealing", "Ceramics": "ceramics pottery medium, glazed clay forms, wheel-thrown or hand-built, earthy textured finishes with kiln-fired colors, coil or slab construction, earthenware, stoneware, porcelain, raku firing, crystalline glaze", "Weaving": "weaving loom medium, interlaced yarn tapestries, geometric or pictorial patterns, cultural textile narratives like Navajo rugs, warp and weft, backstrap or jacquard techniques, ikat designs", "Performance Art": "performance art live medium, body-based conceptual actions, durational or interactive work, documented in photos or video, ephemeral provocative interactions, audience participation, in the style of Marina Abramović", "Installation Art": "installation art site-specific medium, immersive environmental assemblages, found objects and lights, gallery-scale experiential concepts, in the style of Yayoi Kusama infinity rooms or James Turrell light transformations", "Street Performance": "street performance ephemeral medium, busker or flash mob scenes, captured in dynamic sketches, urban interactive energy", "Shadow Puppetry": "shadow puppetry silhouette medium, backlit cutout figures on screens, traditional storytelling movements, Indonesian wayang kulit style", "Wax Carving": "wax carving sculptural medium, detailed lost-wax models for casting, intricate jewelry or figurine prototypes, smooth meltable precision, colored wax, anatomical or candle carving, in the style of Madame Tussauds life casting", "Fiber Art": "fiber art textile medium, sculptural yarn installations, abstract knits or felts, contemporary soft material explorations", "Navajo Sand Painting": "Navajo sand painting ceremonial medium, colored sand grains in symbolic patterns, ritual healing motifs, ephemeral Native American designs with spiritual precision", "Henna Mehndi": "henna mehndi body art medium, intricate temporary skin designs, reddish-brown paste patterns, cultural wedding motifs like Indian paisleys, delicate flowing lines", "Aboriginal Dot Painting": "Aboriginal dot painting acrylic medium, symbolic dotted landscapes, earthy ochre colors, Dreamtime storytelling motifs, Australian Indigenous abstract narratives", "Celtic Knotwork": "Celtic knotwork interlaced medium, infinite woven line patterns, illuminated manuscript or stone carvings, symbolic eternal loops in green-gold tones", "Persian Miniature": "Persian miniature illustrative medium, detailed courtly scenes on paper, vibrant jewel tones with gold accents, Islamic narrative precision and floral borders", "Egyptian Hieroglyphs": "Egyptian hieroglyphs carved medium, symbolic pictorial scripts on stone or papyrus, profile figures and gods, ancient Nile motifs in bold primary colors", "Maori Ta Moko": "Maori ta moko tattoo medium, chiseled spiral patterns on skin, cultural identity symbols, black ink with facial or body narratives, New Zealand tribal heritage", "String Art": "string art nailed medium, threaded geometric patterns on wood, colorful yarn intersections, mathematical abstract designs with 3D depth", "Brass Rubbing": "brass rubbing wax medium, textured relief impressions on paper, medieval tomb engravings, monochromatic historical replicas with fine line details", "Kirigami": "kirigami cut-and-fold medium, intricate paper sculptures and pop-up designs, symmetrical patterns with negative space, Japanese precision cuts, laser-cut architectural models", "Bonsai Sculpture": "bonsai sculpture living medium, miniature tree shaping with wire, Zen balanced asymmetry, potted natural artistry evoking ancient landscapes", "Topiary": "topiary horticultural medium, sculpted hedge or shrub forms, geometric animal shapes, manicured garden elegance with green leafy textures", "Junk Art": "junk art assemblage medium, recycled scrap metal sculptures, found object collages, industrial upcycled narratives with rusty tactile welds", "Found Object Art": "found object art ready-made medium, everyday items repurposed, Duchamp-inspired absurd installations, conceptual ironic arrangements", "Bio Art": "bio art living medium, genetic engineering with organisms, bacterial cultures or tissue, laboratory aesthetics, ethical speculative questions, in the style of Eduardo Kac, transgenic forms", "Net Art": "net art internet-based medium, browser glitch aesthetics, early web design with hyperlinks, digital native interactive websites, in the style of JODI", "Yarn Bombing": "yarn bombing guerrilla medium, colorful knitted street art, urban textile interventions, community graffiti, temporary installations, bohemian fiber wraps", "Papier-mâché": "papier-mâché sculpture medium, paper pulp and newspaper strips, lightweight carnival masks or piñatas, Mexican folk art, painted surfaces, molded forms", "Book Art": "book art altered medium, carved or folded recycled literature, literary sculptures with narrative objects, in the style of Brian Dettmer", "Graffiti Lettering": "graffiti lettering aerosol medium, wildstyle or bubble letters, tag signatures with drips and highlights, urban typography, 3D effects, spray can art", "Typography Art": "typographic design medium, experimental letterpress or deconstructed text, concrete poetry word art, visual hierarchy, in the style of David Carson", "Neon Typography": "neon sign lettering medium, glowing cursive script text, custom electric glow, glass tubes, retro motel or bar signage aesthetics", "Blackletter": "blackletter calligraphy medium, Gothic Fraktur script, heavy strokes in medieval manuscripts, Germanic tradition, tattoo or metal band logo aesthetics", "Circuit Board Art": "circuit board aesthetic electronic medium, PCB green substrate with solder points, cyberpunk technological mandalas, e-waste recycled art", "Steampunk Assemblage": "steampunk assemblage mixed medium, Victorian machinery with brass gears and clockwork, alternate history found objects, industrial goggles sculptures", "Dieselpunk": "dieselpunk aesthetic retro medium, 1940s technology with art deco military machinery, sepia tones, film noir retro-futurism", "Atompunk": "atompunk style 1950s medium, nuclear age futurism with Googie architecture, ray guns and flying saucers, atomic optimism, in the style of Fallout games", "Solarpunk": "solarpunk aesthetic eco medium, green sustainable technology, bright optimistic future with vertical gardens and solar panels", "Biopunk": "biopunk art speculative medium, genetic modification with organic tech, body horror wet lab aesthetics, transgenic neon green forms", "Fused Glass": "fused glass kiln-formed medium, slumped layered sheets with bubbles and inclusions, dichroic or bullseye glass, warm glass mosaic effects", "Lampworking": "lampworking flame medium, borosilicate torch-worked beads or mini sculptures, glass rods and mandrel, scientific pipe making, hot shop precision", "Metalwork": "metalworking forged medium, blacksmithing or welded sculptures, patina on steel or bronze, repoussé chasing, lost-wax casting, industrial fabrication", "Jewelry Making": "jewelry design metalsmithing medium, stone setting with bezel or prong, wire wrapping and soldering, precious metals and gemstones, art jewelry", "Enameling": "enameling vitreous medium, cloisonné or champlevé fired glass on metal, Byzantine or Fabergé egg styles, plique-à-jour, copper base", "Damascene": "damascene inlay metal medium, gold-silver intricate patterns, Toledo or Japanese work, oxidized background, weapon or decorative motifs", "Filigree": "filigree delicate metal medium, twisted wire lace-like threads, silver or gold soldered joints, Portuguese scrollwork, intricate jewelry", "Repoussé": "repoussé hammered medium, metal relief from reverse side, three-dimensional copper or silver, ancient ornamental technique, chasing details", "Chainmail": "chainmail linked medium, metal ring fabric, medieval armor or sculptural, micro or Byzantine weave, European 4-in-1 patterns", "Bone Carving": "bone carving etched medium, scrimshaw or Maori netsuke details, traditional tools on ivory substitute, polished cultural artifacts", "Wood Carving": "wood carving whittling medium, chip or relief in-the-round, chainsaw or marquetry intarsia, burled wood hand tools, exotic finishes", "Stone Carving": "stone sculpture chiseling medium, direct marble or granite carving, pneumatic tools on limestone or alabaster, monumental Michelangelo method, soapstone details", "Sand Sculpture": "sand sculpture compacted medium, beach or competition carved details, temporary architectural forms, spray adhesive, intricate patterns", "Butter Sculpture": "butter sculpture cold medium, state fair food carving, refrigerated detailed forms, temporary Iowa State Fair aesthetics", "Soap Carving": "soap carving soft medium, decorative translucent details, Thai fruit influence, fragrant gift items, delicate fragrant sculptures", "Clay Sculpture": "clay modeling terracotta medium, air-dry or polymer plasticine, maquette figure bas-relief, unfired or ceramic forms", "Paper Sculpture": "paper sculpture 3D medium, folded or cut engineering, white-on-white shadow play, in the style of Richard Sweeney, architectural forms", "Wire Sculpture": "wire sculpture continuous medium, twisted armature lines, delicate balance and shadow art, copper linear drawing in space, in the style of Alexander Calder", "Textile Sculpture": "textile sculpture soft medium, stuffed fabric forms, sewn padding installations, wearable fiber art, in the style of Claes Oldenburg", "Felting": "felt art wool medium, wet or needle felting roving, sculptural nuno techniques, merino textile paintings, organic patterns", "Shibori": "shibori dyeing resist medium, Japanese indigo tie-dye, folding binding stitching, pole wrapping arashi or itajime, natural dye effects", "Block Printing": "block printing carved medium, textile repeat patterns, Indian woodblock hand-stamped, linocut on fabric, registration marks", "Silk Painting": "silk painting gutta medium, flowing French dyes on scarves, steam setting salt effects, alcohol techniques, wearable color gradients", "Appliqué": "appliqué fabric medium, layered collage with raw or turned edges, Hawaiian quilting or mola reverse, fusible web, geometric motifs", "Patchwork": "patchwork quilting pieced medium, geometric fabric scraps, Amish or crazy quilts, paper piecing traditional blocks", "Boro": "boro textile mending medium, Japanese visible repair with indigo patches, sashiko stitching, wabi-sabi recycled functional beauty", "Kintsugi": "kintsugi golden repair medium, Japanese pottery mending with gold lacquer, imperfection philosophy, visible precious scars, wabi-sabi", "Terrazzo": "terrazzo flooring aggregate medium, polished marble chips in epoxy, Venetian seamless patterns, geometric architectural decoration", "Scagliola": "scagliola imitation medium, pigmented plaster marble effects, Italian polished surfaces, architectural columns or facades", "Tadelakt": "tadelakt plaster lime medium, Moroccan waterproof polished stone, soap finish with earth pigments, smooth bathroom textures", "Sgraffito Ceramics": "ceramic sgraffito carved medium, revealed clay under slip, contrasting colors at leather hard stage, pottery narrative imagery", "Mishima": "mishima pottery inlaid medium, Korean carved slip lines, wiped white inlay on celadon, delicate patterns, precise wiping", "Nerikomi": "nerikomi colored clay medium, laminated marbled porcelain, Japanese cross-section patterns, millefiori precision, intricate reveals", "Naked Raku": "naked raku resist medium, crackle slip patterns with smoke, thermal shock contrasts, temporary slip carbon absorption", "Saggar Firing": "saggar firing atmospheric medium, combustible materials in contained kiln, organic metallic salt patterns, unpredictable results", "Wood Firing": "wood-fired ceramics anagama medium, natural ash glaze with flame marks, long Japanese firing, atmospheric wadding effects", "Salt Glazing": "salt glaze pottery sodium medium, orange peel texture in atmospheric kiln, German stoneware tradition, thrown salt jugs", "Crystalline Glaze": "crystalline glaze ceramics zinc medium, controlled cooling crystal growth, macro jewel-like surfaces, technical precision", "Majolica": "majolica tin-glazed medium, bright painted earthenware, Italian Renaissance narrative scenes, white opaque decoration", "Delftware": "Delft blue tin-glazed medium, cobalt on white Dutch pottery, windmills tulips hand-painted, 17th-century Chinese influence", "Celadon": "celadon jade green glaze medium, Korean/Chinese reduction firing, iron oxide crackle, translucent Song dynasty pooling", "Tenmoku": "tenmoku black glaze medium, iron saturate oil spots or hare's fur, Japanese tea bowls, high-fire crystallization, Song dynasty", "Shino": "shino glaze Japanese medium, carbon trapping orange-white crawling, pin holes wood ash, Mino tea ceremony tradition", "Oribe": "oribe ware green copper medium, asymmetrical distorted forms, Japanese abstract decoration, Furuta Oribe Mino kilns", "Bizen": "bizen unglazed stoneware medium, natural ash deposits in long wood firing, earth tones hidasuki goma sangiri, Japanese tradition", "Jomon Pottery": "jomon pottery rope-impressed medium, prehistoric Japanese coil-built, cord-marked flame style, ancient hand-built vessels", "Greek Pottery": "Greek vase painting terracotta medium, red-figure or black-figure amphora, geometric classical mythology, kylix techniques", "Native American Pottery": "Native American ceramics coil medium, pueblo burnished pit-fired, black-on-black geometric, in the style of Maria Martinez", "Smoke Firing": "smoke-fired pottery carbonization medium, black-white newspaper saggar, metal salts burnished, random primitive patterns"
};

function buildPrompt(basePrompt, artStyle) {
  if (artStyle && artStyles[artStyle]) {
    return `${basePrompt}, ${artStyles[artStyle]}`;
  }
  return basePrompt;
}

document.getElementById('clear-btn').onclick = function () {
    AppState.abortGeneration = true;
    if (AppState.currentAbortController) {
        AppState.currentAbortController.abort();
        AppState.currentAbortController = null;
    }
    AppState.isGenerating = false;
    if (AppState.revokeURLs && Array.isArray(AppState.revokeURLs)) {
        for (let url of AppState.revokeURLs) {
            try { URL.revokeObjectURL(url); } catch {}
        }
    }
    AppState.revokeURLs = [];
    FAVORITES.clear();
    document.getElementById('gallery').innerHTML = "";
    document.getElementById('progress-bar').style.width = "0%";
    document.getElementById('progress-text').textContent = "Ready to generate";
    document.getElementById('status-message').textContent = "Generation cancelled.";
    const promptElem = document.getElementById('prompt');
    if (promptElem) promptElem.blur();
};

document.getElementById('inspire-btn').onclick = async function () {
    const promptElem = document.getElementById('prompt');
    if (!promptElem) return;
    let prev = promptElem.value.trim();
    try {
        const newPrompt = await inspireMeAPIPrompt();
        if (newPrompt === prev && INSPIRE_PROMPTS.length > 1) {
            let idx = Math.floor(Math.random() * INSPIRE_PROMPTS.length);
            if (INSPIRE_PROMPTS[idx] === prev) idx = (idx + 1) % INSPIRE_PROMPTS.length;
            promptElem.value = INSPIRE_PROMPTS[idx];
        } else {
            promptElem.value = newPrompt;
        }
        promptElem.focus();
    } catch {
        let idx = Math.floor(Math.random() * INSPIRE_PROMPTS.length);
        if (INSPIRE_PROMPTS.length > 1 && INSPIRE_PROMPTS[idx] === prev) {
            idx = (idx + 1) % INSPIRE_PROMPTS.length;
        }
        promptElem.value = INSPIRE_PROMPTS[idx];
        promptElem.focus();
    }
};

document.getElementById('inspire-btn').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('inspire-btn').click();
    }
});

document.getElementById('download-all-btn').onclick = async function () {
    const imgs = document.querySelectorAll('.generated-image');
    if (!imgs.length) return;
    await batchDownloadImages(Array.from(imgs), "all-images.zip");
};

document.getElementById('download-favorites-btn').onclick = async function () {
    const favImgs = Array.from(document.querySelectorAll('.image-card[data-img-id].favorited .generated-image'));
    if (!favImgs.length) {
        showGalleryStatus("No favorites selected to download.", true);
        return;
    }
    await batchDownloadImages(favImgs, "favorite-images.zip");
};

async function batchDownloadImages(imgElems, filename) {
    const JSZip = await ensureJSZip();
    const zip = new JSZip();
    let count = 1;
    for (const img of imgElems) {
        const url = img.src;
        if (url) {
            try {
                const res = await fetch(url);
                const blob = await res.blob();
                const name = `image${count}.png`;
                zip.file(name, blob);
                count++;
            } catch {}
        }
    }
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }, 1000);
}
async function ensureJSZip() {
    if (window.JSZip) return window.JSZip;
    const s = document.createElement('script');
    s.src = "https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js";
    document.head.appendChild(s);
    await new Promise(res => { s.onload = res; });
    return window.JSZip;
}
function showGalleryStatus(msg, isError = false) {
    const statusElem = document.getElementById('status-message');
    if (statusElem) {
        statusElem.textContent = msg;
        statusElem.style.color = isError ? '#f44336' : '#48c774';
        setTimeout(() => {
            statusElem.textContent = "";
            statusElem.style.color = '';
        }, 2200);
    }
}

function setupFavoriteToggle(card, imgElem, imgId) {
    const heartBtn = card.querySelector('.fav-toggle');
    if (!heartBtn) return;
    heartBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (FAVORITES.has(imgId)) {
            FAVORITES.delete(imgId);
            card.classList.remove('favorited');
            heartBtn.setAttribute('aria-pressed', 'false');
            heartBtn.title = "Mark as favorite";
        } else {
            FAVORITES.add(imgId);
            card.classList.add('favorited');
            heartBtn.setAttribute('aria-pressed', 'true');
            heartBtn.title = "Unmark as favorite";
        }
    });
    heartBtn.addEventListener('keydown', e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            heartBtn.click();
        }
    });
}

function randomSeed() {
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] & 0x7FFFFFFF;
  }
  return Math.floor(Math.random() * 0x7FFFFFFF);
}

async function fetchWithRetry(url, maxTries = 3, signal) {
  let lastErr;
  for (let attempt = 1; attempt <= maxTries; ++attempt) {
    if (signal && signal.aborted) {
      return Promise.reject(new DOMException('Aborted', 'AbortError'));
    }
    try {
      const resp = await fetch(url, { signal });
      if (resp.status === 429) {
        throw new Error(`Rate limit exceeded (HTTP 429): Too many requests. Please wait and try again.`);
      }
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`API error ${resp.status}: ${errText}`);
      }
      const blob = await resp.blob();
      if (!blob || !blob.type.startsWith("image")) {
        throw new Error("API did not return a valid image.");
      }
      return blob;
    } catch (e) {
      lastErr = e;
      if (e.name === 'AbortError') {
        throw lastErr;
      }
      if (attempt < maxTries) {
        await new Promise(res => setTimeout(res, 950));
      }
    }
  }
  throw lastErr;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleGenerateClicked() {
  if (AppState.isGenerating) return;
  AppState.isGenerating = true;
  AppState.abortGeneration = false;

  const abortController = new AbortController();
  const signal = abortController.signal;
  AppState.currentAbortController = abortController;

  const promptElem = document.getElementById('prompt');
  const basePrompt = promptElem.value.trim();
  const count = Number(document.getElementById('count').value);
  const size = (document.getElementById('size').value || "1024,1024").split(',');
  const width = Number(size[0]);
  const height = Number(size[1]);
  const selectedModel = document.getElementById('model').value;
  const selectedStyle = document.getElementById('style').value;
  const nologo = document.getElementById('nologo').checked;
  const priv = document.getElementById('private').checked;
  const enhance = document.getElementById('enhance').checked;
  const transparent = document.getElementById('transparent').checked;
  const gallery = document.getElementById('gallery');
  const progressText = document.getElementById('progress-text');
  const progressBar = document.getElementById('progress-bar');
  const statusMessage = document.getElementById('status-message');
  const modelSeedWarning = document.getElementById('model-seed-warning');

  gallery.innerHTML = "";
  progressBar.style.width = "0%";
  progressText.textContent = "Starting generation...";
  statusMessage.textContent = "";
  if (modelSeedWarning) modelSeedWarning.style.display = 'none';

  let queue = [];
  if (isBatchModeEnabled()) {
    const allStyles = Object.keys(artStyles);
    const batchSeed = randomSeed();
    queue = allStyles.map(style => ({
      prompt: buildPrompt(basePrompt, style),
      model: selectedModel, style, width, height, seed: batchSeed,
      nologo, priv, enhance, transparent
    }));
  } else {
    for (let i = 0; i < count; ++i) {
      const thisSeed = randomSeed();
      queue.push({
        prompt: buildPrompt(basePrompt, selectedStyle),
        model: selectedModel, width, height, seed: thisSeed,
        nologo, priv, enhance, transparent,
        _displaySeed: thisSeed
      });
    }
  }

  if (modelSeedWarning && ["openai", "openai-large"].includes(selectedModel)) {
    modelSeedWarning.innerHTML = "⚠️ The selected model may ignore the seed parameter for single-image generation. As a result, all images may appear identical. Try a different model for deterministic seed-based output.";
    modelSeedWarning.style.display = 'block';
  }

  let imagesDone = 0;
  try {
    for (let i = 0; i < queue.length; ++i) {
      if (AppState.abortGeneration || signal.aborted) {
        statusMessage.textContent = "Generation was cancelled.";
        break;
      }

      progressText.textContent = `Generating image ${i + 1} of ${queue.length} (${queue[i].model})...`;

      const styleForPlaceholder = queue[i].style ? queue[i].style : (selectedStyle || "Default");
      let success = false;

      try {
        success = await doGenerateAndDisplay(queue[i], styleForPlaceholder, signal);
      } catch (err) {
        statusMessage.textContent = "A generation error occurred. Please check your network, prompt, and model settings.";
      }

      if (success) {
        imagesDone++;
      }

      progressBar.style.width = `${((i + 1) / queue.length) * 100}%`;

      if (i < queue.length - 1) {
        progressText.textContent = `Waiting before next image (rate limited)…`;
        await sleep(1200);
      }
    }
  } catch (err) {
    statusMessage.textContent = "A critical error stopped the process. Check the console.";
  } finally {
    progressBar.style.width = "100%";
    progressText.textContent = `Done. Generated ${imagesDone} image${imagesDone !== 1 ? "s" : ""}.`;
    AppState.isGenerating = false;
    AppState.currentAbortController = null;
  }
}

async function doGenerateAndDisplay(task, styleForPlaceholder, signal, retryAttempt = 1) {
    const encodedPrompt = encodeURIComponent(task.prompt);
    const params = {
      width: task.width,
      height: task.height,
      seed: task.seed,
      model: task.model,
      '_': Date.now()
    };
    if (task.nologo) params.nologo = "true";
    if (task.priv) params.private = "true";
    if (task.enhance) params.enhance = "true";
    if (task.transparent) params.transparent = "true";
    
    const searchParams = new URLSearchParams(params);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?${searchParams.toString()}`;

    const imgId = `img-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const card = document.createElement('div');
    card.className = "image-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "group");
    card.setAttribute("aria-label", task.style ? `Generated image in ${task.style} style` : `Generated image`);
    card.dataset.imgId = imgId;

    const styleTitle = document.createElement('div');
    styleTitle.className = "image-style";
    const displaySeed = (typeof task._displaySeed !== "undefined") ? task._displaySeed : task.seed;
    styleTitle.innerText = isBatchModeEnabled() ? (task.style || `Seed: ${displaySeed}`) : `Seed: ${displaySeed}`;
    card.appendChild(styleTitle);
    
    const imgCont = document.createElement('div');
    imgCont.className = "image-container";
    if (task.width && task.height) {
      imgCont.style.aspectRatio = `${task.width}/${task.height}`;
    }
    
    const placeholder = document.createElement('div');
    placeholder.className = "image-placeholder";
    imgCont.appendChild(placeholder);
    
    const imgElem = document.createElement('img');
    imgElem.className = "generated-image";
    imgElem.alt = `AI output for: ${task.prompt}`;
    imgCont.appendChild(imgElem);

    const favBtn = document.createElement('button');
    favBtn.className = "fav-toggle";
    favBtn.innerHTML = `<i class="fas fa-heart"></i>`;
    favBtn.setAttribute('aria-pressed', 'false');
    favBtn.setAttribute('aria-label', 'Mark as favorite');
    favBtn.title = "Mark as favorite";
    imgCont.appendChild(favBtn);
    
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';

    const actions = document.createElement('div');
    actions.className = "image-actions";
    
    const viewBtn = document.createElement('button');
    viewBtn.className = "action-btn";
    viewBtn.innerHTML = `<i class="fas fa-eye"></i> View`;
    viewBtn.setAttribute('aria-label', 'View full image');
    viewBtn.onclick = () => { if (imgElem.src) window.open(imgElem.src, '_blank'); };
    actions.appendChild(viewBtn);
    
    const dlBtn = document.createElement('button');
    dlBtn.className = "action-btn";
    dlBtn.innerHTML = `<i class="fas fa-download"></i> Download`;
    dlBtn.setAttribute('aria-label', 'Download image');
    dlBtn.onclick = () => {
      if (imgElem.src) {
        const a = document.createElement("a");
        a.href = imgElem.src;
        a.download = `pollinations_${task.style || 'default'}_${task.seed}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    actions.appendChild(dlBtn);
    
    overlay.appendChild(actions);
    imgCont.appendChild(overlay);

    card.appendChild(imgCont);
    
    setupFavoriteToggle(card, imgElem, imgId);

    document.getElementById('gallery').appendChild(card);
    
    try {
      placeholder.innerHTML = `<div class="placeholder-content"><i class="fas fa-magic"></i><span>Generating...${retryAttempt > 1 ? " (retry "+retryAttempt+")" : ""}</span><div class="placeholder-style-name">${styleForPlaceholder}</div></div>`;
      const blob = await fetchWithRetry(url, 3, signal);
      const src = URL.createObjectURL(blob);
      
      if (signal.aborted) {
          URL.revokeObjectURL(src);
          return false;
      }

      imgElem.src = src;
      AppState.revokeURLs.push(src);
      card.classList.add('image-loaded');
      return true;

    } catch (e) {
      if (e.name === 'AbortError') {
         placeholder.innerHTML = `<div class="placeholder-content"><i class="fas fa-ban"></i><span>Cancelled</span></div>`;
         return false;
      }
      placeholder.innerHTML = `<div class="placeholder-content" style="color:#f44336"><i class="fas fa-exclamation-triangle"></i><span>Error</span><pre style="font-size:0.95em;color:#eb9797;overflow-x:auto;max-width:350px;">${e.message || e}</pre><div style="margin-top:10px"><button class="btn action-btn" style="background:#444;border:1px solid #f44336;color:#fff" id="retry-btn">Retry</button></div></div>`;
      document.getElementById('status-message').textContent = `Error for style "${task.style || 'default'}": ${e.message}`;
      
      const retryBtn = placeholder.querySelector("#retry-btn");
      if (retryBtn) {
        retryBtn.onclick = () => {
          doGenerateAndDisplay(task, styleForPlaceholder, signal, retryAttempt + 1);
        };
      }
      return false;
    }
}


document.getElementById('generate-btn').onclick = handleGenerateClicked;

function populateArtStyles() {
  const styleDropdown = document.getElementById('style');
  if (!styleDropdown) return;
  styleDropdown.innerHTML = '<option value="">None (Default)</option>';
  const styleNames = Object.keys(artStyles).sort();
  let stylesHTML = '';
  for (const name of styleNames) {
    stylesHTML += `<option value="${name}">${name}</option>`;
  }
  styleDropdown.innerHTML += stylesHTML;
}

document.addEventListener('DOMContentLoaded', function() {
  fetchModelsAndPopulate();
  populateArtStyles();
  setupBatchToggle();
});