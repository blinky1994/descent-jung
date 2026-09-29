import type { PaletteName } from "@/lib/palettes";

/*
 * Every chapter follows the same six-part anatomy:
 *   sting → teaching → quote → experience → question → go deeper
 * Inline formatting: *emphasis* and **strong**.
 */

export type Quote = { text: string; source: string; note?: string };
export type DeeperItem = { heading: string; body: string };
export type ChapterData = {
  id: string;
  num: string;
  title: string;
  act: 1 | 2 | 3 | 4 | 5;
  palette: PaletteName;
  sting: string;
  teaching: string[];
  quote: Quote;
  question: { id: string; prompt: string; placeholder?: string };
  deeper: DeeperItem[];
  reading?: string[];
};

export type ActData = {
  n: 1 | 2 | 3 | 4 | 5;
  numeral: string;
  name: string;
  subtitle: string;
  tagline: string;
  palette: PaletteName;
  depth: [number, number];
  glyph: "surface" | "nigredo" | "albedo" | "citrinitas" | "rubedo";
  nightNote: string;
};

export const acts: ActData[] = [
  {
    n: 1,
    numeral: "I",
    name: "The Surface",
    subtitle: "Consciousness",
    tagline: "Where you think you live.",
    palette: "surface",
    depth: [0, 300],
    glyph: "surface",
    nightNote:
      "Tonight ends at dusk. Before you sleep, put a notebook beside your bed. Whatever you dream, even a fragment, write it down before you check your phone.",
  },
  {
    n: 2,
    numeral: "II",
    name: "Nigredo",
    subtitle: "The Blackening",
    tagline: "Everything that was solid dissolves.",
    palette: "nigredo",
    depth: [300, 1000],
    glyph: "nigredo",
    nightNote:
      "This is where tonight ends: in the dark. Don't fix it. Don't distract yourself out of it. Sleep in it. The first light comes tomorrow.",
  },
  {
    n: 3,
    numeral: "III",
    name: "Albedo",
    subtitle: "The Whitening",
    tagline: "The first light is moonlight.",
    palette: "night",
    depth: [1000, 700],
    glyph: "albedo",
    nightNote:
      "Tonight, before sleep, ask for a dream. Literally. Say it out loud if you have to. Then write down whatever comes.",
  },
  {
    n: 4,
    numeral: "IV",
    name: "Citrinitas",
    subtitle: "The Yellowing",
    tagline: "The dawn of meaning.",
    palette: "umber",
    depth: [700, 300],
    glyph: "citrinitas",
    nightNote:
      "Tomorrow, notice coincidences. Don't interpret them. Don't post about them. Just notice, and write them down.",
  },
  {
    n: 5,
    numeral: "V",
    name: "Rubedo",
    subtitle: "The Reddening",
    tagline: "The work becomes blood and life.",
    palette: "oxblood",
    depth: [300, 0],
    glyph: "rubedo",
    nightNote: "",
  },
];

