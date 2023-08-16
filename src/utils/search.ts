export const normalizeText = (text: string) =>
  text.normalize('NFD').replace(/[^a-z0-9 ]+/gi, '');

export const createMatchesForSearch = (search: string) => {
  const searchedWordsTesters = normalizeText(search)
    .split(/\s/)
    .map((word) => word.trim())
    .filter((word) => !!word)
    .map((word) => new RegExp(`.*(?:${word}).*`, 'i'));

  return (content: string) =>
    searchedWordsTesters.some((tester) => tester.test(normalizeText(content)));
};
