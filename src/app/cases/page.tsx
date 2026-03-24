import { CasesListPage } from "@/components/site";
import { CasesBrowser } from "@/components/cases-browser";
import { getAllCases } from "@/lib/repo/cases";

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; tag?: string }>;
}) {
  const cases = await getAllCases();
  const params = await searchParams;

  return (
    <CasesListPage cases={cases}>
      <CasesBrowser
        cases={cases}
        initialStatus={params.status || "全部"}
        initialCategory={params.category || "全部"}
        initialTag={params.tag || "全部"}
      />
    </CasesListPage>
  );
}