export const chapters: ChapterData[] = [
  /* ------------------------------------------------------------------ */
  /* ACT I — THE SURFACE                                                 */
  /* ------------------------------------------------------------------ */
  {
    id: "persona",
    num: "I",
    title: "The Persona",
    act: 1,
    palette: "surface",
    sting: "Your mask isn't a lie. Believing it's all of you is.",
    teaching: [
      "In Roman theatre, the *persona* was the mask an actor held up so his voice could sound through it. Jung borrowed the word for the face you wear in the world: your role, your manners, your job title, the version of you that gets invited back.",
      "You need one. Without a persona you can't hold a job, raise a child, or survive a dinner party. The mask protects you, and it protects other people from the full weight of you. Nothing is wrong with the mask.",
      "The trouble starts when you forget you're wearing it. The doctor who can't stop being The Doctor, even in bed. The nice one who has never once said no. The strong one who can't cry in front of anyone, including themselves. Jung called this **identification with the persona**, and he considered it one of the quietest ways a life can go wrong. You become a role with a person trapped inside it.",
      "You'll know it's happened when the role starts to feel heavy. When you're applauded and feel nothing. When a loss of status feels like a loss of self. The mask has grown into your face.",
      "Every descent starts here, with an uncomfortable suspicion: the person you present, even to yourself, is not the whole story.",
    ],
    quote: {
      text: "…a kind of mask, designed on the one hand to make a definite impression upon others, and, on the other, to conceal the true nature of the individual.",
      source: "Two Essays on Analytical Psychology, CW 7, §305",
    },
    question: {
      id: "persona",
      prompt: "List the roles you play. Which one would you be most terrified to lose?",
      placeholder: "The reliable one. The funny one. The one who has it together…",
    },
    deeper: [
      {
        heading: "The persona is not the villain",
        body: "Jung was clear that a healthy persona is necessary. The opposite failure, having no working mask at all, leaves a person raw, tactless, and unable to adapt. The goal is a persona that is flexible and conscious: worn when it's needed, set down when it isn't.",
      },
      {
        heading: "When the mask swells, and when it breaks",
        body: "When the persona swells, Jung spoke of *inflation*: you start believing your title, your reputation, your brand. When it collapses, through job loss, divorce, or public failure, it can feel like annihilation, because no one underneath had ever been lived. Many midlife crises begin as persona crises.",
      },
      {
        heading: "In the age of the feed",
        body: "Jung never saw a social media profile, but he described one exactly: a curated face designed to make an impression and to conceal the rest. The more energy you pour into the curated self, the more you push into the unlived one.",
      },
    ],
    reading: ["C.G. Jung, “The Relations between the Ego and the Unconscious,” CW 7"],
  },
  {
    id: "house",
    num: "II",
    title: "The House",
    act: 1,
    palette: "surface",
    sting: "You are a house with more floors than you have ever visited.",
    teaching: [
      "In 1909, Jung and Freud sailed to America together. For seven weeks they analyzed each other's dreams. One night Jung dreamed of a house, and that dream became his first map of the human psyche.",
      "Walk through it with him. Every floor is older than the one above it.",
    ],
    quote: {
      text: "It was plain to me that the house represented a kind of image of the psyche.",
      source: "Memories, Dreams, Reflections",
    },
    question: {
      id: "house",
      prompt: "Which room in you have you never gone into?",
      placeholder: "The anger room. The grief room. The room where I keep what I wanted before I was told what to want…",
    },
    deeper: [
      {
        heading: "Personal and collective",
        body: "The personal unconscious is made of *complexes*: charged clusters of memory and feeling from your own life. The collective unconscious is made of *archetypes*: inherited patterns that shape experience in every human being. The first is your basement. The second is the bedrock the whole city stands on.",
      },
      {
        heading: "Why this dream mattered",
        body: "Jung later saw this dream as his first intuition of the collective unconscious. It also marked the start of his break with Freud, who read the psyche through personal history and sexuality. Jung felt the psyche went down much further than one person's biography.",
      },
      {
        heading: "Your own house",
        body: "In dreams, houses often picture the dreamer's psyche. Notice which floor you're on, which rooms you discover for the first time, and which doors stay locked.",
      },
    ],
  },
  {
    id: "complexes",
    num: "III",
    title: "Complexes",
    act: 1,
    palette: "dusk",
    sting: "You think you have complexes. The truth is they have you.",
    teaching: [
      "Before he was a mystic, Jung was a lab scientist. At the Burghölzli hospital in Zürich he read people a list of a hundred words and timed how long they took to answer each one with the first word that came to mind. He used a stopwatch.",
      "Most answers came fast. But some words made people stall, stumble, repeat the word back, laugh, or go blank. When Jung followed those hesitations, he found emotionally charged clusters of memory, image, and feeling. He called them **complexes**.",
      "A complex behaves like a splinter personality. It has its own memory, its own emotional logic, even its own voice. Most of the time it sleeps. Then someone uses a certain tone, or you smell a certain smell, or a certain word lands, and it takes the wheel. You say things you don't mean. You react like you're seven years old. Afterwards you say *I wasn't myself*, and you're exactly right.",
      "You don't get rid of complexes. You get to know them, so you can tell when one has grabbed the wheel. Try Jung's test yourself.",
    ],
    quote: {
      text: "The via regia to the unconscious, however, is not the dream, as he thought, but the complex, which is the architect of dreams and of symptoms.",
      source: "A Review of the Complex Theory, CW 8, §210",
    },
    question: {
      id: "complex",
      prompt: "Which word made you hesitate? What was the first thing you thought of before you typed something else?",
    },
    deeper: [
      {
        heading: "How the original test worked",
        body: "Jung and his colleague Franz Riklin timed reactions with a stopwatch and used the median, which Jung called the *probable mean*, as each person's baseline. They also watched for other *complex indicators*: repeating the stimulus word, answering with several words, not answering at all, and forgetting an answer when the list was repeated. Later, with Frederick Peterson, Jung measured skin conductance too. It was an early relative of the lie detector.",
      },
      {
        heading: "Complexes are normal",
        body: "Everyone has them: a mother complex, a father complex, a money complex, a power complex. A complex only becomes a problem when it's completely unconscious and running your life from behind.",
      },
      {
        heading: "Signs a complex has you",
        body: "Your reaction is out of proportion to what happened. You replay the conversation for days. Your voice changes. You feel young. You feel absolutely certain and absolutely right. Afterwards you feel ashamed, or you can't quite remember what you said.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* ACT II — NIGREDO                                                    */
  /* ------------------------------------------------------------------ */
  {
    id: "shadow",
    num: "IV",
    title: "The Shadow",
    act: 2,
    palette: "nigredo",
    sting: "The person you hate most is carrying a letter addressed to you.",
    teaching: [
      "As a child you learned quickly what got you love and what got you punished, ignored, or shamed. So you split yourself. What was welcome you kept and called *me*. What wasn't you pushed out of sight. That second self, everything you refused to be so you could be accepted, is what Jung called **the shadow**.",
      "It didn't go away. It went underground, and it comes back in two ways. As **projection**: you see it everywhere except in yourself, and it enrages you in other people. And as **eruption**: the moment you snap, the cruelty you didn't know you had, the affair, the binge, the humiliating outburst. It seemed to come from nowhere. It came from you.",
      "Here is what most people miss: the shadow isn't only dark. If you were raised to be humble, your ambition is down there. If anger wasn't allowed, your strength is down there too, along with your desire, your talent, your voice, and your ability to say *no*. Jungians call this **the gold in the shadow**. The thing you disowned is often the very thing you need.",
      "Shadow work isn't about becoming dark. It's about becoming *whole*, so the dark stops running your life from the basement. Someone who knows their own cruelty is far less dangerous than someone who is sure they have none.",
    ],
    quote: {
      text: "One does not become enlightened by imagining figures of light, but by making the darkness conscious.",
      source: "The Philosophical Tree, CW 13, §335",
    },
    question: {
      id: "shadow",
      prompt: "What quality did you have to kill in yourself to be loved as a child?",
    },
    deeper: [
      {
        heading: "Projection doesn't make them innocent",
        body: "When someone irritates you, the trait may really be theirs. Projection means the *charge* is yours: the intensity, the obsession, the need to keep talking about it. A useful test: *does this bother me more than it should?* If it does, something in you is giving it a place to hang.",
      },
      {
        heading: "We project our gold, too",
        body: "Excessive admiration, hero worship, and falling hard for a guru can all mean you've handed someone qualities that are really yours, unlived. Take those back as well.",
      },
      {
        heading: "How to actually work with it",
        body: "Notice your strongest reactions and keep a record of them. Ask what the offending trait would look like if it were healthy in you: arrogance might become confidence, laziness might become rest, selfishness might become self-respect. Watch your dreams for figures of your own sex who repel you. And tell one trusted person the thing you'd least like them to know.",
      },
    ],
    reading: [
      "Robert A. Johnson, Owning Your Own Shadow",
      "Connie Zweig & Jeremiah Abrams (eds.), Meeting the Shadow",
      "C.G. Jung, Aion, CW 9ii, ch. 2",
    ],
  },
  {
    id: "projection",
    num: "V",
    title: "Projection & Fate",
    act: 2,
    palette: "nigredo",
    sting: "If it keeps happening, it isn't bad luck. It's you, meeting yourself.",
    teaching: [
      "There's a law in Jung's psychology that sounds like mysticism and turns out to be brutally practical: *what you don't face inside, you meet outside.*",
      "The same partner in a different body. The same boss in a different office. The same betrayal, the same rescue, the same fight about the dishes that was never about the dishes. You change the city, the job, the relationship, and somehow the plot survives the move.",
      "It survives because the plot isn't out there. An unconscious complex works like a magnet. It draws certain people to you, draws certain reactions out of you, and arranges events until its story gets told again. Freud called this the *repetition compulsion*. Jung saw something more purposeful in it: the psyche keeps staging the scene until you finally recognize yourself in it.",
      "Withdrawing a projection is one of the most humbling things a person can do. You have to admit that the villain in your story was wearing your face. It's also one of the most freeing, because what you own, you can change.",
    ],
    quote: {
      text: "The psychological rule says that when an inner situation is not made conscious, it happens outside, as fate.",
      source: "Aion, CW 9ii, §126",
      note: "You'll often see this online as “Until you make the unconscious conscious, it will direct your life and you will call it fate.” That version is a paraphrase. These are Jung's words.",
    },
    question: {
      id: "pattern",
      prompt: "What keeps happening to you? What's the common denominator?",
    },
    deeper: [
      {
        heading: "This is not victim-blaming",
        body: "Some things really do happen *to* us: accidents, abuse, injustice, illness. Jung's rule doesn't say you caused them. It says that where there's a *repeating pattern*, look for the part that belongs to you, because that's the only part you can do anything about.",
      },
      {
        heading: "How projections actually end",
        body: "Projections rarely dissolve through insight alone. They wear thin through repeated collision. You notice it, you react anyway, and next time you notice a little sooner. Slowly the hook loses its bait, and what's left is the other person as they actually are. You may be meeting them for the first time.",
      },
      {
        heading: "Fate and destiny",
        body: "Later Jungians such as James Hollis draw a line between *fate*, which happens to the unconscious person, and *destiny*, the same forces met consciously and lived deliberately. The events may be identical. What changes is whether you're a character in the story or its co-author.",
      },
    ],
  },
  {
    id: "dark-night",
    num: "VI",
    title: "The Dark Night of the Soul",
    act: 2,
    palette: "abyss",
    sting: "Something in you is dying. Let it.",
    teaching: [],
    quote: {
      text: "No tree, it is said, can grow to heaven unless its roots reach down to hell.",
      source: "Aion, CW 9ii, §78",
    },
    question: {
      id: "dark-night",
      prompt: "What in you is dying right now? What have you been refusing to let die?",
    },
    deeper: [
      {
        heading: "Dark night, or depression?",
        body: "Here's a rough guide. Depression tends to flatten everything. A dark night often carries a sense, however faint, that something is being asked of you. But you don't have to diagnose yourself, and the two often overlap. Therapy and medication don't cancel spiritual meaning; Jung himself was a psychiatrist. Get support either way.",
      },
      {
        heading: "The night-sea journey",
        body: "The ethnologist Leo Frobenius collected myths of heroes swallowed by sea monsters. They travel east through the dark and come out at sunrise, often having lost their hair to the heat inside. Jung read these myths as pictures of the ego being swallowed by the unconscious: a temporary death that comes before renewal. Jonah and the whale is the version you probably know.",
      },
      {
        heading: "The Red Book",
        body: "Jung recorded his visions in black notebooks, then spent some sixteen years copying and illuminating them into a large red leather folio in calligraphy and paint. He never published it. It sat with his family, and eventually in a bank vault, until 2009, when it was finally released as *The Red Book: Liber Novus*.",
      },
    ],
    reading: [
      "St. John of the Cross, The Dark Night",
      "C.G. Jung, The Red Book: Liber Novus, ed. Sonu Shamdasani",
      "James Hollis, Swamplands of the Soul",
      "Thomas Moore, Dark Nights of the Soul",
    ],
  },

  /* ------------------------------------------------------------------ */
  /* ACT III — ALBEDO                                                    */
  /* ------------------------------------------------------------------ */
  {
    id: "anima",
    num: "VII",
    title: "Anima & Animus",
    act: 3,
    palette: "night",
    sting: "The first time you fell in love, you fell in love with a part of yourself you'd never met.",
    teaching: [
      "Deep in the psyche, past the shadow, Jung found another figure. It isn't the self you hide. It's the *other* you carry: a soul-image, strange and magnetic, that turns up in dreams as a mysterious woman, a dark stranger, or a guide. It fascinates you and pulls you toward life.",
      "Jung called it the **anima** in men and the **animus** in women. You usually meet it first through projection. Someone walks into a room and you're undone before they say a word. You don't know them yet, but you *recognize* them. That instant certainty is one of the clearest signs that part of your own psyche has just been cast onto another person.",
      "That's why falling in love feels like destiny, and why it sours when the real person refuses to keep playing the part. The work isn't to stop falling in love. It's to take the image back in time: to have a relationship with the figure inside you, and to let the person in front of you be merely, wonderfully human.",
      "Jung saw this soul-image developing in stages, from raw instinct toward wisdom. Watch them rise as the moon waxes.",
      "**A plain word about the dated parts.** Jung built this model on the gender assumptions of early twentieth-century Switzerland, with men as *logos* and women as *eros*. Much of that hasn't aged well. Many contemporary Jungians treat anima and animus as *the psyche's other*: the unknown counterpart in anyone, of any gender, wherever it turns up. Keep the insight and drop the stereotypes.",
    ],
    quote: {
      text: "Every man carries within him the eternal image of woman, not the image of this or that particular woman, but a definite feminine image.",
      source: "Marriage as a Psychological Relationship, CW 17, §338",
    },
    question: {
      id: "anima",
      prompt: "Describe the kind of person who always undoes you. What part of you might they be carrying?",
    },
    deeper: [
      {
        heading: "When the other possesses you",
        body: "Jung described the negative side bluntly. The possessed anima makes a person moody, touchy, sentimental, and sulky. The possessed animus makes a person rigidly opinionated, arguing from secondhand authority and handing down cold verdicts. Strip away the gendering and the pattern still holds: an unconscious *other* makes us *less* like ourselves, not more.",
      },
      {
        heading: "The inner marriage",
        body: "The long arc of this work is what the alchemists called the *coniunctio*, the sacred marriage. It isn't about finding the perfect partner. It's the union of opposites inside one psyche: conscious and unconscious, masculine and feminine, spirit and matter. You'll meet it again in Act V.",
      },
      {
        heading: "Where the stages come from",
        body: "Jung set out the four stages of the anima (Eve, Helen, Mary, Sophia) in *The Psychology of the Transference*. The four stages of the animus were set out by Marie-Louise von Franz in *Man and His Symbols*.",
      },
    ],
    reading: [
      "Emma Jung, Animus and Anima",
      "Robert A. Johnson, We: Understanding the Psychology of Romantic Love",
      "C.G. Jung, Aion, CW 9ii, ch. 3",
    ],
  },
  {
    id: "dreams",
    num: "VIII",
    title: "Dreams",
    act: 3,
    palette: "silver",
    sting: "Every night you receive a letter. Most people never open it.",
    teaching: [
      "Freud believed dreams were disguises: forbidden wishes dressed up to slip past a censor. Jung disagreed. For him a dream hides nothing. It's a *spontaneous self-portrait* of your psyche, painted in the only language the unconscious speaks, which is images.",
      "And dreams have a job. Jung called it **compensation**. When your waking attitude becomes one-sided, dreams bring in what's missing. The person who feels superior dreams of being small. The person who always accommodates dreams of violence. A dream is a correction, a second opinion from the other half of you.",
      "So don't buy a dream dictionary. A snake in your dream and a snake in mine are not the same snake. Jung's method has two moves. First comes **personal association**: what does *this* image mean to *you*? Then comes **amplification**: where does the image turn up in myth, fairy tale, religion, and art? The personal tells you what the dream is about. The mythic tells you how deep it goes.",
      "One last rule, and it's the hardest one: a dream almost never tells you what you already know. If your interpretation flatters you or confirms what you already believe, try again.",
    ],
    quote: {
      text: "The dream is a spontaneous self-portrayal, in symbolic form, of the actual situation in the unconscious.",
      source: "General Aspects of Dream Psychology, CW 8, §505",
    },
    question: {
      id: "dream-unforgettable",
      prompt: "Write down a dream you've never been able to forget.",
    },
    deeper: [
      {
        heading: "Big dreams",
        body: "Jung distinguished ordinary personal dreams from rare *big dreams*: numinous, mythic, remembered for decades. They tend to come at life's thresholds, like adolescence, midlife, serious illness, or the approach of death. If you've had one, it's still working on you.",
      },
      {
        heading: "Read the series, not the single dream",
        body: "One dream is a sentence. A series of dreams is a story. Jung preferred to interpret dreams in sequence and watch the motifs change over months. Keep a journal and date every entry. Patterns you can't see in a week become obvious in a year.",
      },
      {
        heading: "Two levels",
        body: "Every figure in a dream can be read two ways. On the *objective* level, your mother in a dream is your actual mother. On the *subjective* level, she is the mother in you: the part of you that nurtures, controls, or smothers. Try both readings.",
      },
    ],
    reading: [
      "Robert A. Johnson, Inner Work",
      "C.G. Jung, Dreams (Princeton selection)",
      "James Hillman, The Dream and the Underworld",
    ],
  },
  {
    id: "active-imagination",
    num: "IX",
    title: "Active Imagination",
    act: 3,
    palette: "moon",
    sting: "Stop analyzing your inner figures. Talk to them.",
    teaching: [
      "During his dark night Jung found something no one had systematized before. You don't have to wait for the unconscious to show up in dreams. You can meet it *awake*.",
      "He called the method **active imagination**. You let an image arise: a figure, an animal, a landscape. You don't invent it. You let it come, and you watch it move on its own. Then you do the unthinkable and *engage*. You speak to it. You ask it what it wants. You wait for an answer, and when one comes, you take it as seriously as you would from a real person.",
      "The key is to stay yourself. Active imagination isn't daydreaming, where the ego drifts, and it isn't fantasy, where the ego writes the script. It's a real conversation between two parties, and that's why it changes you.",
      "Philemon, Jung's inner teacher, told him that thoughts aren't something you make. They live in the psyche the way animals live in a forest, and you can go and meet them there.",
      "**A caution.** This is strong medicine. If you have a history of psychosis, dissociation, or severe trauma, do this only with a trained guide. Everyone else: start small and stay grounded. When the session ends, eat something and go for a walk.",
    ],
    quote: {
      text: "…in his view thoughts were like animals in the forest, or people in a room, or birds in the air.",
      source: "Memories, Dreams, Reflections, on Philemon",
    },
    question: {
      id: "active",
      prompt: "Who appeared? What did they say?",
    },
    deeper: [
      {
        heading: "The four steps",
        body: "Robert A. Johnson breaks the method into four stages. First, *invite* the unconscious. Second, *dialogue* with what comes. Third, bring in the *ethical element*: you keep your values, and you don't simply obey. Fourth, make it *concrete* with a small physical ritual that grounds what you learned. Step four is the one people skip, and it's the one that makes the change stick.",
      },
      {
        heading: "It doesn't have to be words",
        body: "Jung painted and carved stone. Others dance, sculpt, work in a sand tray, or write the dialogue out as a script. The medium matters less than the attitude: take the image seriously, and stay present.",
      },
    ],
    reading: [
      "C.G. Jung, “The Transcendent Function,” CW 8",
      "Barbara Hannah, Encounters with the Soul",
      "Robert A. Johnson, Inner Work",
    ],
  },

  /* ------------------------------------------------------------------ */
  /* ACT IV — CITRINITAS                                                 */
  /* ------------------------------------------------------------------ */
  {
    id: "archetypes",
    num: "X",
    title: "Archetypes",
    act: 4,
    palette: "umber",
    sting: "You are not the author of your deepest patterns. You're the latest actor in a very old play.",
    teaching: [
      "Beneath your personal history lies something you didn't earn and can't lose: the **collective unconscious**. It isn't a store of inherited memories. It's a set of inherited *patterns*, ready-made ways of perceiving and responding that every human being is born with, the way a bird is born knowing how to build a nest.",
      "Jung called these patterns **archetypes**. You never see an archetype directly. You see only the images it produces, and those images vary from culture to culture while the shape underneath stays the same. Every culture's mother is different, but *The Mother* is recognizable everywhere. So are the hero who leaves home, the trickster who breaks the rules, the wise old figure at the crossroads, and the child who shouldn't have survived but did.",
      "That's why myths move you. They aren't just stories about other people. They're *maps of your own depths*, drawn by humanity over thousands of years.",
      "It's also where the danger lies. An archetype is enormous, far bigger than any one person. When you identify with one, you don't become a god. **You become possessed.** Jung called this **inflation**: the mother who can't stop mothering, the hero who can't stop fighting, the guru who has stopped being a person. Relate to an archetype, but never become it.",
    ],
    quote: {
      text: "…a common psychic substrate of a suprapersonal nature which is present in every one of us.",
      source: "Archetypes of the Collective Unconscious, CW 9i, §3",
    },
    question: {
      id: "archetype",
      prompt: "Which archetype has been running your life without asking?",
    },
    deeper: [
      {
        heading: "Archetype and archetypal image",
        body: "Jung compared the archetype to the *axial system of a crystal*: an invisible structure that sets the crystal's shape without being any particular crystal itself. The images, such as Mary, Demeter, Kali, or your own grandmother, are the crystals.",
      },
      {
        heading: "Not a personality quiz",
        body: "Pop culture has turned archetypes into brand personalities and quiz results. *Which archetype are you?* is the opposite of Jung's point. You aren't *an* archetype. Archetypes are forces that move through everyone. The question isn't which one you are. It's which one has you.",
      },
    ],
    reading: [
      "C.G. Jung, The Archetypes and the Collective Unconscious, CW 9i",
      "Joseph Campbell, The Hero with a Thousand Faces",
      "Erich Neumann, The Great Mother",
      "Marie-Louise von Franz, The Problem of the Puer Aeternus",
    ],
  },
  {
    id: "types",
    num: "XI",
    title: "Psychological Types",
    act: 4,
    palette: "amber",
    sting: "Watch where you fall apart under stress. That's your door.",
    teaching: [
      "Jung spent years puzzling over why he and Freud, both brilliant and both honest, could look at the same patient and see completely different things. His answer became *Psychological Types* (1921), and it changed how the world talks about personality.",
      "First there are two **attitudes**: the direction your energy naturally flows. In **extraversion** it flows outward, toward people, objects, and events. In **introversion** it flows inward, toward your own response to them. Jung didn't coin these words, but he's the reason you use them.",
      "Then there are four **functions**, four ways of taking in and judging the world. **Sensation** tells you *what is*. **Intuition** tells you *what could be*. **Thinking** tells you *what it means*. **Feeling** tells you *what it's worth*. Everyone uses all four, but we each lead with one, the **superior function**, and neglect its opposite.",
      "That neglected opposite is the **inferior function**, and it's the part the personality quizzes leave out. It's childish, touchy, primitive, and slow. It ambushes you under stress, and it's where you're at your most embarrassing. Marie-Louise von Franz taught that it's also the *door to the unconscious*: where your weakness forces you to grow, and where new life gets in.",
      "**A note:** the Myers-Briggs Type Indicator was built later, by Katharine Briggs and Isabel Briggs Myers, on top of Jung's ideas. It isn't his system, and he never meant types to be boxes. The point isn't to know your type. It's to know your *blind side*.",
    ],
    quote: {
      text: "The shoe that fits one person pinches another; there is no recipe for living that suits all cases.",
      source: "Modern Man in Search of a Soul",
    },
    question: {
      id: "types",
      prompt: "What do you do badly, childishly, or only under pressure? What might that part of you be trying to become?",
    },
    deeper: [
      {
        heading: "Rational and irrational",
        body: "Jung called Thinking and Feeling *rational* functions because both judge and order experience, one by logic and the other by value. He called Sensation and Intuition *irrational*, not because they're unreasonable, but because they perceive without judging. Opposites sit on the same axis: a strong Thinker's Feeling lags behind, and a strong Intuitive's Sensation lags behind.",
      },
      {
        heading: "Midlife and the inferior function",
        body: "In the first half of life you build on your strengths. In the second half, Jung suggested, the neglected functions demand their turn. The engineer takes up painting. The artist finally does their taxes and finds an unexpected peace in it. The second half of life often starts in the inferior function.",
      },
    ],
    reading: [
      "C.G. Jung, Psychological Types, CW 6",
      "Marie-Louise von Franz & James Hillman, Lectures on Jung's Typology",
      "Daryl Sharp, Personality Types",
    ],
  },
  {
    id: "synchronicity",
    num: "XII",
    title: "Synchronicity",
    act: 4,
    palette: "dawn",
    sting: "Sometimes the world answers.",
    teaching: [
      "You think of someone you haven't heard from in ten years, and your phone lights up with their name. You dream of a stranger and meet them the next week. The one book you need falls off a shelf. Most of the time, that's coincidence. But some coincidences land with a force that feels like a message.",
      "Jung called these **synchronicities**: *meaningful coincidences*, where an inner state and an outer event line up with no causal link between them, only meaning. He turned the idea over for decades and finally set it out in 1952, in a book he published with the physicist **Wolfgang Pauli**. Pauli was a Nobel laureate and one of the architects of quantum mechanics. Twenty years earlier he had been Jung's patient, and a prolific dreamer.",
      "Jung's most famous example happened in his own consulting room.",
    ],
    quote: {
      text: "…the simultaneous occurrence of a certain psychic state with one or more external events which appear as meaningful parallels to the momentary subjective state.",
      source: "Synchronicity: An Acausal Connecting Principle, CW 8",
    },
    question: {
      id: "sync",
      prompt: "When has the world answered you?",
    },
    deeper: [
      {
        heading: "Jung and Pauli",
        body: "Pauli came to Jung in the early 1930s in crisis, after his mother's suicide and a failed marriage. He brought hundreds of dreams, many of which Jung later analyzed in *Psychology and Alchemy*. Their friendship lasted decades. Together they published *The Interpretation of Nature and the Psyche* (1952), and they shared a speculation that mind and matter might be two faces of one underlying reality, which Jung called the *unus mundus*.",
      },
      {
        heading: "The lightning",
        body: "Those close to Jung said that shortly after he died, on 6 June 1961, lightning struck a tall tree in his garden. Whether that was synchronicity or a thunderstorm in June depends on who's telling the story. That's exactly the point.",
      },
    ],
    reading: [
      "C.G. Jung, “Synchronicity: An Acausal Connecting Principle,” CW 8",
      "Roderick Main, Jung on Synchronicity and the Paranormal",
      "Arthur I. Miller, 137: Jung, Pauli, and the Pursuit of a Scientific Obsession",
    ],
  },
  {
    id: "self",
    num: "XIII",
    title: "The Self",
    act: 4,
    palette: "saffron",
    sting: "You are not the center of yourself.",
    teaching: [
      "You've spent your life assuming that *I*, the ego, the voice in your head that says *me*, is the whole show. Jung's most radical claim is that it isn't. The ego is the center of consciousness, but consciousness is a small lit clearing in a very large forest.",
      "The center of the *whole* psyche, conscious and unconscious together, is what Jung called **the Self**. It's the archetype of wholeness: the organizing intelligence behind your dreams, the pull toward becoming who you're meant to be, the thing your symptoms keep trying to steer you back to. The ego stands to the Self, he wrote, as the moved stands to the mover.",
      "Between 1916 and 1918, still shaken by his dark night, Jung began drawing a small circular design in his notebook every morning. He noticed that the drawings tracked his inner state. They were ragged when he was disturbed and balanced when he was whole. Only later did he learn that the East had a name for them: **mandalas**. He came to believe that the psyche produces circles on its own when it's trying to heal, in dreams, in children's drawings, in rose windows, and in sand.",
      "As a psychologist, Jung was careful not to make claims about metaphysics. But he said that in experience, the Self and the image of God can't be told apart. And in 1959 a BBC interviewer asked him outright whether he believed in God.",
    ],
    quote: {
      text: "I don't need to believe. I know.",
      source: "Face to Face, BBC Television, 1959",
    },
    question: {
      id: "self",
      prompt: "What is the center you keep circling around?",
    },
    deeper: [
      {
        heading: "The Self is not self-improvement",
        body: "The Self isn't your *best self* or *higher self* in the self-help sense. It includes your darkness. It often demands the opposite of what the ego wants, and it doesn't care about your comfort. It cares about your *wholeness*. Jung put it bluntly: the experience of the Self is always a defeat for the ego (CW 14, §778).",
      },
      {
        heading: "Why circles",
        body: "Jung found the mandala turning up independently all over the world: in Tibetan sand paintings, Navajo healing ceremonies, Gothic rose windows, and the dreams of patients who had never seen any of them. A circle with a center is the psyche's own drawing of wholeness.",
      },
    ],
    reading: [
      "C.G. Jung, Mandala Symbolism",
      "Edward Edinger, Ego and Archetype",
      "Murray Stein, Jung's Map of the Soul",
    ],
  },

  /* ------------------------------------------------------------------ */
  /* ACT V — RUBEDO                                                      */
  /* ------------------------------------------------------------------ */
  {
    id: "opposites",
    num: "XIV",
    title: "The Tension of Opposites",
    act: 5,
    palette: "oxblood",
    sting: "Maturity is holding two truths without killing either one.",
    teaching: [
      "Heraclitus noticed it twenty-five centuries ago, and Jung made it a law of the psyche: *anything pushed to its extreme turns into its opposite.* Jung called this **enantiodromia**. The saint develops a secret vice. The rebel becomes the tyrant. The person who is only ever nice eventually explodes. Hold any attitude one-sidedly enough and the unconscious calls up its opposite.",
      "So most of us live on a pendulum. We swing from discipline to binge, from devotion to cynicism, from one kind of relationship to its opposite and back again. Every swing feels like freedom. It's the same trap, reversed.",
      "Jung's way out is simple to describe and almost unbearable to do. When two opposites are at war inside you, **don't pick a side.** And don't compromise either. Hold both, consciously and deliberately. Feel the full tension without collapsing it, and wait.",
      "If you can bear it, something happens that Jung saw as the core of psychological transformation. The psyche produces a *third thing*: a symbol, an image, a new attitude that neither side could have produced alone or even imagined. He called this the **transcendent function**. It doesn't split the difference. It lifts you to a level where the conflict takes on a different shape.",
      "Try it below. It's harder than it looks.",
    ],
    quote: {
      text: "The confrontation of the two positions generates a tension charged with energy and creates a living, third thing … a living birth that leads to a new level of being, a new situation.",
      source: "The Transcendent Function, CW 8, §189",
    },
    question: {
      id: "opposites",
      prompt: "What two things inside you are at war? What might the third thing be?",
    },
    deeper: [
      {
        heading: "Why compromise isn't it",
        body: "A compromise gives each side half and satisfies neither, so the conflict just waits for its next chance. The transcendent function works differently. *Freedom* against *belonging* might resolve not into a bit of both, but into a vocation where your freedom is your gift to the group. You can't think your way there. You have to hold the tension until the answer arrives.",
      },
      {
        heading: "Symbols as bridges",
        body: "For Jung a true symbol is the best possible expression of something still largely unknown. It holds together what the mind keeps apart, which is why symbols change people and arguments rarely do. When the third thing comes, it often comes as an image: in a dream, in a drawing, or as a sudden picture in the mind.",
      },
    ],
    reading: ["C.G. Jung, “The Transcendent Function,” CW 8", "Jeffrey C. Miller, The Transcendent Function"],
  },
  {
    id: "individuation",
    num: "XV",
    title: "Individuation",
    act: 5,
    palette: "blood",
    sting: "The goal was never to be good. It was to be whole.",
    teaching: [
      "Everything you've walked through has a name. Jung called it **individuation**: the lifelong process of becoming the particular, undivided person you actually are, rather than the person your family, your culture, or your fear arranged for you to be.",
      "It isn't perfection. Perfection means cutting off everything that doesn't fit the ideal, and that's exactly how shadows get made. Individuation means *completeness*: bringing the cut-off parts home, even the ugly ones. It makes you less shiny and more real.",
      "It isn't individualism either. An individuated person isn't more selfish, just less divided, and so better able to belong to others without disappearing into them. Jung wrote that individuation doesn't shut you off from the world. It gathers the world to you.",
      "And it has a season. The first half of life, Jung said, is for building an ego: a career, a family, a place in the world. Somewhere around midlife that program runs out. What used to work stops working, and the applause goes quiet. That isn't failure. It's the **afternoon of life**, asking a different question. Not *what will I achieve?* but *what am I for?*",
      "Many people who make this journey become what Jung called a **wounded healer**: someone whose deepest injury becomes the source of their power to help. Your wound isn't a detour from your life. It may be the road.",
    ],
    quote: {
      text: "We cannot live the afternoon of life according to the programme of life's morning; for what was great in the morning will be little at evening, and what in the morning was true will at evening have become a lie.",
      source: "The Stages of Life, CW 8, §784",
    },
    question: {
      id: "individuation",
      prompt: "Who are you becoming that you weren't allowed to be?",
    },
    deeper: [
      {
        heading: "The middle passage",
        body: "James Hollis calls the midlife crisis the *Middle Passage*: the point where the provisional personality you built to survive childhood stops working, and something older asks to be lived. It shows up as depression, affairs, rage, and restlessness. Its purpose is to carry you from the life you were handed to a life that is actually yours.",
      },
      {
        heading: "No one finishes",
        body: "There's no enlightened endpoint. Jung was still working weeks before he died. What there is instead is a deepening relationship between the ego and the Self, and a life that feels more and more like your own.",
      },
      {
        heading: "The red stone",
        body: "The alchemists pictured the goal as a wedding: king and queen, sun and moon, joined in one body. In *The Psychology of the Transference*, Jung followed this image through the woodcuts of the *Rosarium Philosophorum* (1550) as a picture of the psyche uniting its opposites. The red stone of the rubedo is that union made real.",
      },
    ],
    reading: [
      "James Hollis, The Middle Passage",
      "James Hollis, Finding Meaning in the Second Half of Life",
      "Edward Edinger, Anatomy of the Psyche",
    ],
  },
  {
    id: "return",
    num: "XVI",
    title: "The Return",
    act: 5,
    palette: "sunrise",
    sting: "Now go back. Nothing looks different. Everything is.",
    teaching: [
      "The descent is worthless unless you live it. Insight that stays in the notebook is just a more sophisticated persona.",
      "In 1923, the year his mother died, Jung began building a stone tower on the shore of Lake Zürich at Bollingen. He cut stone himself. There was no electricity and no running water. He chopped wood, pumped water, and cooked his own meals. The man who mapped the collective unconscious spent his happiest days doing ordinary, physical, simple things.",
      "That's where the work ends: at a kitchen table, not on a mountaintop. You go back to your job, your family, your ordinary Tuesday. The mask comes back too, because you still need it. But now you know it's a mask. You hold it instead of wearing it. Its cracks show, and they've been filled with gold.",
      "Everything you wrote on the way down has been kept below. The alchemists did their work inside a sealed vessel, the *vas hermeticum*, because if anything leaked out the work would fail. Yours is sealed too. Nothing you wrote has left this device.",
    ],
    quote: {
      text: "At Bollingen I am in the midst of my true life, I am most deeply myself.",
      source: "Memories, Dreams, Reflections",
    },
    question: {
      id: "return",
      prompt: "What will you carry back into your ordinary Tuesday?",
    },
    deeper: [],
  },
];

export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<string, ChapterData>;
export const chaptersInAct = (n: number) => chapters.filter((c) => c.act === n);
