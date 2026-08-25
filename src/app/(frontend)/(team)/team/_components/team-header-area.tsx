import Image from 'next/image';

export default function TeamHeaderArea() {
  return (
    <section className="team-area-team-page">
      <div className="team-area-team-page-inner">
        <div className="container large">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="team-info">
                <div className="team-group">
                  <Image src="/assets/imgs/team/team-11.webp" alt="image" width={60} height={60} />
                  <Image src="/assets/imgs/team/team-12.webp" alt="image" width={60} height={60} />
                  <Image src="/assets/imgs/team/team-13.webp" alt="image" width={60} height={60} />
                </div>
                <div className="text-wrapper">
                  <p className="text">A team of <span>80+</span> skilled employees
                    is working behind your creative
                    works
                  </p>
                </div>
              </div>
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody">
                  Our talented squad
                </h2>
                <p className="text">We’re a diverse team that works as fancies attention to details, enjoys beers on
                  Friday nights and aspires to design the dent in the universe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
