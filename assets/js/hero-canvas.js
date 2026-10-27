document.addEventListener("DOMContentLoaded", () => {

    const titles = document.querySelectorAll('.home-section-title:not(.hero-wrapper .home-section-title)');  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const reveal = (el) => {
        if (!el || el.classList.contains('is-visible')) return;

        if (reduceMotion) {
            el.classList.add('is-visible');
            return;
        }

        // Double rAF: Mencegah bug "blank" di Chromium/Brave
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.classList.add('is-visible');
            });
        });
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        titles.forEach(title => {
            observer.observe(title);
            setTimeout(() => reveal(title), 2500); // Jaring pengaman
        });
    } else {
        titles.forEach(reveal);
    }

    const canvas = document.getElementById("hero-field");
    if (canvas) {
        heroField(canvas);
    }

    // Fungsi Canvas NguliQ (Jangan diubah)
    function heroField(canvas) {
        const ctx = canvas.getContext("2d");
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        let W, H, dpr, pts = [], gap, src, running = true, t = 0, raf;
        const k = 0.075, omega = 2.2;

        function layout() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            const r = canvas.getBoundingClientRect();
            W = r.width; H = r.height;
            canvas.width = W * dpr; canvas.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            gap = W < 700 ? 13 : 16;

            src = src || [{ x: W * 0.78, y: H * 0.38 }, { x: W * 0.78, y: H * 0.62 }];
            if (!moved) {
                src[0] = { x: W * 0.8, y: H * 0.36 };
                src[1] = { x: W * 0.8, y: H * 0.64 };
            }

            pts = [];
            for (let y = gap / 2; y < H; y += gap)
                for (let x = gap / 2; x < W; x += gap)
                    pts.push({ x, y, r1: 0, r2: 0 });

            distances();
        }

        function distances() {
            for (const p of pts) {
                p.r1 = Math.hypot(p.x - src[0].x, p.y - src[0].y);
                p.r2 = Math.hypot(p.x - src[1].x, p.y - src[1].y);
            }
        }

        function frame() {
            ctx.clearRect(0, 0, W, H);
            const ph = omega * t;

            for (const p of pts) {
                const d1 = Math.exp(-p.r1 / 1400), d2 = Math.exp(-p.r2 / 1400);
                const a = (Math.sin(k * p.r1 - ph) * d1 + Math.sin(k * p.r2 - ph) * d2) / 2;
                const v = a * a;

                if (v < 0.03) {
                    ctx.fillStyle = "rgba(236,228,255,0.07)";
                    ctx.fillRect(p.x - 0.75, p.y - 0.75, 1.5, 1.5);
                    continue;
                }

                const size = 1.4 + v * 3.6;
                ctx.fillStyle = v > 0.5
                ? `rgba(255,255,255,${0.35 + v * 0.6})`
                : `rgba(236,228,255,${0.12 + v * 0.7})`;
                ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
            }

            for (const s of src) {
                ctx.beginPath();
                ctx.fillStyle = "#F4B942";
                ctx.fill();
            }
        }

        function loop(now) {
            t = now / 1000;
            frame();
            if (running) raf = requestAnimationFrame(loop);
        }

        let moved = false;

        canvas.parentElement.addEventListener("pointermove", e => {
            const r = canvas.getBoundingClientRect();
            moved = true;
            src[1] = { x: e.clientX - r.left, y: e.clientY - r.top };
            distances();
            if (reduce) frame();
        });

            window.addEventListener("resize", () => {
                layout();
                if (reduce) frame();
            });

                layout();

                if (reduce) {
                    t = 0.4;
                    frame();
                    return;
                }

                new IntersectionObserver(([en]) => {
                    running = en.isIntersecting;
                    if (running) raf = requestAnimationFrame(loop);
                    else cancelAnimationFrame(raf);
                }).observe(canvas);
    }
});
