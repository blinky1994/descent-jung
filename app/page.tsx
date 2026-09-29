import Experience from "@/components/Experience";
import Prologue from "@/components/Prologue";
import Chapter, { ActCard, NightBreak } from "@/components/Chapter";
import { Reveal } from "@/components/parts";
import { acts, chapterById as c } from "@/content/chapters";
import { shadowAsides } from "@/content/extras";
import { rich } from "@/lib/rich";
import PersonaMask from "@/components/experiences/PersonaMask";
import HouseDescent from "@/components/experiences/HouseDescent";
import WordAssociation from "@/components/experiences/WordAssociation";
import Mirror from "@/components/experiences/Mirror";
import Loop from "@/components/experiences/Loop";
import DarkNight from "@/components/experiences/DarkNight";
import MoonPhases from "@/components/experiences/MoonPhases";
import DreamWorkshop from "@/components/experiences/DreamWorkshop";
import ActiveImagination from "@/components/experiences/ActiveImagination";
import Constellation from "@/components/experiences/Constellation";
import TypesCompass from "@/components/experiences/TypesCompass";
import Scarab from "@/components/experiences/Scarab";
import MandalaCanvas from "@/components/experiences/MandalaCanvas";
import Hold from "@/components/experiences/Hold";
import IndividuationPath from "@/components/experiences/IndividuationPath";
import Vessel from "@/components/experiences/Vessel";
import { Finale, ReturnMask } from "@/components/experiences/Finale";

function Act({ n, children }: { n: 1 | 2 | 3 | 4 | 5; children: React.ReactNode }) {
  const a = acts[n - 1];
  return (
    <div className={`act act--${n}`} data-act={n} data-depth-from={a.depth[0]} data-depth-to={a.depth[1]}>
      <ActCard act={a} />
      {children}
    </div>
  );
}

function ShadowAsides() {
  return (
    <div className="asides" data-palette="nigredo">
      {shadowAsides.map((s, i) => (
        <Reveal key={s.title} className="aside" delay={i * 120}>
          <div className="eyebrow">{s.label}</div>
          <h3>{s.title}</h3>
          <p>{rich(s.body)}</p>
        </Reveal>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <Experience>
      <Prologue />

      <Act n={1}>
        <Chapter data={c.persona} experienceClass="ch-exp--bleed">
          <PersonaMask />
        </Chapter>
        <Chapter data={c.house} expPalette={null} outroPalette="cave" experienceClass="ch-exp--bleed">
          <HouseDescent />
        </Chapter>
        <Chapter data={c.complexes}>
          <WordAssociation />
        </Chapter>
      </Act>
      <NightBreak after={acts[0]} next={acts[1]} palette="dusk" />

      <Act n={2}>
        <Chapter data={c.shadow} afterExperience={<ShadowAsides />}>
          <Mirror />
        </Chapter>
        <Chapter data={c.projection}>
          <Loop />
        </Chapter>
        <DarkNight />
      </Act>
      <NightBreak after={acts[1]} next={acts[2]} palette="abyss" />

      <Act n={3}>
        <Chapter data={c.anima} experienceClass="ch-exp--bleed">
          <MoonPhases />
        </Chapter>
        <Chapter data={c.dreams}>
          <DreamWorkshop />
        </Chapter>
        <Chapter data={c["active-imagination"]}>
          <ActiveImagination />
        </Chapter>
      </Act>
      <NightBreak after={acts[2]} next={acts[3]} palette="moon" />

      <Act n={4}>
        <Chapter data={c.archetypes}>
          <Constellation />
        </Chapter>
        <Chapter data={c.types}>
          <TypesCompass />
        </Chapter>
        <Chapter data={c.synchronicity}>
          <Scarab />
        </Chapter>
        <Chapter data={c.self}>
          <MandalaCanvas />
        </Chapter>
      </Act>
      <NightBreak after={acts[3]} next={acts[4]} palette="saffron" />

      <Act n={5}>
        <Chapter data={c.opposites}>
          <Hold />
        </Chapter>
        <Chapter data={c.individuation} experienceClass="ch-exp--bleed">
          <IndividuationPath />
        </Chapter>
        <Chapter data={c.return}>
          <ReturnMask />
        </Chapter>
      </Act>

      <Vessel />
      <Finale />
    </Experience>
  );
}
