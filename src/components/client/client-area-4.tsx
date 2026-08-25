import ClientCapsules from './client-capsules';

export default function ClientAreaFour() {
  return (
    <section className="client-area-service-page">
      <div className="container large">
        <div className="client-area-inner section-spacing-top">
          <div className="section-content fade-anim">
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody">
                  <span>Client:</span> Helping brands to grow and say
                  their success stories to the world.
                </h2>
              </div>
            </div>
            <div className="text-wrapper">
              <p className="text">
                We’re a great team of creatives with a strongest
                capabilities to helping progressive fields achieve their
                goals. With the best talent on every project done
                successfully
              </p>
            </div>
          </div>
          <ClientCapsules />
          <div className="lines-wrapper">
            {Array(8)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="line"></div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
