import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const DEFAULT_TITLE = "SPM | Medical Imaging Technology, Service and Spare Parts";
const DEFAULT_DESCRIPTION =
  "SPM supports medical imaging equipment with sourcing, service, maintenance and spare-parts request journeys for healthcare and technical teams.";
const DEFAULT_IMAGE = "/manus-storage/spm-hero-medical-engineer_fd2460bc.jpg";
const BASE_URL = "https://spmhospitals.com";

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
}: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title
      ? `${title} | SPM Medical Imaging`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attribute: "name" | "property", key: string, content: string) => {
      let tag = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // 3. Helper for link canonical
    const setCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    const resolvedUrl = url
      ? (url.startsWith("http") ? url : `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`)
      : (typeof window !== "undefined" ? window.location.href : BASE_URL);

    const resolvedImage = image.startsWith("http")
      ? image
      : `${BASE_URL}${image.startsWith("/") ? image : `/${image}`}`;

    // Standard Meta
    setMetaTag("name", "description", description);

    // Open Graph
    setMetaTag("property", "og:title", formattedTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", resolvedImage);
    setMetaTag("property", "og:url", resolvedUrl);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:site_name", "SPM Medical Imaging Technology");

    // Twitter Card
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", formattedTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", resolvedImage);

    // Canonical link
    setCanonical(resolvedUrl);
  }, [title, description, image, url, type]);

  return null;
}
