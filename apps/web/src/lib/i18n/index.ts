import { viMessages } from "./messages/vi";

export type Locale = "vi";

const dictionaries = {
  vi: () => Promise.resolve(viMessages),
};

export async function getDictionary(locale: Locale = "vi") {
  return dictionaries[locale]();
}
