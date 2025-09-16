export const usePractices = () => {
  const activePracticeId = useState("activePractice", () => 0);

  return { activePracticeId };
};
