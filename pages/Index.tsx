import { useNavigate } from "react-router-dom";
import Hero from "@/components/modules/landing-screen/Hero";
import QuickJobSearch from "@/components/modules/landing-screen/QuickJobSearch";
import WhyJobSeekers from "@/components/modules/landing-screen/WhyJobSeekers";
import FeaturedSuccessStories from "@/components/modules/landing-screen/FeaturedSuccessStories";
import JobCategories from "@/components/modules/landing-screen/JobCategories";
import FinalCta from "@/components/modules/landing-screen/FinalCta";
import ClientLayout from "@/components/shared/layout/ClientLayout";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleSearchScroll = () => {
    navigate("/browse-jobs");
  };

  return (
    <ClientLayout>
      <Hero onSearchClick={handleSearchScroll} />
      {/* <QuickJobSearch ref={searchRef} /> */}
      <WhyJobSeekers />
      <FeaturedSuccessStories />
      <JobCategories />
      <FinalCta onSearchClick={handleSearchScroll}/>
    </ClientLayout>
  );
}
