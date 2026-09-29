/* Content that feeds the interactive experiences. */

export const timeline = [
  { year: "1875", text: "Born in Kesswil, Switzerland, the son of a country pastor who was quietly losing his faith." },
  { year: "1900", text: "Joins the Burghölzli psychiatric hospital in Zürich. He treats the delusions of psychotic patients as meaning, not noise." },
  { year: "1904", text: "The word-association experiments begin. Within a few years they make him internationally known." },
  { year: "1907", text: "Meets Freud in Vienna. They talk for thirteen hours straight. Freud comes to call him his crown prince." },
  { year: "1912", text: "Publishes the book that breaks with Freud. Within two years he has lost his mentor, most of his colleagues, and his university post." },
  { year: "1913", text: "The “confrontation with the unconscious” begins: visions, near-madness, and The Red Book." },
  { year: "1921", text: "Psychological Types. Introversion and extraversion enter the world's vocabulary." },
  { year: "1923", text: "Begins building a stone tower at Bollingen, on the shore of Lake Zürich." },
  { year: "1928", text: "Discovers alchemy, and realizes the alchemists were describing the psyche." },
  { year: "1944", text: "A heart attack and a vision of Earth seen from space. His most important books come afterwards." },
  { year: "1961", text: "Dies at home in Küsnacht on 6 June. He is 85." },
];

export type Floor = {
  palette: "surface" | "hearth" | "vault" | "cave";
  depth: string;
  label: string;
  title: string;
  dream: string;
  meaning: string;
};

export const floors: Floor[] = [
  {
    palette: "surface",
    depth: "Upper floor",
    label: "18th century",
    title: "The Salon",
    dream:
      "It's his house, though he doesn't recognize it. He's upstairs, in a salon furnished in the rococo style, with fine old paintings on the walls. It's comfortable and well kept. He's surprised to find that it's his.",
    meaning:
      "**Consciousness.** The furnished room where you receive guests. Everything here is arranged, lit, and presentable.",
  },
  {
    palette: "hearth",
    depth: "Ground floor",
    label: "15th–16th century",
    title: "The Old Rooms",
    dream:
      "He goes downstairs. Everything here is older and darker: medieval furnishings, red brick floors. He realizes he has to explore the whole house.",
    meaning:
      "**The personal unconscious.** Your own forgotten history: what you lived through, pushed down, and stopped looking at. The rooms are still furnished. You just haven't been down in years.",
  },
  {
    palette: "vault",
    depth: "Cellar",
    label: "Roman",
    title: "The Vault",
    dream:
      "A heavy door. Stone steps lead down into a vaulted cellar, very ancient. The walls are Roman.",
    meaning:
      "**The inherited layer.** Deeper than your own life: your family's patterns, your culture's assumptions, and centuries of belief you never chose but live out anyway.",
  },
  {
    palette: "cave",
    depth: "Beneath the floor",
    label: "Prehistoric",
    title: "The Cave",
    dream:
      "In the stone floor there's a slab with an iron ring. He lifts it. Narrow steps lead down into a low cave cut into the rock. Thick dust. Scattered bones and broken pottery. Two human skulls, very old and half crumbled. Then he wakes.",
    meaning:
      "**The collective unconscious.** It isn't yours. It's everyone's: the primordial layer where the human animal still lives, older than language and shared by everyone who has ever dreamed.",
  },
];

export const houseCoda =
  "Freud kept pressing him to say whose death those skulls meant he secretly wished for. Jung gave him an answer he didn't believe, just to end the conversation. He knew then that he would have to find his own way down.";

/** Stimulus words drawn from the list Jung used in his association experiments (CW 2). */
export const stimulusWords = [
  "head",
  "green",
  "water",
  "to sing",
  "dead",
  "long",
  "ship",
  "to pay",
  "window",
  "friendly",
  "cold",
  "pride",
  "lamp",
  "angry",
  "bread",
  "to sin",
  "rich",
  "money",
  "child",
  "to marry",
  "family",
  "to fear",
  "brother",
  "to kiss",
  "lie",
];

