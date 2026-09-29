/**
 * The alchemical color arc. Every section of the site names one of these
 * palettes; the root CSS variables are tweened between them as you scroll.
 */
export type Palette = {
  bg: string;
  ink: string;
  dim: string;
  accent: string;
  glow: string;
};

export type SoundStage =
  | "surface"
  | "dusk"
  | "nigredo"
  | "abyss"
  | "albedo"
  | "citrinitas"
  | "rubedo";

export const palettes = {
  // Prologue — the threshold
  void: { bg: "#050404", ink: "#dcd4c7", dim: "#8a8276", accent: "#e0703a", glow: "#c2410c" },
  // Act I — the surface
  surface: { bg: "#efeae0", ink: "#1c1b19", dim: "#5f5a52", accent: "#34506f", glow: "#8aa3c2" },
  hearth: { bg: "#2a231d", ink: "#efe6d7", dim: "#a89a88", accent: "#dc956a", glow: "#8a4b2a" },
  vault: { bg: "#1a1c20", ink: "#e1dcd3", dim: "#959089", accent: "#aebbcc", glow: "#4a5568" },
  cave: { bg: "#0b0a09", ink: "#dad1c3", dim: "#8c8479", accent: "#cfae78", glow: "#6b5a3e" },
  dusk: { bg: "#14161b", ink: "#ded7cb", dim: "#8f8b85", accent: "#9fb3cf", glow: "#3d4f6b" },
  // Act II — nigredo
  nigredo: { bg: "#0a0908", ink: "#d8d0c4", dim: "#8c857b", accent: "#e06a2e", glow: "#c2410c" },
  abyss: { bg: "#040303", ink: "#d2c9bb", dim: "#7d756b", accent: "#e07b43", glow: "#9a3412" },
  // Act III — albedo
  night: { bg: "#0d1117", ink: "#e3e7ed", dim: "#8f99a6", accent: "#bfcad6", glow: "#6f8196" },
  silver: { bg: "#171c24", ink: "#e6e9ee", dim: "#9aa3af", accent: "#c9d2dc", glow: "#8292a6" },
  moon: { bg: "#e6e3dc", ink: "#212328", dim: "#5b5f67", accent: "#44525f", glow: "#a8b3bf" },
  // Act IV — citrinitas
  umber: { bg: "#19110a", ink: "#f0e5cd", dim: "#a8936f", accent: "#dcb64c", glow: "#c9a227" },
  amber: { bg: "#2a1c0d", ink: "#f3e7cd", dim: "#b39d77", accent: "#e6c35c", glow: "#c9a227" },
  dawn: { bg: "#ecddb6", ink: "#2a1c0c", dim: "#6a5536", accent: "#80560a", glow: "#c9a227" },
  saffron: { bg: "#f0d690", ink: "#2a1a08", dim: "#664b20", accent: "#744500", glow: "#b8860b" },
  // Act V — rubedo
  oxblood: { bg: "#3b0d0d", ink: "#f4e5d7", dim: "#c49e93", accent: "#f0654a", glow: "#b91c1c" },
  blood: { bg: "#250707", ink: "#f2e2d4", dim: "#bb958a", accent: "#ef6a4f", glow: "#b91c1c" },
  sunrise: { bg: "#f6e9dc", ink: "#3b0d0d", dim: "#7a4d43", accent: "#a8231b", glow: "#f0a070" },
} satisfies Record<string, Palette>;

export type PaletteName = keyof typeof palettes;

export const soundFor: Record<PaletteName, SoundStage> = {
  void: "abyss",
  surface: "surface",
  hearth: "dusk",
  vault: "dusk",
  cave: "nigredo",
  dusk: "dusk",
  nigredo: "nigredo",
  abyss: "abyss",
  night: "albedo",
  silver: "albedo",
  moon: "albedo",
  umber: "citrinitas",
  amber: "citrinitas",
  dawn: "citrinitas",
  saffron: "citrinitas",
  oxblood: "rubedo",
  blood: "rubedo",
  sunrise: "rubedo",
};
