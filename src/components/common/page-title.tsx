
export default function PageTitle({ title }: { title: string }) {
  return (
    <section className="page-title-area">
      <div className="container large">
        <div className="page-title-area-inner section-spacing-top">
          <div className="page-title-wrapper">
            <h2 className="page-title fade-anim">{title}</h2>
          </div>
        </div>
      </div>
    </section>
  )
}
