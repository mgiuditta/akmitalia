import Image from "next/image";
import Link from "next/link";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

// Team members data
const teamMembers: TeamMember[] = [
  {
    name: "Ana Dina Belić",
    role: "Graphic Designer",
    image: "/assets/imgs/team/team-5.webp",
  },
  {
    name: "Giuseppe Carbonara",
    role: "Brand Strategist",
    image: "/assets/imgs/team/team-6.webp",
  },
  {
    name: "Vedran Starčić",
    role: "Jr. Designer",
    image: "/assets/imgs/team/team-7.webp",
  },
  {
    name: "Izquierdo Bayà",
    role: "Creative Writer",
    image: "/assets/imgs/team/team-8.webp",
  },
  {
    name: "Jared Silverman",
    role: "Motion Designer",
    image: "/assets/imgs/team/team-9.webp",
  },
  {
    name: "Samuel Bertain",
    role: "WordPress Developer",
    image: "/assets/imgs/team/team-10.webp",
  },
];

export const TeamListWrapper = () => {
  return (
    <div className="team-wrapper">
      {teamMembers.map((member, index) => (
        <div className="team-box" key={index}>
          <div className="thumb">
            <Link href="/team-details">
              <Image
                src={member.image}
                alt={member.name}
                width={100}
                height={100}
              />
            </Link>
          </div>
          <div className="content">
            <h3 className="name">
              <Link href="/team-details">{member.name}</Link>
            </h3>
          </div>
          <span className="post">{member.role}</span>
          <Link href="/team-details" className="t-btn t-btn-normal">
            <Image
              src="/assets/imgs/icon/icon-5.webp"
              alt="icon"
              width={18}
              height={18}
            />
          </Link>
        </div>
      ))}
    </div>
  )
}

const TeamListArea: React.FC = () => {
  return (
    <div className="team-list-area">
      <div className="container large">
        <div className="team-list-area-inner">
          <div className="team-wrapper-box fade-anim">
            <TeamListWrapper />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamListArea;
