import { TIngredient } from "../types/types";

export const buildOrderName = (ingredients: TIngredient[]): string => {
  const bun = ingredients.find(ing => ing.type === 'bun');
  const sauce = [...new Set(ingredients.filter(ing => ing.type === 'sauce').map(ing => ing.name))];
  const main = [...new Set(ingredients.filter(ing => ing.type === 'main').map(ing => ing.name))];

  let name = bun ? bun.name.replace(/ N-\d+\w*| R2-D\d+\w*/g, '') : 'burger';

  if (main.length > 0 || sauce.length > 0) {
    name += ' with';

    if (main.length > 0) {
      name += ' ' + main.join(' and ');
    }

    if (sauce.length > 0) {
      if (main.length > 0) name += ' and';
      name += ' ' + sauce.join(' and ');
    }
  }

  return name;
};
