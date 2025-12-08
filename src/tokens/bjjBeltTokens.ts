// Canonical BJJ belt base colors mapped to Tailwind classes.
export const BJJ_BELT_COLORS = {
  white: "bg-bjj-belt-white",
  blue: "bg-bjj-belt-blue",
  purple: "bg-bjj-belt-purple",
  brown: "bg-bjj-belt-brown",
  black: "bg-bjj-belt-black",
  red: "bg-bjj-belt-red",
  coral: "bg-bjj-belt-coral",
  gray: "bg-bjj-belt-gray",
  yellow: "bg-bjj-belt-yellow",
  green: "bg-bjj-belt-green",
  orange: "bg-bjj-belt-orange",
} as const;

export type BjjBeltColorToken = keyof typeof BJJ_BELT_COLORS;
