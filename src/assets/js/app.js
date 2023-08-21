Fancybox.bind("[data-fancybox]");

class Menu {
  constructor(container, btn) {
    this.container = container;
    this.btn = btn;
    this.isOpen = false;

    if (this.container && this.btn) {
      this.init();
    }
  }

  init() {
    this.btn.addEventListener("click", this.handleClick.bind(this));
  }

  handleClick() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.container.classList.add("_active");
    this.btn.classList.add("_active");
    this.isOpen = true;
  }

  close() {
    this.container.classList.remove("_active");
    this.btn.classList.remove("_active");
    this.isOpen = false;
  }
}

class HeaderDropNavItem {
  constructor(container) {
    this.container = container;
    this.btn = this.container.querySelector(".header-drop-nav-item__btn");
    this.content = this.container.querySelector(".header-drop-nav-item__content");
    this.isOpen = false;
  }

  open() {
    this.container.classList.add("_active");
    this.isOpen = true;
  }

  close() {
    this.container.classList.remove("_active");
    this.isOpen = false;
  }
}

class HeadeDropController {
  constructor(container, navItems, swiper) {
    this.container = container;
    this.dropBtn = this.container.querySelector(".header-drop__btn");
    this.bg = this.container.querySelector(".header-drop__bg");
    this.navItems = navItems;
    this.swiper = swiper;
    this.isOpen = false;
    this.swiperIsShow = false;

    if (this.container && this.dropBtn && this.bg) {
      this.init();
    }
  }

  init() {
    this.dropBtn.addEventListener("click", this.openHandler.bind(this));
    this.bg.addEventListener("click", this.close.bind(this));
    this.bg.addEventListener("mouseenter", this.close.bind(this));

    this.navItems.forEach(item => {
      const newSlide = document.createElement("div");
      newSlide.className = "swiper-slide";
      newSlide.appendChild(item.content.cloneNode(true));

      this.swiper.appendSlide(newSlide);

      // item.btn.addEventListener("click", this.navItemClickHandler.bind(this, item));
      item.btn.addEventListener("mouseenter", this.navItemClickHandler.bind(this, item));
    })
  }

  openHandler() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.container.classList.add("_active");
    this.isOpen = true;
  }

  close() {
    this.container.classList.remove("_active");
    this.isOpen = false;
  }

  swiperHandler() {
    if (this.swiperIsShow) {
      this.swiper.el.classList.add("_show");
    } else {
      this.swiper.el.classList.remove("_show");
    }
  }

  navItemClickHandler(targetItem) {
    this.navItems.forEach((item, index) => {
      if (targetItem === item && !item.isOpen) {
        this.swiperIsShow = true;
        this.swiper.slideTo(index);
        item.open();
        this.swiperHandler();
      } else if (targetItem === item && item.isOpen) {
        this.swiperIsShow = false;
        this.swiper.slideTo(index);
        item.close();
        this.swiperHandler();
      } else {
        item.close();
      }
    });
  }
}

class ModalForm {
  constructor(container) {
    this.container = container;
    this.closeBtn = this.container.querySelector(".modal-form__close-btn");
    this.bg = this.container.querySelector(".modal-form__bg");

    if (this.container && this.closeBtn && this.bg) {
      this.init();
    }
  }

  init() {
    this.closeBtn.addEventListener("click", this.close.bind(this));
    this.bg.addEventListener("click", this.close.bind(this));
  }

  open() {
    this.container.classList.add("_active");
  }

  close() {
    this.container.classList.remove("_active");
  }
}

const paralaxContainers = document.querySelectorAll("[data-paralax]");
paralaxContainers.forEach(container => new Parallax(container));

const lines = document.querySelectorAll(".line");
lines.forEach(container => {
  const path = container.querySelectorAll("path");

  const lineAnim = anime({
    targets: path,
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: "easeInOutSine",
    duration: 4000,
    delay: function (el, i) { return i * 250 },
    autoplay: false,
    paused: true,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      onEnter: () => {
        if (!lineAnim.completed) {
          lineAnim.play();
        }
      }
    },
  });
});

