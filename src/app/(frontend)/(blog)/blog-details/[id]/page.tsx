import { Metadata } from "next";
import HeaderTwo from "@/layout/header/header-two";
import MainWrapper from "@/components/wrapper/main-wrapper";
import FooterInner from "@/layout/footer/footer-inner";
import { allBlogs } from "@/data/blog-data";
import BlogWrapper from "../../blog/_components/blog-wrapper";
import BlogDetailsArea from "@/components/blog/blog-details-area";
import RecentBlogs from "@/components/blog/recent-blogs";


type Props = {
  params: Promise<{ id: string }>
}
 
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).id;
 
  // fetch post information
  const post = await allBlogs.find((post) => post.id === Number(slug));
 
  return {
    title: post?.title || "Blog Details",
  }
}


export default async function BlogDetailsPage({ params }: Props) {
  const {id} = await params;
  const post = await allBlogs.find((post) => post.id === Number(id));
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

            {/* blog details area start */}
            <BlogDetailsArea/>
            {/* blog details area end */}

            {/* recent blog area start */}
            <RecentBlogs/>
            {/* recent blog area end */}

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
