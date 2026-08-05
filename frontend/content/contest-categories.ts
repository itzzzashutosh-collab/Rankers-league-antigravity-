import { ContestCategory } from "../types/contests";
import { categoryMeta } from "./exams";

export const categoriesContent: ContestCategory[] = categoryMeta.map((cat) => ({
  id: cat.id.toLowerCase(),
  name: cat.label,
  description: `Official national-level and international mock contests for ${cat.label}.`,
  iconName: cat.emoji,
  count: 10,
}));
