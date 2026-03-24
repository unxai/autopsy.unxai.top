import { FeaturedSection, Hero, MethodSection, ResearchWorthSection, SignalsSection, StatsSection } from "@/components/site";
import { getAllCases } from "@/lib/repo/cases";

export default async function Home() {
  const cases = await getAllCases();

  return (
    <div>
      <Hero cases={cases} />
      <MethodSection />
      <FeaturedSection cases={cases} />
      <SignalsSection cases={cases} />
      <StatsSection cases={cases} />
      <ResearchWorthSection />
    </div>
  );
}
