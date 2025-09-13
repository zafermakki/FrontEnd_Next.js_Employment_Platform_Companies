import HomePage from "@/pages/HomePage";
import CompanyPage from "@/pages/CompanyPage";
import NewsPage from "@/pages/NewsPage";
import MessagesPage from "@/pages/MessagesPage";

interface ContentProps {
  active: string;
}

export default function Content({ active }: ContentProps) {
  return (
    <section className="p-6 overflow-y-auto flex-1">
      {active === "home" && <HomePage />}
      {active === "company" && <CompanyPage />}
      {active === "news" && <NewsPage />}
      {active === "messages" && <MessagesPage />}
    </section>
  );
}
