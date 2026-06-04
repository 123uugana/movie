export const studios = [
  {
    name: "Disney+",
    slug: "disney",
    className: "disney",
    label: "Disney+",
    companyIds: [2, 6125],
    video: "https://sphereplus.vercel.app/imgs/disney-vv.mp4",
  },
  {
    name: "Star Wars",
    slug: "star-wars",
    className: "star-wars",
    label: "STAR\nWARS",
    companyIds: [1],
    video: "https://sphereplus.vercel.app/imgs/starwars-v.mp4",
  },
  {
    name: "Marvel",
    slug: "marvel",
    className: "marvel",
    label: "MARVEL",
    companyIds: [420],
    video: "https://sphereplus.vercel.app/imgs/marvel-v.mp4",
  },
  {
    name: "Pixar",
    slug: "pixar",
    className: "pixar",
    label: "PIXAR",
    companyIds: [3],
    video: "https://sphereplus.vercel.app/imgs/pixar-v.mp4",
  },
  {
    name: "Paramount",
    slug: "paramount",
    className: "paramount",
    label: "Paramount",
    companyIds: [4],
    video: "https://sphereplus.vercel.app/imgs/paramount-v.mp4",
  },
  {
    name: "National Geographic",
    slug: "national-geographic",
    className: "national-geographic",
    label: "NATIONAL\nGEOGRAPHIC",
    companyIds: [7521, 114038, 283420],
    video: "https://sphereplus.vercel.app/imgs/ngeo-v.mp4",
  },
];

export function getStudioBySlug(slug) {
  return studios.find((studio) => studio.slug === slug) || null;
}
