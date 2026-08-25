import React from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

// project images 
import project_1 from '@/assets/imgs/project/image-46.webp';
import project_2 from '@/assets/imgs/project/image-36.webp';
import project_3 from '@/assets/imgs/project/image-34.webp';
import project_4 from '@/assets/imgs/project/image-31.webp';
import project_5 from '@/assets/imgs/project/image-37.webp';
import project_6 from '@/assets/imgs/project/image-38.webp';
import project_7 from '@/assets/imgs/project/image-39.webp';
import project_8 from '@/assets/imgs/project/image-40.webp';
import project_9 from '@/assets/imgs/project/image-41.webp';
import project_10 from '@/assets/imgs/project/image-42.webp';
import project_11 from '@/assets/imgs/project/image-43.webp';
import project_12 from '@/assets/imgs/project/image-44.webp';
import project_13 from '@/assets/imgs/project/image-45.webp';

interface WorkItem {
  title: string;
  image: StaticImageData;
  tags: string;
  date: string;
}

const workItems: WorkItem[] = [
  {
    title: 'Redox Digital Agency HTML Template',
    image: project_1,
    tags: 'WordPress, Themeforest',
    date: '(2025)',
  },
  {
    title: 'Al Khobar Uptown',
    image: project_2,
    tags: 'Visual Identity, Branding',
    date: '(2021)',
  },
  {
    title: 'Save Me Saudia',
    image: project_3,
    tags: 'Communication, Social Media',
    date: '(2020)',
  },
  {
    title: 'Lambax Nanak',
    image: project_4,
    tags: 'Strategy, Visual Identity, Re-branding',
    date: '(2022)',
  },
  {
    title: 'Redox Digital Agency HTML Template',
    image: project_5,
    tags: 'WordPress, Themeforest',
    date: '(2025)',
  },
  {
    title: 'Dramatic Natok',
    image: project_6,
    tags: 'Communication, Campaign',
    date: '(2022)',
  },
  {
    title: 'Keshtech Ventures',
    image: project_7,
    tags: 'Visual Identity, Branding',
    date: '(2020)',
  },
  {
    title: 'Pick and Jeep',
    image: project_8,
    tags: 'Visual Identity, Re-branding, Packaging',
    date: '(2021)',
  },
  {
    title: 'Back to Macho School',
    image: project_9,
    tags: 'Communication, Campaign , Social Media',
    date: '(2019)',
  },
  {
    title: 'Cultural Talents',
    image: project_10,
    tags: 'Communication, Campaign',
    date: '(2022)',
  },
  {
    title: 'Redox Digital Agency HTML Template',
    image: project_11,
    tags: 'WordPress, Themeforest',
    date: '(2025)',
  },
  {
    title: 'Dramatic Natok',
    image: project_12,
    tags: 'Communication, Campaign',
    date: '(2022)',
  },
  {
    title: 'Keshtech Ventures',
    image: project_13,
    tags: 'Visual Identity, Branding',
    date: '(2020)',
  },
];

export const WorksWrapperSix = () => {
  return (
    <div className="works-wrapper-6">
      {workItems.map((item, index) => (
        <div className="work-box fade-anim" key={index}>
          <div className="thumb">
            <div
              className="image scale"
              data-cursor-text="View Details"
              data-cursor-text-red
            >
              <Link href="/portfolio-details">
                <Image
                  src={item.image}
                  alt={item.title}
                  style={{ height: 'auto' }}
                />
              </Link>
            </div>
          </div>
          <div className="content">
            <h3 className="title">
              <Link href="/portfolio-details">{item.title}</Link>
            </h3>
            <div className="meta">
              <span className="tag">{item.tags}</span>
              <span className="date">{item.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const WorkAreaSix = () => {
  return (
    <section className="work-area-6">
      <div className="container large">
        <div className="work-area-6-inner">
          <div className="works-wrapper-box">
            <WorksWrapperSix />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkAreaSix;
