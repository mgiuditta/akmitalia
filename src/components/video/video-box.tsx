// Placeholder piatto: il global `home` prevede un video YouTube in evidenza,
// non ancora fornito dal cliente — niente asset demo esterno nel frattempo.
export default function VideoBox() {
  return (
    <div className="video-box">
      <div
        className="video-area d-flex align-items-center justify-content-center"
        style={{ backgroundColor: 'var(--bg)', width: '100%', height: '100%' }}
      >
        <p className="text" style={{ color: 'var(--secondary)' }}>
          Video in arrivo
        </p>
      </div>
    </div>
  )
}