const header = document.querySelector(".header");
if (header) {
  const swiperContainer = header.querySelector(".header-drop__swiper");
  const dropContainer = header.querySelector(".header-drop");
  const dropNavItems = dropContainer.querySelectorAll(".header-drop-nav-item");
  const headerNav = header.querySelector(".header-nav");
  const menuBtn = header.querySelector(".header__menu-btn");
  const headerInfo = header.querySelector(".header-info");

  headerNav.appendChild(headerInfo.cloneNode(true));

  const navItems = [];

  const swiper = new Swiper(swiperContainer, {
    effect: "fade",
    allowTouchMove: false,
  });

  dropNavItems.forEach(item => navItems.push(new HeaderDropNavItem(item)));

  const dropController = new HeadeDropController(dropContainer, navItems, swiper);

  new Menu(headerNav, menuBtn);
}

const mainTop = document.querySelector(".main-top");
if (mainTop) {
  const title = mainTop.querySelector(".main-top__title");
  const text = mainTop.querySelector(".main-top__text");
  const btn = mainTop.querySelector(".main-top__btn");

  const tl = gsap.timeline();
  tl.to(title, {
    duration: 1,
    x: 0,
    opacity: 1,
  })
    .to(text, {
      duration: 1,
      x: 0,
      opacity: 1,
    }, "-=0.5")
    .to(btn, {
      duration: 1,
      x: 0,
      opacity: 1,
    }, "-=0.5")

}

const masters = document.querySelector(".masters");
if (masters) {
  const mainSwiperContainer = masters.querySelector(".masters-swiper");
  const infoSwiperContainer = masters.querySelector(".masters-info");
  const nextBtn = masters.querySelector(".swiper-btns__btn_next");
  const prevBtn = masters.querySelector(".swiper-btns__btn_prev");

  const mainSwiper = new Swiper(mainSwiperContainer, {
    slidesPerView: 1,
    spaceBetween: 50,
    loop: true,
    speed: 500,
    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },
    breakpoints: {
      1025: {
        slidesPerView: "auto",
        spaceBetween: 0,
      },
    }
  });

  const infoSwiper = new Swiper(infoSwiperContainer, {
    speed: 500,
    loop: true,
    spaceBetween: 20,
    // effect: "fade",
    allowTouchMove: false,
    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    }
  });

  mainSwiper.slides.forEach(slide => {
    infoSwiper.appendSlide(slide.cloneNode(true));
  });

  (function checkSwiperLoop() {
    if (mainSwiper.slides.length < 7) {
      mainSwiper.slides.forEach(slide => {
        mainSwiper.appendSlide(slide.cloneNode(true));
      });

      checkSwiperLoop();
    }
  })();

}

const ourWorks = document.querySelector(".our-works");
if (ourWorks) {
  const mainSwiperContainer = ourWorks.querySelector(".our-works-photo");
  const infoSwiperContainer = ourWorks.querySelector(".our-works-info");
  const swiperInfoCurrent = ourWorks.querySelector(".our-works-nav-info__current");
  const swiperInfoAll = ourWorks.querySelector(".our-works-nav-info__all");
  const nextBtn = ourWorks.querySelector(".swiper-btns__btn_next");
  const prevBtn = ourWorks.querySelector(".swiper-btns__btn_prev");

  const mainSwiper = new Swiper(mainSwiperContainer, {
    spaceBetween: 50,
    speed: 800,
    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },
    on: {
      init: (swiper) => {
        swiperInfoCurrent.textContent = swiper.activeIndex + 1 < 10 ? "0" + (swiper.activeIndex + 1) : swiper.activeIndex + 1;
        swiperInfoAll.textContent = swiper.slides.length < 10 ? "0" + swiper.slides.length : swiper.slides.length;
      },
      slideChange: (swiper) => {
        swiperInfoCurrent.textContent = swiper.activeIndex + 1 < 10 ? "0" + (swiper.activeIndex + 1) : swiper.activeIndex + 1;
        swiperInfoAll.textContent = swiper.slides.length < 10 ? "0" + swiper.slides.length : swiper.slides.length;
      }
    }
  });

  const infoSwiper = new Swiper(infoSwiperContainer, {
    spaceBetween: 50,
    speed: 800,
    allowTouchMove: false,
    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },
    // breakpoints: {
    //   501: {
    //     allowTouchMove: true,
    //   }
    // }
  });

  mainSwiper.slides.forEach(slide => {
    infoSwiper.appendSlide(slide.cloneNode(true));
  });
}

