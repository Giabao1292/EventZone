import { Player } from "@lottiefiles/react-lottie-player";
import loadingAnimation from "../assets/lottie/boatloader.json"; // thay bằng file của bạn

export default function PageLoader() {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <Player
        autoplay
        loop
        src={loadingAnimation}
        style={{ height: 200, width: 200 }}
      />
    </div>
  );
}
