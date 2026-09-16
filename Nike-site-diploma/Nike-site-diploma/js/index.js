(function () {
	"use strict";

	var DESIGN_WIDTH = 1440;

	var MOBILE_BREAKPOINT = 1024;

	function isMobile() {
		return window.innerWidth <= MOBILE_BREAKPOINT;
	}

	function initScale() {
		var outer = document.querySelector(".scale-outer");
		var inner = document.querySelector(".scale-inner");

		if (!outer || !inner) {
			return;
		}

		function applyScale() {
			if (isMobile()) {
				inner.style.transform = "";
				outer.style.height = "";
				return;
			}

			var scale = outer.clientWidth / DESIGN_WIDTH;

			inner.style.transform = "scale(" + scale + ")";
			outer.style.height = inner.offsetHeight * scale + "px";
		}

		applyScale();

		window.addEventListener("resize", applyScale);

		if (document.fonts && document.fonts.ready) {
			document.fonts.ready.then(applyScale);
		}

		window.addEventListener("load", applyScale);

		if (typeof ResizeObserver !== "undefined") {
			new ResizeObserver(applyScale).observe(inner);
		}
	}

	var SHOES = [
		{
			image: "./icons/hero-card-2.png",
			title: ["NIKE SB", "DUNK HIGH"],
			price: "$189",
		},
		{
			image: "./icons/product-aj13.png",
			title: ["AIR JORDAN 13", "COURT PURPLE"],
			price: "$245",
		},
		{
			image: "./icons/product-airmax-plus3.png",
			title: ["NIKE AIR", "MAX PLUS 3"],
			price: "$210",
		},
		{
			image: "./icons/hero-jordan.png",
			title: ["AIR JORDAN 1", "RETRO HIGH OG"],
			price: "$275",
		},
		{
			image: "./icons/product-aj1-ajko.png",
			title: ["AIR JORDAN 1", "AJKO BLUE RED"],
			price: "$232",
		},
		{
			image: "./icons/product-vans.png",
			title: ["VANS OLD SKOOL", "SUEDE HONEY GOLD"],
			price: "$98",
		},
		{
			image: "./icons/fav-dunk-high.png",
			title: ["NIKE DUNK", "HIGH GREEN"],
			price: "$187",
		},
	];

	var DEFAULT_SHOE = 3;

	function initShoePicker() {
		var svg = document.querySelector(".hero__colors-svg");
		var shoeImg = document.querySelector(".hero__shoe-img");
		var shoeInner = document.querySelector(".hero__shoe-inner");
		var ring = document.querySelector(".hero__dot-ring");
		var titleLines = document.querySelectorAll(".hero__title-line");
		var price = document.querySelector(".hero__price");
		var spinBtn = document.querySelector(".hero__360-btn");

		if (!svg || !shoeImg || !ring) {
			return;
		}

		var dots = Array.prototype.slice.call(svg.querySelectorAll(".hero__dot"));
		var hitGroup = svg.querySelector(".hero__dot-hits");
		var current = DEFAULT_SHOE;

		function showShoe(index, options) {
			var shoe = SHOES[index];

			if (!shoe || index === current) {
				return;
			}

			current = index;

			var dot = dots[index];
			if (dot) {
				ring.setAttribute("cx", dot.getAttribute("cx"));
				ring.setAttribute("cy", dot.getAttribute("cy"));
			}

			if (options && options.spin && shoeInner) {
				shoeInner.classList.remove("is-spinning");

				void shoeInner.offsetWidth;
				shoeInner.classList.add("is-spinning");
			}

			shoeImg.classList.add("is-swapping");

			window.setTimeout(function () {
				shoeImg.src = shoe.image;
				shoeImg.alt = shoe.title.join(" ");

				if (titleLines.length === 2) {
					titleLines[0].textContent = shoe.title[0];
					titleLines[1].textContent = shoe.title[1];
				}

				if (price) {
					price.textContent = shoe.price;
				}

				shoeImg.classList.remove("is-swapping");
			}, 220);
		}

		dots.forEach(function (dot, index) {
			var hit = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"circle",
			);

			hit.setAttribute("class", "hero__dot-hit");
			hit.setAttribute("cx", dot.getAttribute("cx"));
			hit.setAttribute("cy", dot.getAttribute("cy"));
			hit.setAttribute("r", "18");
			hit.setAttribute("role", "button");
			hit.setAttribute("tabindex", "0");
			hit.setAttribute(
				"aria-label",
				"Расцветка: " + SHOES[index].title.join(" "),
			);

			hit.addEventListener("click", function () {
				showShoe(index);
			});

			hit.addEventListener("keydown", function (event) {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					showShoe(index);
				}
			});

			hit.addEventListener("mouseenter", function () {
				dot.classList.add("hero__dot--hover");
			});

			hit.addEventListener("mouseleave", function () {
				dot.classList.remove("hero__dot--hover");
			});

			hitGroup.appendChild(hit);
		});

		if (spinBtn) {
			spinBtn.addEventListener("click", function () {
				showShoe((current + 1) % SHOES.length, { spin: true });
			});
		}
	}

	function initSizeSelect() {
		var btn = document.querySelector(".hero__size-btn");
		var list = document.querySelector(".hero__size-list");
		var value = document.querySelector(".hero__size-value");

		if (!btn || !list || !value) {
			return;
		}

		var options = Array.prototype.slice.call(
			list.querySelectorAll(".hero__size-option"),
		);

		function open() {
			list.hidden = false;
			btn.setAttribute("aria-expanded", "true");

			var selected = list.querySelector('[aria-selected="true"]');
			(selected || options[0]).focus();
		}

		function close(returnFocus) {
			list.hidden = true;
			btn.setAttribute("aria-expanded", "false");

			if (returnFocus) {
				btn.focus();
			}
		}

		function isOpen() {
			return !list.hidden;
		}

		function select(option) {
			options.forEach(function (item) {
				item.removeAttribute("aria-selected");
			});

			option.setAttribute("aria-selected", "true");
			value.textContent = option.dataset.size;
			close(true);
		}

		btn.addEventListener("click", function () {
			if (isOpen()) {
				close(false);
			} else {
				open();
			}
		});

		options.forEach(function (option, index) {
			option.addEventListener("click", function () {
				select(option);
			});

			option.addEventListener("keydown", function (event) {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					select(option);
				} else if (event.key === "ArrowDown") {
					event.preventDefault();
					options[(index + 1) % options.length].focus();
				} else if (event.key === "ArrowUp") {
					event.preventDefault();
					options[(index - 1 + options.length) % options.length].focus();
				}
			});
		});

		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape" && isOpen()) {
				close(true);
			}
		});

		document.addEventListener("click", function (event) {
			if (
				isOpen() &&
				!list.contains(event.target) &&
				!btn.contains(event.target)
			) {
				close(false);
			}
		});
	}

	function initMobileMenu() {
		var burger = document.querySelector(".header__menu");
		var nav = document.querySelector(".header__nav");

		if (!burger || !nav) {
			return;
		}

		burger.setAttribute("aria-expanded", "false");
		burger.setAttribute("aria-controls", "main-nav");
		nav.id = "main-nav";

		function close() {
			nav.classList.remove("header__nav--open");
			burger.classList.remove("header__menu--open");
			burger.setAttribute("aria-expanded", "false");
		}

		burger.addEventListener("click", function () {
			var willOpen = !nav.classList.contains("header__nav--open");

			nav.classList.toggle("header__nav--open", willOpen);
			burger.classList.toggle("header__menu--open", willOpen);
			burger.setAttribute("aria-expanded", String(willOpen));
		});

		nav.addEventListener("click", function (event) {
			if (event.target.closest(".header__link")) {
				close();
			}
		});

		document.addEventListener("click", function (event) {
			if (!nav.contains(event.target) && !burger.contains(event.target)) {
				close();
			}
		});

		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape") {
				close();
			}
		});

		window.addEventListener("resize", function () {
			if (window.innerWidth > MOBILE_BREAKPOINT) {
				close();
			}
		});
	}

	initScale();
	initShoePicker();
	initSizeSelect();
	initMobileMenu();
})();
