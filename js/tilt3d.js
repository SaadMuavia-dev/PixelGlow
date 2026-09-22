/* PixelGlow — lightweight 3D tilt for buttons & glass cards */
(function () {
  function applyTilt(selector, strength) {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.transformStyle = "preserve-3d";
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(600px) rotateX(${-py * strength}deg) rotateY(${px * strength}deg) translateY(-4px) scale(1.02)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTilt(
      ".btn-hero-primary, .btn-hero-outline, .btn-cta-white, .btn-pricing, .btn-submit, .nav-cta",
      10
    );
    applyTilt(".process-card, .service-card, .values-card, .stat-card", 5);
  });
})();
