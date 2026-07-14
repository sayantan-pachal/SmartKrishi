export function animateOnScroll(selector) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("opacity-100", "translate-y-0");
                } else {
                    entry.target.classList.remove("opacity-100", "translate-y-0");
                }
            });
        },
        { threshold: 0.2 }
    );

    document.querySelectorAll(selector).forEach((el) => {
        el.classList.add(
    "opacity-0",
    "translate-y-8",
    "transition-all",
    "duration-700",
    "ease-out"
);
        observer.observe(el);
    });
}