import Link from "next/link";
import { blogItemsTwo } from "@/data/blog-data";
import BlogItem from "./blog-item";

export default function RecentBlogs() {
  const recent_blogs = blogItemsTwo.slice(0, 3);
  return (
    <section className="blog-area-3">
      <div className="container large">
        <div className="blog-area-3-inner section-spacing-top">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper">
                <span className="section-subtitle">Recent blog</span>
              </div>
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody">
                  Learn more related journals
                </h2>
              </div>
            </div>
          </div>
          <div className="blogs-wrapper-box">
            <div className="blogs-wrapper">
              {recent_blogs.map((item) => (
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
}
