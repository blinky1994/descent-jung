type GlyphName = "surface" | "nigredo" | "albedo" | "citrinitas" | "rubedo";

/** Alchemical stage marks, drawn as thin line glyphs. */
export default function Glyph({
  name,
  size = 22,
  className,
  draw = false,
}: {
  name: GlyphName;
  size?: number;
  className?: string;
  draw?: boolean;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.1,
    strokeLinecap: "round" as const,
    className: `glyph ${draw ? "glyph--draw" : ""} ${className ?? ""}`,
    "aria-hidden": true,
  };
  switch (name) {
    case "surface":
      return (
        <svg {...common}>
          <path pathLength={1} d="M3 16.5h18" />
          <path pathLength={1} d="M6.5 16.5a5.5 5.5 0 0 1 11 0" />
        </svg>
      );
    case "nigredo":
      return (
        <svg {...common}>
          <circle pathLength={1} cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="5.2" fill="currentColor" stroke="none" className="glyph-fill" />
        </svg>
      );
    case "albedo":
      return (
        <svg {...common}>
          <path pathLength={1} d="M15.5 3.8a8.5 8.5 0 1 0 0 16.4a6.6 6.6 0 0 1 0-16.4z" />
        </svg>
      );
    case "citrinitas":
      return (
        <svg {...common}>
          <circle pathLength={1} cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" className="glyph-fill" />
        </svg>
      );
    case "rubedo":
      return (
        <svg {...common}>
          <circle pathLength={1} cx="12" cy="12" r="9.5" />
          <path pathLength={1} d="M12 3.2 19.6 16.4H4.4Z" />
          <circle pathLength={1} cx="12" cy="12" r="3.9" />
        </svg>
      );
  }
}
