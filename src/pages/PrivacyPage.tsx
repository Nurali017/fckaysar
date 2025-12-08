import { WebsiteHeader } from "@/components/website/WebsiteHeader";
import { Footer } from "@/components/website/Footer";
import { useTranslation } from "react-i18next";

const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">{t("privacy.title")}</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 mb-6">{t("privacy.lastUpdated")}: 04.12.2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.section1.title")}</h2>
              <p className="text-gray-300 leading-relaxed">{t("privacy.section1.content")}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.section2.title")}</h2>
              <p className="text-gray-300 leading-relaxed">{t("privacy.section2.content")}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.section3.title")}</h2>
              <p className="text-gray-300 leading-relaxed">{t("privacy.section3.content")}</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
