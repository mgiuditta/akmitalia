import Image from "next/image";
import client_9 from "@/assets/imgs/client/client-9-light.webp";
import client_10 from "@/assets/imgs/client/client-10.webp";
import client_11 from "@/assets/imgs/client/client-11.webp";
import client_12 from "@/assets/imgs/client/client-12-light.webp";
import client_13 from "@/assets/imgs/client/client-13.webp";
import client_14 from "@/assets/imgs/client/client-14.webp";
import client_15 from "@/assets/imgs/client/client-15-light.webp";
import client_16 from "@/assets/imgs/client/client-16-light.webp";
import client_17 from "@/assets/imgs/client/client-17.webp";
import client_18 from "@/assets/imgs/client/client-18-light.webp";
import client_19 from "@/assets/imgs/client/client-19.webp";
import client_20 from "@/assets/imgs/client/client-20-light.webp";
import client_21 from "@/assets/imgs/client/client-21.webp";
import client_22 from "@/assets/imgs/client/client-22.webp";

const clients = [
  { src: client_9, bgTheme: true },
  { src: client_10, bgTheme: false },
  { src: client_11, bgTheme: false },
  { src: client_12, bgTheme: true },
  { src: client_13, bgTheme: false },
  { src: client_14, bgTheme: false },
  { src: client_15, bgTheme: true },
  { src: client_16, bgTheme: true },
  { src: client_17, bgTheme: false },
  { src: client_18, bgTheme: true },
  { src: client_19, bgTheme: false },
  { src: client_20, bgTheme: true },
  { src: client_21, bgTheme: false },
  { src: client_22, bgTheme: false },
];
export default function ClientCapsules() {
  return (
    <div className="client-capsule-wrapper-box" data-t-throwable-scene="true">
      <div className="client-capsule-wrapper">
        {clients.map((client, index) => (
          <p key={index} data-t-throwable-el="">
            <span className={`client-box ${client.bgTheme ? "bg-theme" : ""}`}>
              <Image src={client.src} alt="image" style={{ height: "auto" }} />
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
