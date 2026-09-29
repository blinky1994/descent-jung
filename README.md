# Descent

An initiation into the psychology of C.G. Jung, in five acts: a single long-scroll experience that descends from the persona to the dark night of the soul and returns through the alchemical stages (nigredo → albedo → citrinitas → rubedo). Built from [PROMPT.md](PROMPT.md).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out, deployable anywhere
```

## Structure

| Path | What lives there |
|---|---|
| `content/chapters.ts` | All 16 chapters (sting, teaching, quote, question, go-deeper) and the five acts. Edit the words here. |
| `content/extras.ts` | Data for the interactive pieces: timeline, house floors, dark-night screens, archetypes, types, dream amplifications, reading lists, care resources. |
| `components/Experience.tsx` | Smooth scroll (Lenis), the stage color arc, depth gauge, chapter tracking, sound stages. |
| `components/Chapter.tsx` | The six-part chapter anatomy, act cards, Five Nights breaks. |
| `components/experiences/` | One file per signature interaction (Mask, House, Word Association, Mirror, Loop, Dark Night, Moon, Dream Workshop, Active Imagination, Constellation, Types, Scarab, Mandala, Hold, Individuation spiral, Vessel, Finale). |
| `lib/palettes.ts` | The color arc. Every section names a palette; root CSS variables tween between them. |
| `lib/store.ts` | The Vessel and settings: localStorage with in-memory fallback. Nothing is sent anywhere. |
| `lib/audio.ts` | Generative Web Audio score, one patch per stage. Off by default. |

## Notes

- **Quotes** are cited to the *Collected Works* and *Memories, Dreams, Reflections*. Paragraph numbers are believed correct but should be checked against a printed edition before publishing.
- **Reduced motion** (system setting, or the toggle in the Index) replaces pinned and scrubbed scenes with static ones and turns the lantern into a reading band.
- **Privacy:** no analytics, no network calls for user content. The Vessel exports to `.md` or prints to PDF.