export type DarkScreen = {
  label?: string;
  kind?: "text" | "quote" | "list" | "blunt";
  body: string[];
  source?: string;
};

export const darkScreens: DarkScreen[] = [
  {
    label: "i · Where the words come from",
    body: [
      "The phrase *dark night of the soul* belongs to **St. John of the Cross**, a sixteenth-century Spanish friar. His own brothers locked him in a cell barely larger than his body. Out of that darkness came a poem about a night that turned out to be the road to God.",
      "The night is dark, he wrote, not because the light is gone, but because it's too strong for the eyes the soul has.",
    ],
  },
  {
    label: "ii · The same country",
    body: [
      "Jung mapped the same territory in his own language. The alchemists called it the **nigredo**, the blackening, when everything in the vessel rots before it can transform. Myths call it the **night-sea journey**: the hero swallowed by the whale, carried through the dark belly, and spat out on a new shore. The Greeks called it the **nekyia**, the descent to the land of the dead.",
      "The words are different. The country is the same.",
    ],
  },
  {
    label: "iii · His own night",
    body: [
      "In the autumn of 1913, a year after the break with Freud, Jung was travelling alone when a vision overwhelmed him: a monstrous flood covering Europe, and the water turning to blood. Two weeks later it came again. He was sure he was going mad.",
      "That December, sitting at his desk, he stopped resisting. *He let himself drop.* He fell into images, voices, and figures. One of them, an old man with the wings of a kingfisher named **Philemon**, became his inner teacher.",
    ],
  },
  {
    label: "iv · What kept him alive",
    body: [
      "He didn't escape it, and he didn't drown in it. He anchored himself. He kept seeing his patients. He kept eating dinner with his wife and children. He later wrote that his family and his work were the ground he could always come back to, proof that he was still an ordinary, existing person.",
      "When the emotions got too strong, he did yoga until he could go back in. And he wrote everything down. Those notebooks became *The Red Book*.",
    ],
  },
  {
    label: "v · The most important time",
    body: [
      "More than forty years later he said that those years, when he was pursuing the inner images, were *the most important time* of his life. Everything that came after, the theories, the books, and the whole map on this site, came out of that night.",
      "Jung didn't discover the unconscious by studying it. He survived it.",
    ],
  },
  {
    label: "vi · What the dark night is",
    body: [
      "It's the collapse of an identity that has become too small for you. The old meanings stop working. Prayer goes silent. Ambition tastes like ash. You can't be who you were, and you don't know who comes next.",
      "From the inside it feels like failure. From the far side it looks like the first stage of the work.",
    ],
  },
  {
    label: "vii · What to do in the dark",
    kind: "list",
    body: [
      "**Don't rush out.** The night keeps its own time. Forcing the dawn only makes the night longer.",
      "**Don't numb it.** Whatever stops you feeling it also stops it working.",
      "**Don't decide it means you're broken.** Something is being broken *down*. That's different.",
      "**Keep one anchor.** A job, a person, a walk, a routine. Jung had his family and his patients. You need something that proves you still exist.",
      "**Record the images.** Dreams, fragments, drawings. The unconscious speaks in pictures, so give it paper.",
      "**Wait.** Not passively, but attentively, the way you wait in a dark room for your eyes to adjust.",
    ],
  },
  {
    kind: "quote",
    body: ["Neurosis is always a substitute for legitimate suffering."],
    source: "Psychology and Religion, CW 11, §129",
  },
  {
    body: [
      "Much of our misery is what we do to avoid the one pain we actually need to feel. The dark night *is* that pain. It is legitimate.",
    ],
  },
  {
    kind: "quote",
    body: ["No tree, it is said, can grow to heaven unless its roots reach down to hell."],
    source: "Aion, CW 9ii, §78",
  },
  {
    kind: "blunt",
    body: ["Nobody gets out of the dark by thinking positive thoughts.", "You get out by going through."],
  },
];

