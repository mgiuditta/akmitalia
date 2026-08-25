import Link from "next/link";
import { blogItemsTwo } from "@/data/blog-data";
import BlogItem from "./blog-item";

const BlogAreaTwo: React.FC = () => {
  return (
    <section className="blog-area-2">
      <div className="container large">
        <div className="blog-area-2-inner">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper">
                <span className="section-subtitle">Recent blog</span>
              </div>
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody">
                  Learn our recent journal
                </h2>
              </div>
            </div>
          </div>
          <div className="blogs-wrapper-box">
            <div className="blogs-wrapper">
              {blogItemsTwo.map((item) => (
                <Link key={item.id} href={`/blog-details/${item.id}`}>
                  <BlogItem item={item} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogAreaTwo;
