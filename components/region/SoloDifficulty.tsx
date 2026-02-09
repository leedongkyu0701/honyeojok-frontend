type Props = {
  difficulty: {
    food: number;
    transport: number;
    safety: number;
    loneliness: number;
  };
};

const Item = ({ label, score }: { label: string; score: number }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span>{"★".repeat(score)}</span>
  </div>
);

export default function SoloDifficulty({ difficulty }: Props) {
  return (
    <section className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">혼자여행 난이도</h2>
      <div className="space-y-2 text-sm">
        <Item label="혼밥 난이도" score={difficulty.food} />
        <Item label="이동 난이도" score={difficulty.transport} />
        <Item label="안전 체감도" score={difficulty.safety} />
        <Item label="외로움 지수" score={difficulty.loneliness} />
      </div>
    </section>
  );
}
