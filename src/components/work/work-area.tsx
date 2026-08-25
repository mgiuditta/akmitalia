import Link from "next/link";

// Niente foto stock (Design Principle 1): lo slot immagine diventa un blocco
// tipografico piatto con il nome della disciplina, non una foto agenzia.
const corsi = [
  { title: "Krav Maga Adulti", tag: "Adulti" },
  { title: "Antibullismo Bambini", tag: "Bambini" },
  { title: "Donna Sicura", tag: "Donne" },
  { title: "Kick Boxing", tag: "Adulti" },
  { title: "Full Contact", tag: "Adulti" },
  { title: "Corsi Istruttori", tag: "Istruttori" },
];

const WorkArea = () => {
  return (
    <div className="container large">
      <div className="work-area-inner">
        <div className="section-header fade-anim">
          <div className="section-title-wrapper">
            <div className="title-wrapper">
              <h2 className="section-title font-instrumentsans-medium">
                Corsi in evidenza
              </h2>
            </div>
          </div>
          <div className="text-wrapper">
            <p className="text">Un percorso per ogni età e obiettivo</p>
          </div>
          <div className="total-count">
            <span className="number">({corsi.length})</span>
          </div>
        </div>
        <div className="works-wrapper-box">
          <div className="works-wrapper-1 fade-anim">
            {corsi.map((corso, index) => (
              <div key={index} className="work-box">
                <div className="thumb">
                  <div className="image scale" data-cursor-text="Scopri il corso">
                    <Link
                      href="/about"
                      className="d-flex align-items-center justify-content-center w-100 h-100"
                      style={{
                        aspectRatio: "840 / 580",
                        backgroundColor: "var(--bg)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <span
                        className="font-instrumentsans-medium"
                        style={{ color: "var(--primary)", fontSize: "1.75rem", textAlign: "center", padding: "0 1rem" }}
                      >
                        {corso.title}
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="content">
                  <h3 className="title">
                    <Link href="/about">{corso.title}</Link>
                  </h3>
                  <div className="meta">
                    <span className="tag">{corso.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="all-btn-wrapper fade-anim">
          <Link href="/about" className="rr-btn btn-border hover-bg-theme">
            <span className="btn-wrap">
              <span className="text-one">Tutti i corsi</span>
              <span className="text-two">Tutti i corsi</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkArea;
