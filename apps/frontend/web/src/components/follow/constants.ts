import { faker } from "@faker-js/faker";

export interface FollowSuggestion {
  name: string;
  handle: string;
  avatarUrl: string;
  verified: boolean;
  bio: string;
  followedBy?: string;
}

export const mockFollowSuggestions: FollowSuggestion[] = Array.from({
  length: 5,
}).map((_, index) => ({
  name: faker.person.fullName(),
  handle: `@${faker.internet.username().toLowerCase()}`,
  avatarUrl: faker.image.avatar(),
  verified: faker.datatype.boolean({ probability: 0.5 }),
  bio: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
  followedBy: index % 2 === 0 ? faker.person.fullName() : undefined,
}));

mockFollowSuggestions.splice(0, 0, {
  name: "nextmahamud",
  handle: "@nextmahamud",
  avatarUrl: "https://i.pravatar.cc/150?img=1",
  verified: true,
  bio: "Logo & Brand Identity Designer. 6x Featured On @behance DM✉️ or Inquiry: nextmahamud@gmail.com cal.com/next-mahamud-o...",
  followedBy: undefined,
});

mockFollowSuggestions.splice(1, 0, {
  name: "Nabil",
  handle: "@MdNabilAhsan",
  avatarUrl: "https://i.pravatar.cc/150?img=2",
  verified: true,
  bio: "I design software. Building halalrewards.club, loyalty platform for halal restaurants.",
  followedBy: "Darius Dan",
});

mockFollowSuggestions.splice(2, 0, {
  name: "Yordano di Marzo",
  handle: "@YordanoOficial",
  avatarUrl: "https://i.pravatar.cc/150?img=3",
  verified: true,
  bio: "Twitter Oficial del Cantautor Venezolano/Oficial twitter of the Venezuelan Singer-Songwriter. Instagram @yordanodimarzo",
  followedBy: undefined,
});

mockFollowSuggestions.splice(3, 0, {
  name: "Jito Kayumba",
  handle: "@JitoKayumba",
  avatarUrl: "https://i.pravatar.cc/150?img=4",
  verified: true,
  bio: "Special Assistant to the President of the Republic of Zambia @HHichilema - Investment Professional - Ex Corporate Executive",
  followedBy: undefined,
});