const reviews = document.querySelector(".reviews");
if (reviews) {
  const swiperContainer = reviews.querySelector(".reviews__swiper");
  const nextBtn = reviews.querySelector(".swiper-btns__btn_next");
  const prevBtn = reviews.querySelector(".swiper-btns__btn_prev");

  const swiper = new Swiper(swiperContainer, {
    slidesPerView: 1,
    speed: 500,
    spaceBetween: 20,
    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },
    breakpoints: {
      1025: {
        slidesPerView: 3,
      },
      501: {
        slidesPerView: 2,
      }
    }
  });
}

const licenses = document.querySelector(".licenses");
if (licenses) {
  const swiperContainer = licenses.querySelector(".licenses__swiper");
  const nextBtn = licenses.querySelector(".swiper-btns__btn_next");
  const prevBtn = licenses.querySelector(".swiper-btns__btn_prev");

  const swiper = new Swiper(swiperContainer, {
    slidesPerView: 1,
    speed: 500,
    spaceBetween: 20,
    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },
    breakpoints: {
      1025: {
        slidesPerView: 3
      },
      501: {
        slidesPerView: 2,
      }
    }
  });
}

const dataSent = document.querySelectorAll("[data-sent]");
dataSent.forEach(form => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.classList.add("_sent");
  });
});

const price = document.querySelector(".price");
if (price) {
  const mainSwiperContainer = price.querySelector(".price-swiper");
  const navContainer = price.querySelector(".price-nav");

  const navSwiper = new Swiper(navContainer, {
    slidesPerView: "auto",
    speed: 500,
    freeMode: true,
    slideToClickedSlide: true,
  });

  const mainSwiper = new Swiper(mainSwiperContainer, {
    autoHeight: true,
    speed: 500,
    effect: "creative",
    creativeEffect: {
      prev: {
        translate: [0, 0, -400],
      },
      next: {
        translate: ['100%', 0, 0],
      },
    },
    thumbs: {
      swiper: navSwiper,
    },
  })
}

const stocks = document.querySelector(".stocks");
if (stocks) {
  const mainSwiperContainer = stocks.querySelector(".stocks__swiper");
  const infoSwiperContainer = stocks.querySelector(".stocks__info");
  const btnPrev = stocks.querySelector(".swiper-btns__btn_prev");
  const btnNext = stocks.querySelector(".swiper-btns__btn_next");

  const infoSwiper = new Swiper(infoSwiperContainer, {
    speed: 500,
    effect: "fade",
    autoHeight: true,
    allowTouchMove: false,
  });

  const mainSwiper = new Swiper(mainSwiperContainer, {
    autoHeight: true,
    speed: 500,
    effect: "fade",
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    thumbs: {
      swiper: infoSwiper,
    },
    navigation: {
      nextEl: btnNext,
      prevEl: btnPrev,
    },
  });

  mainSwiper.slides.forEach(slide => {
    infoSwiper.appendSlide(slide.cloneNode(true));
  })
}

const modalForm = document.querySelector(".modal-form");
if (modalForm) {
  const modal = new ModalForm(modalForm);
  const btns = document.querySelectorAll("[data-modal-form]");

  btns.forEach(btn => {
    btn.addEventListener("click", () => modal.open());
  });
}
