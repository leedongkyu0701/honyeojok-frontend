import Container from "@/components/common/Container";
import type { HonyeoDifficulty } from "@/types/destinations";

const labels: Array<[keyof HonyeoDifficulty, string]> = [
  ["food", "혼밥/술 난이도"],
  ["transport", "교통 접근성"],
  ["safety", "혼여 안전성"],
  ["loneliness", "외로움 정도"],
];

export default function DifficultyBars({
  difficulty,
}: {
  difficulty: HonyeoDifficulty;
}) {
  return (
    <section className="py-10">
      <Container className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-baseline gap-1">
          혼여
          <span className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-500 bg-clip-text text-transparent">
            SCORE
          </span>
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {labels.map(([key, label]) => {
            const value = difficulty[key];
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-800">{label}</span>
                  <span className="text-neutral-500">{value}/10</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-200">
                  <div
                    className="h-2 rounded-full bg-neutral-900"
                    style={{ width: `${(value / 10) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
