import Image from "next/image";

/**
 * Theme-aware MASR 360 logo.
 * Both colourways are rendered and CSS shows the right one for [data-theme],
 * so there is no hydration mismatch and no flash when the theme toggles.
 *
 * variant:
 *  - "inline"  → sun icon + horizontal wordmark (header, drawer)
 *  - "lockup"  → official full lockup (footer, auth pages)
 *  - "sun"     → icon only
 */
const SOURCES = {
  inline: {
    light: { src: "/brand/m360-wordmark-dark.png", w: 900, h: 150 },
    dark: { src: "/brand/m360-wordmark-light.png", w: 900, h: 150 },
  },
  lockup: {
    light: { src: "/brand/m360-lockup-dark.png", w: 900, h: 240 },
    dark: { src: "/brand/m360-lockup-light.png", w: 900, h: 240 },
  },
  sun: {
    light: { src: "/brand/sun-brown.png", w: 600, h: 600 },
    dark: { src: "/brand/sun-cream.png", w: 600, h: 600 },
  },
};

export default function BrandLogo({
  variant = "inline",
  alt = "MASR 360",
  priority = false,
  className = "",
}) {
  const set = SOURCES[variant] || SOURCES.inline;

  if (variant === "inline") {
    return (
      <span className={`brand-logo brand-logo--inline ${className}`}>
        <span className="brand-logo__sun" aria-hidden="true">
          <Image
            className="on-light"
            src={SOURCES.sun.light.src}
            width={64}
            height={64}
            alt=""
            priority={priority}
          />
          <Image
            className="on-dark"
            src={SOURCES.sun.dark.src}
            width={64}
            height={64}
            alt=""
            priority={priority}
          />
        </span>
        <span className="brand-logo__word">
          <Image
            className="on-light"
            src={set.light.src}
            width={set.light.w}
            height={set.light.h}
            alt={alt}
            priority={priority}
          />
          <Image
            className="on-dark"
            src={set.dark.src}
            width={set.dark.w}
            height={set.dark.h}
            alt={alt}
            priority={priority}
          />
        </span>
      </span>
    );
  }

  return (
    <span className={`brand-logo brand-logo--${variant} ${className}`}>
      <Image
        className="on-light"
        src={set.light.src}
        width={set.light.w}
        height={set.light.h}
        alt={alt}
        priority={priority}
      />
      <Image
        className="on-dark"
        src={set.dark.src}
        width={set.dark.w}
        height={set.dark.h}
        alt={alt}
        priority={priority}
      />
    </span>
  );
}
