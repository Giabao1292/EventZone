function BackgroundEffect({ image }) {
  return (
    <div className="h-screen absolute inset-0 z-0 pointer-events-none max-w-[1440px] mx-auto overflow-hidden">
      <img
        src={image}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover object-top z-[-1]"
        decoding="async"
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
}

export default BackgroundEffect;
