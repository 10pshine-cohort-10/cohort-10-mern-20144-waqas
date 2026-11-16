import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "Notiq";
const DEFAULT_IMAGE = "/favicon.png";
const DEFAULT_IMAGE_ALT = "Notiq workspace logo";

function upsertMetaTag(attributeName, attributeValue, content) {
  if (!content) return;

  let element = document.head.querySelector(
    `meta[${attributeName}="${attributeValue}"]`,
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertCanonicalLink(href) {
  if (!href) return;

  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
}

function upsertJsonLd(structuredData) {
  const existing = document.head.querySelector(
    'script[type="application/ld+json"][data-seo-jsonld="true"]',
  );

  if (!structuredData) {
    existing?.remove();
    return;
  }

  const script = existing || document.createElement("script");
  script.setAttribute("type", "application/ld+json");
  script.setAttribute("data-seo-jsonld", "true");
  script.textContent = JSON.stringify(structuredData);

  if (!existing) {
    document.head.appendChild(script);
  }
}

function Seo({
  title,
  description,
  keywords,
  type = "website",
  robots = "index, follow",
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
  structuredData = null,
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title}` : SITE_NAME;
    document.title = fullTitle;

    const origin =
      typeof window !== "undefined" &&
      window.location?.origin &&
      window.location.origin !== "null"
        ? window.location.origin
        : "";
    const canonicalHref = origin ? `${origin}${pathname}` : pathname;
    const absoluteImage = origin && image.startsWith("/") ? `${origin}${image}` : image;

    upsertMetaTag("name", "description", description);
    upsertMetaTag("name", "keywords", keywords);
    upsertMetaTag("name", "robots", robots);

    upsertMetaTag("property", "og:type", type);
    upsertMetaTag("property", "og:site_name", SITE_NAME);
    upsertMetaTag("property", "og:title", fullTitle);
    upsertMetaTag("property", "og:description", description);
    upsertMetaTag("property", "og:image", absoluteImage);
    upsertMetaTag("property", "og:image:alt", imageAlt);
    upsertMetaTag("property", "og:url", canonicalHref);

    upsertMetaTag("name", "twitter:card", "summary_large_image");
    upsertMetaTag("name", "twitter:title", fullTitle);
    upsertMetaTag("name", "twitter:description", description);
    upsertMetaTag("name", "twitter:image", absoluteImage);
    upsertMetaTag("name", "twitter:image:alt", imageAlt);

    upsertCanonicalLink(canonicalHref);
    upsertJsonLd(structuredData);
  }, [
    title,
    description,
    keywords,
    type,
    robots,
    image,
    imageAlt,
    pathname,
    structuredData,
  ]);

  return null;
}

export default Seo;

