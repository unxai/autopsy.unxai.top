import type { Metadata } from "next";
import { CaseDetailPage } from "@/components/site";
import { getAllCases, getCaseById } from "@/lib/repo/cases";

export async function generateStaticParams() {
  const allCases = await getAllCases();
  return allCases.map((item) => ({ id: String(item.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await getCaseById(Number(id));

  if (!item) {
    return {
      title: "案例不存在",
    };
  }

  return {
    title: item.name,
    description: item.thesis,
    openGraph: {
      title: `${item.name} · AI 产品尸检馆`,
      description: item.thesis,
      url: `https://autopsy.unxai.top/cases/${item.id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.name} · AI 产品尸检馆`,
      description: item.thesis,
    },
  };
}

export default async function CaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getCaseById(Number(id));

  if (!item) {
    return <CaseDetailPage item={null} relatedCases={[]} />;
  }

  const allCases = await getAllCases();
  const relatedCases = allCases
    .filter((candidate) => candidate.id !== item.id)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => item.tags.includes(tag)).length;
      const sameCategory = candidate.category === item.category ? 1 : 0;
      const sameStatus = candidate.statusLabel === item.statusLabel ? 1 : 0;
      return {
        candidate,
        score: sharedTags * 10 + sameCategory * 3 + sameStatus,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.candidate);

  return <CaseDetailPage item={item} relatedCases={relatedCases} />;
}
