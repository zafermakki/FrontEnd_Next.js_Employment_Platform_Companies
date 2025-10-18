import HomePage from "@/pages/HomePage";
import CompanyPage from "@/pages/CompanyPage";
import AdvertisementPage from "@/pages/AdvertisementPage";
import MyAdvertisementsPage from "@/pages/MyAdvertisementsPage";
import EmploymentRequests from "@/pages/EmploymentRequests";
import RecruitmentLetters from "@/pages/RecruitmentLetters";

interface ContentProps {
  active: string;
}

export default function Content({ active }: ContentProps) {
  return (
    <section className="p-6 overflow-y-auto flex-1">
      {active === "home" && <HomePage />}
      {active === "company" && <CompanyPage />}
      {active === "advertisement" && <AdvertisementPage />}
      {active === "myadvertisements" && <MyAdvertisementsPage />}
      {active === "employmentrequests" && <EmploymentRequests />}
      {active === "recruitmentletters" && <RecruitmentLetters />}
    </section>
  );
}
