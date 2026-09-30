import {
	DESIGN_WIDTH,
	MOBILE_BREAKPOINT,
	SHOES,
	DEFAULT_SHOE,
} from "./constants.js";
import {
	isMobileWidth,
	computeScale,
	getNextShoeIndex,
	getAdjacentIndex,
	matchesQuery,
} from "./service.js";

export const initScale = () => {
	const outer = document.querySelector(".scale-outer");
	const inner = document.querySelector(".scale-inner");

	if (!outer || !inner) {
		return;
	}

	const applyScale = () => {
		if (isMobileWidth(window.innerWidth, MOBILE_BREAKPOINT)) {
			inner.style.transform = "";
			outer.style.height = "";
			return;
		}

		const scale = computeScale(outer.clientWidth, DESIGN_WIDTH);

		inner.style.transform = "scale(" + scale + ")";
		outer.style.height = inner.offsetHeight * scale + "px";
	};

	applyScale();

	window.addEventListener("resize", applyScale);

	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(applyScale);
	}

	window.addEventListener("load", applyScale);

	if (typeof ResizeObserver !== "undefined") {
		new ResizeObserver(applyScale).observe(inner);
	}
};

export const initShoePicker = () => {
	const svg = document.querySelector(".hero__colors-svg");
	const shoeImg = document.querySelector(".hero__shoe-img");
	const shoeInner = document.querySelector(".hero__shoe-inner");
	const ring = document.querySelector(".hero__dot-ring");
	const titleLines = document.querySelectorAll(".hero__title-line");
	const price = document.querySelector(".hero__price");
	const spinBtn = document.querySelector(".hero__360-btn");

	if (!svg || !shoeImg || !ring) {
		return;
	}

	const dots = Array.prototype.slice.call(svg.querySelectorAll(".hero__dot"));
	const hitGroup = svg.querySelector(".hero__dot-hits");
	let current = DEFAULT_SHOE;

	const showShoe = (index, options) => {
		const shoe = SHOES[index];

		if (!shoe || index === current) {
			return;
		}

		current = index;

		const dot = dots[index];
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

		window.setTimeout(() => {
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
	};

	dots.forEach((dot, index) => {
		const hit = document.createElementNS(
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

		hit.addEventListener("click", () => {
			showShoe(index);
		});

		hit.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				showShoe(index);
			}
		});

		hit.addEventListener("mouseenter", () => {
			dot.classList.add("hero__dot--hover");
		});

		hit.addEventListener("mouseleave", () => {
			dot.classList.remove("hero__dot--hover");
		});

		hitGroup.appendChild(hit);
	});

	if (spinBtn) {
		spinBtn.addEventListener("click", () => {
			showShoe(getNextShoeIndex(current, SHOES.length), { spin: true });
		});
	}
};

export const initSizeSelect = () => {
	const btn = document.querySelector(".hero__size-btn");
	const list = document.querySelector(".hero__size-list");
	const value = document.querySelector(".hero__size-value");

	if (!btn || !list || !value) {
		return;
	}

	const options = Array.prototype.slice.call(
		list.querySelectorAll(".hero__size-option"),
	);

	const open = () => {
		list.hidden = false;
		btn.setAttribute("aria-expanded", "true");

		const selected = list.querySelector('[aria-selected="true"]');
		(selected || options[0]).focus();
	};

	const close = (returnFocus) => {
		list.hidden = true;
		btn.setAttribute("aria-expanded", "false");

		if (returnFocus) {
			btn.focus();
		}
	};

	const isOpen = () => {
		return !list.hidden;
	};

	const select = (option) => {
		options.forEach((item) => {
			item.removeAttribute("aria-selected");
		});

		option.setAttribute("aria-selected", "true");
		value.textContent = option.dataset.size;
		close(true);
	};

	btn.addEventListener("click", () => {
		if (isOpen()) {
			close(false);
		} else {
			open();
		}
	});

	options.forEach((option, index) => {
		option.addEventListener("click", () => {
			select(option);
		});

		option.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				select(option);
			} else if (event.key === "ArrowDown") {
				event.preventDefault();
				options[getAdjacentIndex(index, options.length, 1)].focus();
			} else if (event.key === "ArrowUp") {
				event.preventDefault();
				options[getAdjacentIndex(index, options.length, -1)].focus();
			}
		});
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && isOpen()) {
			close(true);
		}
	});

	document.addEventListener("click", (event) => {
		if (
			isOpen() &&
			!list.contains(event.target) &&
			!btn.contains(event.target)
		) {
			close(false);
		}
	});
};

export const initMobileMenu = () => {
	const burger = document.querySelector(".header__menu");
	const nav = document.querySelector(".header__nav");

	if (!burger || !nav) {
		return;
	}

	burger.setAttribute("aria-expanded", "false");
	burger.setAttribute("aria-controls", "main-nav");
	nav.id = "main-nav";

	const close = () => {
		nav.classList.remove("header__nav--open");
		burger.classList.remove("header__menu--open");
		burger.setAttribute("aria-expanded", "false");
	};

	burger.addEventListener("click", () => {
		const willOpen = !nav.classList.contains("header__nav--open");

		nav.classList.toggle("header__nav--open", willOpen);
		burger.classList.toggle("header__menu--open", willOpen);
		burger.setAttribute("aria-expanded", String(willOpen));
	});

	nav.addEventListener("click", (event) => {
		if (event.target.closest(".header__link")) {
			close();
		}
	});

	document.addEventListener("click", (event) => {
		if (!nav.contains(event.target) && !burger.contains(event.target)) {
			close();
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			close();
		}
	});

	window.addEventListener("resize", () => {
		if (window.innerWidth > MOBILE_BREAKPOINT) {
			close();
		}
	});
};

export const initProductSearch = () => {
	const input = document.getElementById("sports-search-input");
	const items = Array.prototype.slice.call(
		document.querySelectorAll(".sports__item"),
	);
	const emptyMessage = document.querySelector(".sports__search-empty");

	if (!input || !items.length) {
		return;
	}

	const filter = () => {
		const query = input.value;
		let visibleCount = 0;

		items.forEach((item) => {
			const nameEl = item.querySelector(".sports__name");
			const name = nameEl ? nameEl.textContent : "";
			const matches = matchesQuery(name, query);

			item.classList.toggle("sports__item--hidden", !matches);

			if (matches) {
				visibleCount += 1;
			}
		});

		if (emptyMessage) {
			emptyMessage.hidden = visibleCount !== 0;
		}
	};

	input.addEventListener("input", filter);
};
