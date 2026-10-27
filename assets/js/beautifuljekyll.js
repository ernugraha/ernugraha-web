// Dean Attali / Beautiful Jekyll 2023

let BeautifulJekyllJS = {

  bigImgEl : null,
  numImgs : null,

  init : function() {
    setTimeout(BeautifulJekyllJS.initNavbar, 10);

    // Shorten the navbar after scrolling a little bit down
    $(window).scroll(function() {
        if ($(".navbar").offset().top > 50) {
            $(".navbar").addClass("top-nav-short");
        } else {
            $(".navbar").removeClass("top-nav-short");
        }
    });

    // On mobile, hide the avatar when expanding the navbar menu
    $('#main-navbar').on('show.bs.collapse', function () {
      $(".navbar").addClass("top-nav-expanded");
    });
    $('#main-navbar').on('hidden.bs.collapse', function () {
      $(".navbar").removeClass("top-nav-expanded");
    });

    // On mobile, collapse the navbar after selecting a menu item
    $('#main-navbar a:not(.dropdown-toggle)').click(function() {
      $('#main-navbar').collapse('hide');
    });

    // show the big header image
    BeautifulJekyllJS.initImgs();

    BeautifulJekyllJS.initSearch();
  },

  initNavbar : function() {
    // Set the navbar-dark/light class based on its background color
    const rgb = $('.navbar').css("background-color").replace(/[^\d,]/g,'').split(",");
    const brightness = Math.round(( // http://www.w3.org/TR/AERT#color-contrast
      parseInt(rgb[0]) * 299 +
      parseInt(rgb[1]) * 587 +
      parseInt(rgb[2]) * 114
    ) / 1000);
    if (brightness <= 125) {
      $(".navbar").removeClass("navbar-light").addClass("navbar-dark");
    } else {
      $(".navbar").removeClass("navbar-dark").addClass("navbar-light");
    }
  },

  initImgs : function() {
    // If the page was large images to randomly select from, choose an image
    if ($("#header-big-imgs").length > 0) {
      BeautifulJekyllJS.bigImgEl = $("#header-big-imgs");
      BeautifulJekyllJS.numImgs = BeautifulJekyllJS.bigImgEl.attr("data-num-img");

      // 2fc73a3a967e97599c9763d05e564189
      // set an initial image
      const imgInfo = BeautifulJekyllJS.getImgInfo();
      const src = imgInfo.src;
      const desc = imgInfo.desc;
      BeautifulJekyllJS.setImg(src, desc);

      // For better UX, prefetch the next image so that it will already be loaded when we want to show it
      const getNextImg = function() {
        const imgInfo = BeautifulJekyllJS.getImgInfo();
        const src = imgInfo.src;
        const desc = imgInfo.desc;

        const prefetchImg = new Image();
        prefetchImg.src = src;
        // if I want to do something once the image is ready: `prefetchImg.onload = function(){}`

        setTimeout(function(){
          const img = $("<div></div>").addClass("big-img-transition").css("background-image", 'url(' + src + ')');
          $(".intro-header.big-img").prepend(img);
          setTimeout(function(){ img.css("opacity", "1"); }, 50);

          // after the animation of fading in the new image is done, prefetch the next one
          //img.one("transitioned webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
          setTimeout(function() {
            BeautifulJekyllJS.setImg(src, desc);
            img.remove();
            getNextImg();
          }, 1000);
          //});
        }, 6000);
      };

      // If there are multiple images, cycle through them
      if (BeautifulJekyllJS.numImgs > 1) {
        getNextImg();
      }
    }
  },

  getImgInfo : function() {
    const randNum = Math.floor((Math.random() * BeautifulJekyllJS.numImgs) + 1);
    const src = BeautifulJekyllJS.bigImgEl.attr("data-img-src-" + randNum);
    const desc = BeautifulJekyllJS.bigImgEl.attr("data-img-desc-" + randNum);

    return {
      src : src,
      desc : desc
    }
  },

  setImg : function(src, desc) {
    $(".intro-header.big-img").css("background-image", 'url(' + src + ')');
    if (typeof desc !== typeof undefined && desc !== false) {
      $(".img-desc").text(desc).show();
    } else {
      $(".img-desc").hide();
    }
  },

  initSearch : function() {
    if (!document.getElementById("beautifuljekyll-search-overlay")) {
      return;
    }

    $("#nav-search-link").click(function(e) {
      e.preventDefault();
      $("#beautifuljekyll-search-overlay").show();
      $("#nav-search-input").focus().select();
      $("body").addClass("overflow-hidden");
    });
    $("#nav-search-exit").click(function(e) {
      e.preventDefault();
      $("#beautifuljekyll-search-overlay").hide();
      $("body").removeClass("overflow-hidden");
    });
    $(document).on('keyup', function(e) {
      if (e.key == "Escape") {
        $("#beautifuljekyll-search-overlay").hide();
        $("body").removeClass("overflow-hidden");
      }
    });
  }
};

// 2fc73a3a967e97599c9763d05e564189

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

  // Hero Canvas
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
        ? `rgba(244,185,66,${0.35 + v * 0.6})`
        : `rgba(236,228,255,${0.12 + v * 0.7})`;
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      }


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
