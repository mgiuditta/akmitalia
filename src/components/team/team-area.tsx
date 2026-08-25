import Image from "next/image";
import Link from "next/link";
import React from "react";

const teamMembers = [
  {
    name: "James David",
    post: "CEO & Founder",
    img: "/assets/imgs/team/team-1.webp",
  },
  {
    name: "Brenda C. Janet",
    post: "Lead Developer",
    img: "/assets/imgs/team/team-2.webp",
  },
  {
    name: "Martin Carlos",
    post: "Lead Designer",
    img: "/assets/imgs/team/team-3.webp",
  },
  {
    name: "Garry J. Coburn",
    post: "Project Manager",
    img: "/assets/imgs/team/team-4.webp",
  },
];

export const TeamWrapperArea = () => {
  return (
    <div className="team-wrapper">
      {teamMembers.map((member, idx) => (
        <div className="team-box" key={member.name + idx}>
          <div className="thumb">
            <Link href="/team-details">
              <Image src={member.img} alt={member.name} width={440} height={600} style={{ height: "auto" }} />
            </Link>
          </div>
          <div className="content">
            <h3 className="name">
              <Link href="/team-details">{member.name}</Link>
            </h3>
            <span className="post">{member.post}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TeamArea() {
  return (
    <section className="team-area">
      <div className="container large">
        <div className="team-area-inner section-spacing">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody rr_title_anim">
                  Meet the talented squad, behind the creativity
                </h2>
              </div>
            </div>
            <div className="text-wrapper">
              <p className="text">
                We are a great skilled and talented team behind the creativity
                and your amazing digital craft.
              </p>
            </div>
          </div>
          <div className="team-wrapper-box fade-anim">
            <TeamWrapperArea />
          </div>
        </div>
      </div>
    </section>
  );
}
