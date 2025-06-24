// components/BackgroundEffect.jsx
function BackgroundEffect({ image }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          maxWidth: "1440px",
          maxHeight: "100%",
          margin: "0 auto",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      <div className="absolute top-20 left-20 w-24 h-24 bg-white/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-40 right-32 w-20 h-20 bg-white/15 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-32 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-pulse delay-2000" />
    </div>
  );
}

export default BackgroundEffect;
