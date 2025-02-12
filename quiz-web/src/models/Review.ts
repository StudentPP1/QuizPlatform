export type Review = {
  creator: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  text: string,
  rating: number
};
