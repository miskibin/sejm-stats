export function truncateWords(sentence: string, maxWords: number) {
  const words = sentence.split(" ");
  if (words.length > maxWords) {
    return `${words.slice(0, maxWords).join(" ")}...`;
  }
  return sentence;
}
