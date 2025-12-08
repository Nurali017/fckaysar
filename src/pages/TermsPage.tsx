import { WebsiteHeader } from "@/components/website/WebsiteHeader";
import { Footer } from "@/components/website/Footer";
import { useTranslation } from "react-i18next";

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">{t("terms.title")}</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 mb-6">{t("terms.lastUpdated")}: 04.12.2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{t("terms.section1.title")}</h2>
              <p className="text-gray-300 leading-relaxed">{t("terms.section1.content")}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{t("terms.section2.title")}</h2>
              <p className="text-gray-300 leading-relaxed">{t("terms.section2.content")}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{t("terms.section3.title")}</h2>
              <p className="text-gray-300 leading-relaxed">{t("terms.section3.content")}</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;
