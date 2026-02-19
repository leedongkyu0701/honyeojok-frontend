import Container from "@/components/common/Container";

const labels = {
  food: "혼밥/술 난이도",
  transport: "이동 난이도",
  safety: "혼여 안전성",
  loneliness: "외로움 지수",
};

export default function DifficultyBars({
  difficulty,
}: {
  difficulty: {
    food: number;
    transport: number;
    safety: number;
    loneliness: number;
  };
}) {
  return (
    <section className="py-10">
      <Container className="space-y-6">
        <h2 className="text-2xl font-semibold">혼여 난이도</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(difficulty).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-neutral-800">
                  {labels[key as keyof typeof labels]}
                </span>
                <span className="text-neutral-500">{value}/10</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-200">
                <div
                  className="h-2 rounded-full bg-neutral-900"
                  style={{ width: `${(value / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
