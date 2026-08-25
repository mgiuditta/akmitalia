import { Metadata } from "next";
import HeaderTwo from "@/layout/header/header-two";
import MainWrapper from "@/components/wrapper/main-wrapper";
import FooterInner from "@/layout/footer/footer-inner";
import PageTitle from "@/components/common/page-title";
import BlogAreaTwo from "@/components/blog/blog-area-2";
import BlogWrapper from "./_components/blog-wrapper";


export const metadata: Metadata = {
  title: "Blog Page - Redox Next js Template",
  description:
    "Redox is a agency and portfolio template built with Next.js, designed to showcase your work and services effectively.",
};

export default function BlogPage() {
  return (
    <>
      {/* Header area start */}
      <HeaderTwo />
      {/* Header area end */}

      {/* Main wrapper start */}
      <MainWrapper
        bodyCls={[
          "body-wrapper",
          "dark",
          "body-page-inner",
          "font-heading-sequelsans-romanbody",
        ]}
      >
        <BlogWrapper>
          <main>

            {/* page title area start */}
            <PageTitle title="Journals" />
            {/* page title area end */}

            {/* blog area start */}
            <BlogAreaTwo />
            {/* blog area end */}

          </main>

          {/* Footer area start */}
          <FooterInner />
          {/* Footer area end */}
        </BlogWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
