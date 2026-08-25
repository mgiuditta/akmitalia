export type IBlog = {
  id: number;
  img: string;
  title: string;
  author: string;
  date: string;
  delay?: string;
}
export const blogDataOne: IBlog[] = [
  {
    id: 1,
    img: "/assets/imgs/blog/blog-1.webp",
    title: "Beyond the basics, how to take marketing to the next level",
    author: "Jerry",
    date: "2023",
    delay: "0.45",
  },
  {
    id: 2,
    img: "/assets/imgs/blog/blog-2.webp",
    title: "Allow us to be the cool part of your days are open for now",
    author: "Jerry",
    date: "2023",
    delay: "0.60",
  },
  {
    id: 3,
    img: "/assets/imgs/blog/blog-3.webp",
    title: "Various ideas and creative concepts based on market research",
    author: "Jerry",
    date: "2023",
    delay: "0.75",
  },
  {
    id: 4,
    img: "/assets/imgs/blog/blog-4.webp",
    title: "Create compelling visuals that grab attention to your customer",
    author: "Jerry",
    date: "2023",
    delay: "0.90",
  },
];


export const blogItemsTwo: IBlog[] = [
  {
    id: 4,
    img: "/assets/imgs/blog/blog-5.webp",
    title: "Beyond the basics, how to take marketing to the next level",
    author: "Jerry",
    date: "2023",
    delay: "0.45",
  },
  {
    id: 5,
    img: "/assets/imgs/blog/blog-6.webp",
    title: "Allow us to be the cool part of your days are open for now",
    author: "Jerry",
    date: "2023",
    delay: "0.60",
  },
  {
    id: 6,
    img: "/assets/imgs/blog/blog-7.webp",
    title: "Various ideas and creative concepts based on market research",
    author: "Jerry",
    date: "2023",
    delay: "0.75",
  },
  {
    id: 7,
    img: "/assets/imgs/blog/blog-8.webp",
    title: "Beyond the basics, how to take marketing to the next level",
    author: "Jerry",
    date: "2023",
    delay: "0.45",
  },
  {
    id: 8,
    img: "/assets/imgs/blog/blog-9.webp",
    title: "Beyond the basics, how to take marketing to the next level",
    author: "Jerry",
    date: "2023",
    delay: "0.60",
  },
  {
    id: 9,
    img: "/assets/imgs/blog/blog-10.webp",
    title: "Beyond the basics, how to take marketing to the next level",
    author: "Jerry",
    date: "2023",
    delay: "0.45",
  },
  {
    id: 10,
    img: "/assets/imgs/blog/blog-11.webp",
    title: "Allow us to be the cool part of your days are open for now",
    author: "Jerry",
    date: "2023",
    delay: "0.60",
  },
  {
    id: 11,
    img: "/assets/imgs/blog/blog-12.webp",
    title: "Various ideas and creative concepts based on market research",
    author: "Jerry",
    date: "2023",
    delay: "0.75",
  },
];

export const allBlogs = [...blogDataOne, ...blogItemsTwo];
