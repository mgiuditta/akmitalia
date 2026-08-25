import ClientSlider from "./client-slider";


export default function ClientAreaThree() {
  return (
    <div className="client-area-3">
      <div className="client-area-3-inner section-spacing">
        <div className="container large">
          <div className="section-header fade-anim">
            <div className="text-wrapper">
              <p className="text rr_title_anim">
                Help to brands growing up and show their success stories to the world
              </p>
            </div>
          </div>
        </div>
        <div className="clients-wrapper-box fade-anim">
          <div className="clients-wrapper">
            <ClientSlider/>
          </div>
        </div>
      </div>
    </div>
  );
}