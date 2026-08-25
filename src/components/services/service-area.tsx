import Link from "next/link";
import React from "react";

// Le 4 sezioni rispecchiano i 4 segmenti utente di PRODUCT.md, senza
// gerarchia forzata tra loro (Design Principle 3 — smistamento).
const ServiceArea = () => {
  const segmenti = [
    {
      number: "(01)",
      title: "Genitori",
      list: [
        "Antibullismo Bambini",
        "Corsi Ragazzi",
        "Krav Maga Junior",
        "Disciplina e rispetto",
      ],
    },
    {
      number: "(02)",
      title: "Adulti e Donne",
      list: [
        "Krav Maga Adulti",
        "Donna Sicura",
        "Kick Boxing",
        "Full Contact",
      ],
    },
    {
      number: "(03)",
      title: "Aziende e Forze dell'Ordine",
      list: [
        "Corsi Speciali",
        "Formazione FFOO",
        "Corsi in azienda",
        "Consulenza sicurezza",
      ],
    },
    {
      number: "(04)",
      title: "Praticanti Esistenti",
      list: [
        "Trova il tuo centro",
        "Orari e docenti",
        "Corsi Istruttori",
        "Eventi e stage",
      ],
    },
  ];

  return (
    <section className="service-area">
      <div className="container large">
        <div className="service-area-inner section-spacing">
          <div className="section-header">
            <div className="section-title-wrapper fade-anim">
              <div className="title-wrapper">
                <h2 className="section-title font-instrumentsans-medium word-anim">
                  Per chi <br /> cerchi
                </h2>
              </div>
            </div>
          </div>
          <div className="services-wrapper-box">
            <div className="services-wrapper-1">
              {segmenti.map((segmento, index) => (
                <div key={index} className="service-box fade-anim">
                  <div className="count">
                    <span className="number">{segmento.number}</span>
                  </div>
                  <div className="content">
                    <h3 className="title">
                      <Link href="/about">{segmento.title}</Link>
                    </h3>
                    <ul className="service-list">
                      {segmento.list.map((item, i) => (
                        <li key={i}>
                          <Link href="/about">{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className="thumb"
                    style={{
                      backgroundColor: "var(--bg)",
                      border: "1px solid var(--border)",
                      width: "100%",
                      aspectRatio: "545 / 265",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceArea;

