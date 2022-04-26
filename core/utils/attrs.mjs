export const attrs = (d3selection, style) => {
	Object.entries(style).forEach(([prop, val]) => {
		console.log(d3selection)
		d3selection.attr(prop, val)
	});
	return d3selection;
};
