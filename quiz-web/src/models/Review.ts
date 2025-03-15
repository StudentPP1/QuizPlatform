import { CreatorDTO } from "./CreatorDTO";

export type Review = {
  creator: CreatorDTO,
  text: string,
  rating: number
};
