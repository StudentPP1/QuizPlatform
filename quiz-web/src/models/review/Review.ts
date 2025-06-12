import { Creator } from "../user/Creator";

export type Review = {
  creator: Creator,
  text?: string,
  rating: number
};
