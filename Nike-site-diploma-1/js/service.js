export const isMobileWidth = (width, breakpoint) => {
	return width <= breakpoint;
};

export const computeScale = (outerWidth, designWidth) => {
	return outerWidth / designWidth;
};

export const getNextShoeIndex = (currentIndex, total) => {
	return (currentIndex + 1) % total;
};

export const getAdjacentIndex = (currentIndex, total, direction) => {
	return (currentIndex + direction + total) % total;
};

export const normalizeText = (text) => {
	return text.trim().toLowerCase();
};

export const matchesQuery = (name, query) => {
	if (query === "") {
		return true;
	}

	return normalizeText(name).indexOf(normalizeText(query)) !== -1;
};
