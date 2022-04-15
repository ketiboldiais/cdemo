export class TangledTree extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "60%";

		this.containerHeightDefault = "50%";

		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;

		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;

		// Set the SVG's width
		this.SVG_WIDTH = this.OBJ.svg_width ? this.OBJ.svg_width : 300;

		// Set the SVG's height
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 250;

		this.MARGIN = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10,
		};
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.bottom,
		};

		// The SVG container is <div> that wraps the SVG. This allows for resizing.
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "inline-block")
			.style("position", "relative")
			.style("width", this.D3_CONTAINER_WIDTH)
			.style("padding-bottom", this.D3_CONTAINER_HEIGHT)
			.style("overflow", "hidden");

		this.SVG = this.SVG_CONTAINER.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${
					this.DIMENSIONS.width + this.MARGIN.left + this.MARGIN.right
				} ${
					this.DIMENSIONS.height + this.MARGIN.top + this.MARGIN.bottom
				}`,
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr(
				"transform",
				`translate(${this.MARGIN.left}, ${this.MARGIN.top})`,
			);
		this.COLOR = d3.scaleOrdinal(d3.schemeDark2);

		this.LEVELS = this.OBJ.data;
		this.LEVELS.forEach((l, i) => l.forEach((n) => (n.level = i)));

		this.NODES = this.LEVELS.reduce((a, x) => a.concat(x), []);
		this.NODES_INDEX = {};
		this.NODES.forEach((d) => (this.NODES_INDEX[d.id] = d));

		this.NODES.forEach((d) => {
			d.parents = (d.parents === undefined ? [] : d.parents).map(
				(p) => this.NODES_INDEX[p],
			);
		});

		this.LINKS = [];

		this.LEVELS.forEach((l, i) => {
			var index = {};
			l.forEach((n) => {
				if (n.parents.length == 0) {
					return;
				}
				var id = n.parents
					.map((d) => d.id)
					.sort()
					.join("--");
				if (id in index) {
					index[id].parents = index[id].parents.concat(n.parents);
				} else {
					index[id] = { id: id, parents: n.parents.slice(), level: i };
				}
				n.bundle = index[id];
			});
			l.bundles = Object.keys(index).map((k) => index[k]);
			l.bundles.forEach((b, i) => (b.i = i));
		});

		this.NODES.forEach((d) => {
			d.parents.forEach((p) =>
				this.LINKS.push({ source: d, bundle: d.bundle, target: p }),
			);
		});

		this.BUNDLES = this.LEVELS.reduce((a, x) => a.concat(x.bundles), []);
		this.NODE_HEIGHT = 17;
		this.NODE_WIDTH = 120;
		this.BUNDLE_WIDTH = 30;
		this.LEVEL_Y_PADDING = 20;
		this.X_OFFSET = 0;
		this.Y_OFFSET = 0;

		this.LEVELS.forEach((l) => {
			this.X_OFFSET += l.bundles.length * this.BUNDLE_WIDTH;
			this.Y_OFFSET += this.LEVEL_Y_PADDING;
			l.forEach((n, i) => {
				n.x =
					n.level * this.NODE_WIDTH + this.X_OFFSET + this.NODE_HEIGHT / 2;
				n.y = i * this.NODE_HEIGHT + this.Y_OFFSET;
			});
			this.Y_OFFSET += l.length * this.NODE_HEIGHT;
		});

		this.LEVELS.forEach((l) => {
			let i = 0;
			l.bundles.forEach((b) => {
				b.x =
					b.parents[0].x +
					this.NODE_WIDTH +
					(l.bundles.length - 1 - b.i) * this.BUNDLE_WIDTH;
				b.y = i * this.NODE_HEIGHT;
			});
			i += l.length;
		});
		this.LINKS.forEach((l) => {
			l.xt = l.target.x;
			l.yt = l.target.y;
			l.xb = l.bundle.x;
			l.yb = l.bundle.y;
			l.xs = l.source.x;
			l.ys = l.source.y;
		});
		this.curveFactor = 16;
		this.pathGenerate = (d) => {
			return `M${d.xt} ${d.yt}
			L${d.xb - this.curveFactor} ${d.yt}
			A${this.curveFactor} ${this.curveFactor} 90 0 1 ${d.xb} ${
				d.yt + this.curveFactor
			}
			L${d.xb} ${d.ys - this.curveFactor}
			A${this.curveFactor} ${this.curveFactor} 90 0 0 ${
				d.xb + this.curveFactor
			} ${d.ys}
			L${d.xs} ${d.ys}`;
		};
		this.attrs = {
			font: {
				size: 12,
				color: "#000",
			},
		};
	}
	render() {
		const paths = this.SVG.selectAll("path")
			.data(this.LINKS)
			.enter()
			.append("path")
			.attr("fill", "none")
			.attr("stroke", (d) => `${this.COLOR(d.bundle.id)}`)
			.attr("d", (d) => this.pathGenerate(d));
		const whiteText = this.SVG.selectAll("text")
			.data(this.NODES)
			.enter()
			.append("text")
			.style("font-size", this.attrs.font.size)
			.style("font-family", this.styles.font)
			.attr("stroke", "white")
			.attr("stroke-width", this.styles.fontSize)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("dy", "0.35em")
			.text((d) => d.id);
		const text = this.SVG.selectAll("foo")
			.data(this.NODES)
			.enter()
			.append("text")
			.attr("fill", (d) => (d.focus ? d.focus : this.attrs.font.color))
			.style("font-size", this.styles.fontSize)
			.style("font-family", this.styles.font)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("dy", "0.35em")
			.text((d) => d.id);
	}
}
