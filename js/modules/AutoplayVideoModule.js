export default function AutoplayVideoModule() {
  const videos = [...document.querySelectorAll(".autoplayVideoJS")];
  if (!videos.length) return;

  const play = (video) => {
    video.muted = true;
    const result = video.play();
    if (result) result.catch(() => {});
  };

  if (!("IntersectionObserver" in window)) {
    videos.forEach(play);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) play(target);
        else target.pause();
      });
    },
    { rootMargin: "200px 0px" },
  );
  videos.forEach((video) => observer.observe(video));
}
