import Lottie from "react-lottie";

//Lottie animations
import loadingSpinner from "../static/loading.json";
import waitingDots from "../static/waiting.json";

export const loadingOpts = {
  loop: true,
  autoplay: true,
  animationData: loadingSpinner,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

//Lottie config
export const waitingOpts = {
  loop: true,
  autoplay: true,
  animationData: waitingDots,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
