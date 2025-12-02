export const iconSizes = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
};

export const iconColors = {
  default: 'text-bjj-white',
  muted: 'text-bjj-gray-300',
  primary: 'text-bjj-red',
  danger: 'text-red-400',
  disabled: 'text-bjj-gray-500'
};

export const iconVariants = {
  default: `${iconSizes.md} ${iconColors.default}`,
  muted: `${iconSizes.md} ${iconColors.muted}`,
  primary: `${iconSizes.md} ${iconColors.primary}`,
  danger: `${iconSizes.md} ${iconColors.danger}`,
  disabled: `${iconSizes.md} ${iconColors.disabled}`
};

export const iconTokens = {
  sizes: iconSizes,
  colors: iconColors,
  variants: iconVariants
};

export type IconVariantKey = keyof typeof iconVariants;
