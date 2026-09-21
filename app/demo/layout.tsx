import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Demo — Sonar Analysis",
  description:
    "Try SagarNetra AI: upload a sonar file or image and see marine debris detection in action. Real-time processing pipeline with geo-referenced results.",
  alternates: { canonical: "/demo" },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
