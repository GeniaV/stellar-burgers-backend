export type TIngredient = {
  name: string,
  type: 'bun' | 'main' | 'sauce',
  proteins: number,
  fat: number,
  carbohydrates: number,
  calories: number,
  price: number,
  image: string;
  image_mobile: string;
  image_large: string;
};