export const animaStages = [
  {
    n: "I",
    anima: "Eve",
    animus: "Power",
    text: "Instinct and the body. Pure attraction: the mother, the lover, the physically strong.",
  },
  {
    n: "II",
    anima: "Helen",
    animus: "Action",
    text: "Romance and beauty. The muse and the hero: still personal, still idealized.",
  },
  {
    n: "III",
    anima: "Mary",
    animus: "The Word",
    text: "Devotion and meaning. Love lifted into the spiritual: the preacher, the teacher, the voice.",
  },
  {
    n: "IV",
    anima: "Sophia",
    animus: "Meaning",
    text: "Wisdom. The soul becomes a guide, a mediator between you and the depths.",
  },
];

export type Archetype = {
  id: string;
  name: string;
  possessed: string;
  related: string;
  note?: string;
  /** constellation: star points in a local 0..140 box, and line pairs */
  stars: [number, number][];
  lines: [number, number][];
  at: [number, number];
};

export const archetypes: Archetype[] = [
  {
    id: "hero",
    name: "The Hero",
    possessed:
      "Everything is a battle. You can't rest, you can't lose, and you can't ask for help. You mistake your cause for your self. Burnout is the hero's usual death.",
    related:
      "Courage in service of something larger than you. You fight the dragons that are actually yours, and you know when the fight is over.",
    note: "For Jung, the hero myth is the ego wrestling itself free of the unconscious. Later in life it has to learn to bow to something greater.",
    stars: [
      [10, 120],
      [45, 85],
      [80, 50],
      [120, 10],
      [30, 55],
      [70, 100],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [4, 1],
      [1, 5],
    ],
    at: [90, 70],
  },
  {
    id: "mother",
    name: "The Great Mother",
    possessed:
      "Nurture that smothers. Love that needs to be needed. Or, from the other side, a whole life spent waiting for someone to finally hold you.",
    related: "Care that knows when to let go: the power to nourish others, and yourself, without swallowing anyone.",
    note: "Jung called her both *loving and terrible*: the one who gives life and the one who devours it.",
    stars: [
      [0, 10],
      [12, 70],
      [45, 105],
      [95, 105],
      [128, 70],
      [140, 10],
      [70, 60],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
    at: [420, 40],
  },
  {
    id: "sage",
    name: "The Wise Old Man",
    possessed: "The guru trip. You have answers for everyone and questions for no one. Your wisdom has hardened into certainty.",
    related: "Insight that arrives just when it's needed: the inner teacher who helps you see. Jung's was Philemon.",
    stars: [
      [60, 0],
      [60, 60],
      [60, 140],
      [38, 22],
      [82, 22],
      [60, 42],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [3, 0],
      [0, 4],
      [3, 5],
      [5, 4],
    ],
    at: [780, 30],
  },
  {
    id: "trickster",
    name: "The Trickster",
    possessed: "Sabotage, clever lies, and charming self-destruction. You break what you built and call it freedom.",
    related:
      "Humor, disruption, the holy fool who punctures what's pompous. The trickster shows up when a life has grown too rigid to breathe.",
    note: "Jung wrote a whole essay on him, the figure behind Hermes, Loki, Coyote, and the court jester.",
    stars: [
      [0, 0],
      [55, 35],
      [25, 62],
      [95, 100],
      [70, 110],
      [130, 140],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
    at: [60, 380],
  },
  {
    id: "child",
    name: "The Divine Child",
    possessed: "The need to be special. Wounded innocence as an identity. Waiting to be rescued.",
    related:
      "New possibility arriving just where you'd given up. In dreams, a child often announces a future self that's trying to be born.",
    note: "Jung wrote that the child motif points ahead, toward a future change of personality.",
    stars: [
      [60, 60],
      [60, 5],
      [115, 60],
      [60, 115],
      [5, 60],
    ],
    lines: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
    at: [440, 300],
  },
  {
    id: "maiden",
    name: "The Maiden",
    possessed: "Perpetual innocence. Waiting to be chosen. Always the one things happen to.",
    related:
      "Openness and receptivity: the capacity for new life. Persephone is dragged into the underworld and comes back as its queen.",
    note: "Jung and the mythologist Karl Kerényi wrote on her together, under her Greek name: *Kore*.",
    stars: [
      [60, 0],
      [100, 25],
      [100, 70],
      [60, 92],
      [20, 70],
      [20, 25],
      [60, 140],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [3, 6],
    ],
    at: [760, 330],
  },
  {
    id: "puer",
    name: "The Eternal Youth",
    possessed:
      "The provisional life: *this isn't really it yet.* Every commitment feels like a cage. You're forty and still waiting for real life to begin.",
    related:
      "Enthusiasm, spirit, the refusal to go dead inside. Grounded in commitment, the *puer aeternus* becomes the creative spirit.",
    note: "Marie-Louise von Franz's lectures on the puer are still uncomfortably accurate.",
    stars: [
      [0, 45],
      [38, 18],
      [70, 45],
      [102, 18],
      [140, 45],
      [70, 95],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [2, 5],
    ],
    at: [250, 190],
  },
];

export type Fn = "thinking" | "feeling" | "sensation" | "intuition";

/** `inferior` describes how the *opposite* function behaves when this one leads. */
export const functions: Record<
  Fn,
  { name: string; asks: string; kind: string; opposite: Fn; inferior: string }
> = {
  thinking: {
    name: "Thinking",
    asks: "Is it true? What does it mean?",
    kind: "rational",
    opposite: "feeling",
    inferior:
      "Emotions arrive all at once, either sentimental or volcanic. You're ambushed by tears at a film and frozen in personal conflict. You're loyal but unable to say so. Your values are strong, but they're primitive.",
  },
  feeling: {
    name: "Feeling",
    asks: "Does it matter? What is it worth?",
    kind: "rational",
    opposite: "thinking",
    inferior:
      "Under stress your thinking turns rigid and negative: sweeping generalizations, cold verdicts, brooding circles around a few fixed ideas. You win arguments you never needed to have.",
  },
  sensation: {
    name: "Sensation",
    asks: "What is actually here?",
    kind: "irrational",
    opposite: "intuition",
    inferior:
      "Dark premonitions. Catastrophic what-ifs. A sudden fascination with the uncanny. When the future does get in, it arrives as dread.",
  },
  intuition: {
    name: "Intuition",
    asks: "Where is this going?",
    kind: "irrational",
    opposite: "sensation",
    inferior:
      "You forget to eat, and then you binge. You ignore your body until it screams. Facts, money, and paperwork feel like quicksand. Under stress, pleasure turns compulsive.",
  },
};

export type Amplification = { keys: string[]; title: string; text: string };

export const amplifications: Amplification[] = [
  {
    keys: ["water", "sea", "ocean", "lake", "river", "flood", "wave", "drown", "swim"],
    title: "Water",
    text: "Among the oldest images of the unconscious itself. Think of the flood, baptism, the womb, and the sea where heroes are swallowed. Is the water calm, rising, or pulling you under?",
  },
  {
    keys: ["house", "home", "room", "rooms", "attic", "basement", "cellar", "building"],
    title: "House",
    text: "Often the dreamer's own psyche. Remember Jung's house. Which floor are you on? What room are you discovering for the first time?",
  },
  {
    keys: ["snake", "serpent", "snakes", "viper", "python"],
    title: "Serpent",
    text: "Danger, instinct, and healing, all at once. It's the staff of Asclepius, the tempter in Eden, and the ouroboros eating its own tail. It sheds its skin to be renewed. What is ready to shed its skin in you?",
  },
  {
    keys: ["stranger", "man", "woman", "figure", "person", "someone", "intruder"],
    title: "The unknown figure",
    text: "An unknown part of you. If the figure repels you and shares your sex, look to the shadow. If it fascinates you, look to the soul-image, the anima or animus. What does the stranger want?",
  },
  {
    keys: ["chased", "chase", "chasing", "pursued", "running", "hunted", "follow", "followed"],
    title: "Pursuit",
    text: "What you run from in waking life grows legs at night. The classic Jungian move is to turn around in the dream, or in active imagination, and ask the pursuer what it wants.",
  },
  {
    keys: ["fall", "falling", "fell", "cliff", "height", "heights"],
    title: "Falling",
    text: "Losing your footing, or an inflated position meeting gravity. Where in life have you climbed too high, or lost the ground under you?",
  },
  {
    keys: ["teeth", "tooth"],
    title: "Teeth",
    text: "A common and much-discussed image. It can suggest a loss of power or face, of the ability to bite, or of a stage of life, the way children lose their milk teeth.",
  },
  {
    keys: ["death", "dead", "dying", "die", "funeral", "grave", "corpse", "killed"],
    title: "Death",
    text: "It's rarely literal. More often something is ending so something else can begin: an attitude, a role, a chapter. Who or what died in the dream?",
  },
  {
    keys: ["child", "baby", "infant", "boy", "girl", "pregnant", "birth"],
    title: "Child",
    text: "The divine child: new possibility, and the future self trying to be born. Is the child neglected, endangered, or glowing?",
  },
  {
    keys: ["fire", "burning", "flame", "flames", "burn"],
    title: "Fire",
    text: "The alchemical fire: passion, destruction, and transformation. Nothing changes in the vessel without heat.",
  },
  {
    keys: ["fly", "flying", "flew", "float", "floating"],
    title: "Flight",
    text: "Liberation, or inflation. Flying dreams can mean you've risen above something, or that you're avoiding the ground. Jung would ask you to be honest about which.",
  },
  {
    keys: ["car", "driving", "drive", "bus", "train", "vehicle", "brakes"],
    title: "Vehicles",
    text: "How you're moving through life. The key question: *who is driving?*",
  },
  {
    keys: ["mother", "mom", "mum", "father", "dad", "parent", "parents"],
    title: "Parents",
    text: "Read it twice: once as your actual parent, and once as the parent *in* you, the inner voice that nurtures, judges, or controls. Behind both stands the archetype.",
  },
  {
    keys: ["stairs", "staircase", "ladder", "elevator", "lift", "descend", "descending", "climb", "climbing"],
    title: "Stairs",
    text: "Movement between levels of the psyche. Going down usually means going deeper into the unconscious. Going up can be escape, or ascent.",
  },
  {
    keys: ["exam", "test", "school", "class", "teacher", "late"],
    title: "Exam",
    text: "Being tested, or being unprepared. Often it's an old lesson that life is asking you to learn again. What are you being examined on right now?",
  },
  {
    keys: ["naked", "nude", "undressed", "clothes"],
    title: "Nakedness",
    text: "The persona has slipped. Exposure, shame, or a sudden and unexpected honesty.",
  },
  {
    keys: ["animal", "dog", "cat", "wolf", "bear", "horse", "bird", "lion", "tiger", "spider"],
    title: "Animals",
    text: "Instinct, and a particular kind of instinct. What is *this* animal like? Is it wild or tame, wounded or dangerous? Our dreams remember that we're animals.",
  },
];

export const genericAmplification =
  "There's no fixed dictionary. Ask yourself: where else does this image appear? In myths, fairy tales, scripture, films, songs? What's the oldest version of it you know? Write down every echo, however loose.";

export const imaginationPrompts = [
  { at: 0, text: "Close your eyes for a moment. Breathe. Let the room fall away." },
  { at: 30, text: "Let an image come. Don't choose it. A figure, an animal, a landscape: whatever arrives first." },
  { at: 75, text: "Watch it. Don't direct it. Let it move on its own." },
  { at: 120, text: "Speak to it. Ask: Who are you? What do you want?" },
  { at: 165, text: "Wait for the answer. Don't write the answer you'd like. Write the one that comes." },
  { at: 210, text: "Answer back. Stay yourself. You're allowed to disagree." },
  { at: 270, text: "Thank it. Let it go. Come back to the room slowly." },
];

export const pathMarkers = [
  "Persona",
  "The House",
  "Complexes",
  "Shadow",
  "Projection",
  "Dark Night",
  "Anima",
  "Dreams",
  "Imagination",
  "Archetypes",
  "Types",
  "Synchronicity",
  "The Self",
  "Opposites",
];

export const loopLines = [
  "New partner. Same fight.",
  "New job. Same humiliation.",
  "New city. Same loneliness.",
  "New diet. Same binge.",
  "New friends. Same betrayal.",
  "New start. Same ending.",
];

export const personaRoles = [
  "The Reliable One",
  "The Nice One",
  "The Strong One",
  "The Funny One",
  "The Expert",
  "The Good Child",
  "The Provider",
  "The One Who's Fine",
];

export const furtherReading = {
  start: [
    ["C.G. Jung", "Memories, Dreams, Reflections", "his autobiography, recorded and edited by Aniela Jaffé (1962)"],
    ["C.G. Jung et al.", "Man and His Symbols", "the only book he designed for general readers (1964)"],
    ["Anthony Stevens", "Jung: A Very Short Introduction", ""],
    ["Murray Stein", "Jung's Map of the Soul", ""],
  ],
  deeper: [
    ["C.G. Jung", "The Red Book: Liber Novus", "ed. Sonu Shamdasani (2009)"],
    ["C.G. Jung", "Aion", "and The Archetypes and the Collective Unconscious (CW 9ii, 9i)"],
    ["C.G. Jung", "Modern Man in Search of a Soul", "(1933)"],
    ["Marie-Louise von Franz", "Shadow and Evil in Fairy Tales", ""],
    ["Edward Edinger", "Ego and Archetype", ""],
    ["James Hollis", "The Middle Passage", ""],
    ["Robert A. Johnson", "Inner Work", ""],
    ["Marion Woodman", "Addiction to Perfection", ""],
    ["James Hillman", "The Soul's Code", ""],
    ["St. John of the Cross", "The Dark Night", ""],
  ],
  watch: [
    ["BBC", "Face to Face (1959)", "Jung interviewed by John Freeman"],
    ["Mark Whitney", "Matter of Heart (1986)", "documentary with those who knew him"],
  ],
};

export const careResources = [
  { label: "Find a helpline anywhere in the world", detail: "findahelpline.com", href: "https://findahelpline.com" },
  { label: "United States & Canada", detail: "Call or text 988", href: "tel:988" },
  { label: "UK & Ireland: Samaritans", detail: "116 123", href: "tel:116123" },
  { label: "Anywhere", detail: "Your local emergency number", href: "" },
];

export const shadowAsides = [
  {
    label: "The collective shadow",
    title: "Groups have basements too",
    body: "A nation, a party, a church, or a family that believes it is purely good has to put its darkness somewhere, so it finds a scapegoat: the immigrant, the heretic, the other side. Jung lived through two world wars and watched whole populations possessed by what they refused to see in themselves. When everyone around you is certain who the evil ones are, check your own basement.",
  },
  {
    label: "An honest aside",
    title: "Jung's own shadow",
    body: "The man who named the shadow had one. In the 1930s Jung wrote about “Jewish” and “Aryan” psychology in terms that were rightly condemned as antisemitic, and he took a leadership role in a German-dominated medical society while it was being Nazified. He also helped Jewish colleagues, and after the war he reportedly admitted to Rabbi Leo Baeck, *I slipped up.* He became romantically entangled with a former patient, Sabina Spielrein, and kept a decades-long relationship with Toni Wolff inside his marriage. None of this cancels the map. It proves the point: insight exempts no one. Least of all you.",
  },
];
