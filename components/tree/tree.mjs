export class Tree {
	constructor(obj) {
		this.BODY = d3.select("body");
		this.ID = obj.id;
		this.animate = obj.animate;
		this.demoContainer = this.BODY.selectAll(`#${this.ID}`);
		this.container_width = obj.container_width
			? `${obj.container_width}%`
			: "80%";
		this.container_height = obj.container_height
			? `${obj.container_height}%`
			: "40%";
		this.user_width = obj.width ? obj.width : 400;
		this.user_height = obj.height ? obj.height : 400;
		this.edgeLength = obj.edgeLength ? obj.edgeLength : 40;
		this.treeData = obj.data;
		this.isLevel = obj.leveled ? obj.leveled : false;
		this.isHeightMarked = obj.heightMarked ? obj.heightMarked : false;
		this.isDepthMarked = obj.depthMarked ? obj.depthMarked : false;
		this.isBFMarked = obj.BFMarked ? obj.BFMarked : false;
		this.balanceFactor = (d) => {
			let left_child_height;
			let right_child_height;
			if (undefined != d.children) {
				let left_child = d.children[0];
				let right_child = d.children[1];
				left_child_height =
					undefined != left_child.data.display &&
					left_child.data.display === "none"
						? 0
						: left_child.height + 1;
				right_child_height =
					undefined != right_child.data.display &&
					right_child.data.display === "none"
						? 0
						: right_child.height + 1;
			} else {
				left_child_height = d.height + 1;
				right_child_height = d.height + 1;
			}
			const balance_factor = left_child_height - right_child_height;
			return balance_factor;
		};
		this.isDirected = obj.directed ? obj.directed : false;
		this.nodeCount = this.treeData.length;
		this.colors = {
			strokeColor: "#CC7351",
			nodeStrokeColor: "#EB8242",
			nodeColor: "#FFEB99",
			leafColor: "#E7FBBE",
			leafStrokeColor: "green",
			subtreeColor: "#C8F2EF",
			subtreeTextColor: "#1572A1",
			subtreeStrokeColor: "#1572A1",
			textColor: "black",
			leafTextColor: "black",
			edgeLabelColor: "orangered",
			levelTextColor: "teal",
			heightMarkColor: "#8FBDD3",
			depthMarkColor: "#CDB699",
		};
		this.narrow = obj.narrow ? obj.narrow : 0;
		this.margin = {
			top: 30,
			right: 20,
			bottom: 20,
			left: 20 + this.narrow,
		};
		this.dimensions = {
			width: this.user_width - this.margin.left - this.margin.right,
			height: this.user_height - this.margin.top - this.margin.bottom,
			edgeStroke: 1,
			strokeWidth: 1,
			radius: 10,
			fontSize: "0.85rem",
			annotationFontSize: "0.7rem",
			edgeLabelFontSize: "0.65rem",
			levelFontSize: "0.85rem",
		};
		this.svg = this.demoContainer
			.append("div")
			.style("display", "inline-block")
			.style("position", "relative")
			.style("width", this.container_width)
			.style("padding-bottom", this.container_height)
			.style("overflow", "hidden")
			.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${
					this.dimensions.width + this.margin.left + this.margin.right
				} ${
					this.dimensions.height + this.margin.top + this.margin.bottom
				}`,
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr(
				"transform",
				`translate(${this.margin.left}, ${this.margin.top})`,
			);
		this.root = d3
			.stratify()
			.id((d) => d.child)
			.parentId((d) => d.parent)(this.treeData);
		this.treeSize = () => {
			const levelWidth = [1];
			const childCount = function (level, n) {
				if (n.children && n.children.length > 0) {
					if (levelWidth.length <= level + 1) {
						levelWidth.push(0);
					}
					levelWidth[level + 1] += n.children.length;
					n.children.forEach(function (d) {
						childCount(level + 1, d);
					});
				}
			};
			childCount(0, this.root);
			const newHeight = d3.max(levelWidth) * 30; // 50 pixels per line
			return newHeight;
		};
		this.edgeLength = obj.edgeLength
			? obj.edgeLength
			: this.treeSize() * 1.1;
		this.displayNodes =
			undefined !== obj.displayNodes ? !obj.displayNodes : false;
	}
	render() {
		this.demoContainer.classed("demo-container", true);
		// SVG rendering

		// Append SVG definition markers
		const svgDefs = this.svg.append("svg:defs");
		svgDefs
			.selectAll("marker")
			.data(["end"])
			.enter()
			.append("svg:marker")
			.attr("id", "end")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 26)
			.attr("refY", 0)
			.attr("markerWidth", 6)
			.attr("markerHeight", 8)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");

		// Data structuring
		const treeStructure = d3
			.tree()
			.size([this.dimensions.width - this.narrow, this.edgeLength])
			.separation((a, b) => (a.parent == b.parent ? 1 : 1.1));
		treeStructure(this.root);

		// Leveled
		// if data object has property leveled: true, level numbers are added
		function nodesByLevel(nodeList) {
			const arr = [];
			let depth = nodeList[0].depth;
			arr.push(nodeList[0]);
			for (let i = 0; i < nodeList.length; i++) {
				if (nodeList[i].depth > depth) {
					arr.push(nodeList[i]);
					depth = nodeList[i].depth;
				}
			}
			return arr;
		}

		if (this.isLevel) {
			const levelNums = this.svg
				.append("g")
				.selectAll("text")
				.data(nodesByLevel(this.root.descendants()))
				.enter()
				.append("text")
				.attr("x", 0)
				.attr("y", (d) => d.y + 3)
				.text((d) => d.depth + 1)
				.attr("text-anchor", "middle")
				.attr("fill", this.colors.levelTextColor)
				.style("font-family", "Fira")
				.style("font-size", this.dimensions.levelFontSize);
			levelNums
				.selectAll("line")
				.data(nodesByLevel(this.root.descendants()))
				.enter()
				.append("line")
				.attr(
					"x1",
					(d) => -this.dimensions.width + this.dimensions.width + 10,
				)
				.attr("y1", (d) => d.y)
				.attr("x2", (d) => this.dimensions.width)
				.attr("y2", (d) => d.y)
				.attr("stroke", this.colors.levelTextColor);
		}

		if (this.isDepthMarked) {
			const DepthNums = this.svg.append("g");
			DepthNums.selectAll("text")
				.data(this.root.descendants())
				.enter()
				.filter((d) => !d.data.display)
				.append("text")
				.attr("x", (d) => d.x)
				.attr("y", (d) => d.y)
				.attr("dx", -this.dimensions.radius - this.dimensions.radius / 2)
				.text((d) => d.depth)
				.attr("text-anchor", "end")
				.attr("fill", this.colors.depthMarkColor)
				.style("font-family", "Fira")
				.style("font-size", this.dimensions.levelFontSize);
		}

		if (this.isHeightMarked) {
			const heightNums = this.svg.append("g");
			heightNums
				.selectAll("text")
				.data(this.root.descendants())
				.enter()
				.filter((d) => !d.data.display)
				.append("text")
				.attr("x", (d) => d.x)
				.attr("y", (d) => d.y)
				.attr("dx", this.dimensions.radius + this.dimensions.radius / 2)
				.text((d) => d.height + 1)
				.attr("text-anchor", "middle")
				.attr("fill", this.colors.heightMarkColor)
				.style("font-family", "Fira")
				.style("font-size", this.dimensions.levelFontSize);
		}
		if (this.isBFMarked) {
			const bfNums = this.svg.append("g");
			bfNums
				.selectAll("text")
				.data(this.root.descendants())
				.enter()
				.filter((d) => !d.data.display)
				.filter((d) => !d.data.type)
				.append("text")
				.attr("x", (d) => d.x)
				.attr("y", (d) => d.y)
				.attr("dy", -this.dimensions.radius - this.dimensions.radius / 2)
				.text((d) => this.balanceFactor(d))
				.attr("text-anchor", "middle")
				.attr("fill", (d) => {
					if (Math.abs(this.balanceFactor(d)) > 1) {
						return `firebrick`;
					} else {
						return `forestgreen`;
					}
				})
				.style("font-family", "Fira")
				.style("font-size", this.dimensions.levelFontSize);
		}
		// Add links
		const links = this.svg.append("g");
		const physicalLink = links
			.selectAll("line")
			.data(this.root.links())
			.enter()
			.append("line")
			.attr("display", (d) =>
				d.source.data.display || d.target.data.display
					? "none"
					: "initial",
			)
			.attr("x1", (d) => d.source.x)
			.attr("y1", (d) => d.source.y)
			.attr("x2", (d) => d.target.x)
			.attr("y2", (d) => d.target.y)
			.attr("stroke", (d) => {
				if (d.target.data.path) {
					return this.colors.edgeLabelColor;
				} else {
					return this.colors.strokeColor;
				}
			})
			.attr("stroke-opacity", (d) =>
				d.target.data.opacity ? d.target.data.opacity : 1,
			)
			.attr("marker-end", () => {
				if (this.isDirected) {
					return "url(#end)";
				}
			})
			.attr("stroke-width", (d) => {
				if (d.target.data.path) {
					return 3;
				} else {
					return this.dimensions.edgeStroke;
				}
			});

		// Edge labe - edge labels included only if edge has edgeLabel: property set
		const linkLabel = links
			.selectAll("text")
			.data(this.root.links())
			.enter()
			.filter((d) => d.target.data.edgeLabel)
			.append("text")
			.text((d) => {
				return d.target.data.edgeLabel;
			})
			.attr("x", (d) => (d.source.x + d.target.x) / 2)
			.attr("y", (d) => (d.source.y + d.target.y) / 2)
			.attr("text-anchor", "middle")
			.attr("fill", this.colors.edgeLabelColor)
			.style("font-family", "Fira")
			.style("font-size", this.dimensions.edgeLabelFontSize);

		const arrowToLink = links
			.selectAll("path")
			.data(this.root.links())
			.enter()
			.filter(
				(d) =>
					d.target.data.arrowTo !== undefined ||
					d.source.data.arrowTo !== undefined,
			)
			.append("path")
			.attr("fill", "none")
			.attr("stroke", "black")
			.attr("d", (d) => {
				const source = d.target.data.arrowTo ? d.target : d.source;
				const targetIndex = source.data.arrowTo;
				const target = this.root.descendants()[targetIndex];
				const midway = (source.y + target.y) / this.nodeCount;
				if (source.x == target.x) {
					return `M${source.x} ${source.y}, S ${target.y} ${target.x}, ${target.x} ${target.y}`;
				} else {
					return `M${source.x} ${source.y}, S ${source.y / 2} ${
						source.x / 2
					}, ${target.x} ${target.y}`;
				}
			})
			.attr("marker-end", "url(#end)");

		const node = this.svg
			.selectAll("circle")
			.data(this.root.descendants())
			.enter()
			.append("g");

		const circles = node
			.filter((d) => !d.data.display)
			.filter((d) => !d.data.noCircle)
			.filter((d) => !d.data.type)
			.append("circle")
			.attr("class", "treeNode")
			.attr("cx", (d) => d.x)
			.attr("cy", (d) => d.y)
			.attr("r", this.dimensions.radius)
			.style("fill", (d) => {
				if (this.displayNodes) {
					return "white";
				} else if (d.data.focus) {
					return `${d.data.focus.fill}`;
				} else {
					return d.height == 0
						? this.colors.leafColor
						: this.colors.nodeColor;
				}
			})
			.attr("opacity", (d) => (d.data.opacity ? d.data.opacity : 1))
			.attr("stroke", (d) => {
				if (this.displayNodes) {
					return "white";
				} else if (
					d.data.focus != undefined &&
					d.data.focus.stroke != undefined
				) {
					return d.data.focus.stroke;
				}
				if (d.children) {
					return this.colors.nodeStrokeColor;
				} else {
					return this.colors.leafStrokeColor;
				}
			})
			.attr("stroke-width", this.dimensions.strokeWidth);

		const triangles = node
			.filter((d) => d.data.type)
			.append("path")
			.attr("transform", (d, i) => {
				return `translate(${d.x}, ${d.y + this.dimensions.radius})`;
			})
			.attr("stroke-width", 1)
			.attr(
				"d",
				d3
					.symbol()
					.type(d3.symbolTriangle)
					.size(this.dimensions.radius * 18),
			)
			.attr("stroke", (d) => {
				if (
					d.data.focus != undefined &&
					d.data.focus.stroke != undefined
				) {
					return d.data.focus.stroke;
				} else {
					return this.colors.subtreeStrokeColor;
				}
			})
			.attr("fill", (d) => {
				if (d.data.focus) {
					return `${d.data.focus.fill}`;
				} else {
					return this.colors.subtreeColor;
				}
			});

		// Append labels group
		const labels = this.svg.append("g");

		// Data labels
		const dataField = labels
			.selectAll("text")
			.data(this.root)
			.enter()
			.filter((d) => !d.data.display)
			.filter((d) => !d.data.label)
			.append("text")
			.text((d) => d.id)
			.attr("x", (d) => d.x)
			.attr("y", (d) => {
				if (d.data.noCircle) {
					return d.y + 18;
				} else if (d.data.type) {
					return d.y + this.dimensions.radius;
				} else {
					return d.y;
				}
			})
			.attr("dy", "0.3em")
			.attr("opacity", (d) => (d.data.opacity ? d.data.opacity : 1))
			.attr("text-anchor", "middle")
			.attr("fill", (d) => {
				if (d.data.focus != undefined && d.data.focus.text != undefined) {
					return d.data.focus.text;
				} else if (d.data.type != undefined && d.data.type === "subtree") {
					return this.colors.subtreeTextColor;
				} else {
					return d.children
						? this.colors.textColor
						: this.colors.leafTextColor;
				}
			})
			.style("font-family", "system-ui")
			.style("font-size", this.dimensions.fontSize);

		const pointerGroup = node
			.select(".path")
			.data(this.root)
			.enter()
			.filter((d) => {
				return d.data.pointer;
			})
			.append("g");
		const pointerArrow = pointerGroup
			.append("svg:marker")
			.attr("id", "treeArrowEnd")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", -25)
			.attr("refY", 0)
			.attr("markerWidth", 6)
			.attr("markerHeight", 8)
			.attr("orient", "0")
			.append("svg:path")
			.attr("d", "M 0, 5 L 10, 0 L 0, -5");
		const pointerLine = pointerGroup
			.filter((d) => {
				return d.data.pointer;
			})
			.append("path")
			.attr("stroke", "black")
			.attr("d", (d) => `M ${d.x - 35} ${d.y}, L ${d.x - 15} ${d.y}, Z`)
			.attr("marker-end", "url(#treeArrowEnd)");
		const pointerText = pointerGroup
			.append("text")
			.attr("fill", "grey")
			.attr("text-anchor", "end")
			.style("font-family", "Fira")
			.style("font-size", "0.8rem")
			.attr("x", (d) => d.x - 40)
			.attr("y", (d) => d.y + 4)
			.text((d) => d.data.pointer);

		// .append('foreignObject')
		// .append('div')
		// .attr('width', 10)
		// .attr('height', 10)
		// .html(d => d.data.pointer)

		const annotate = labels
			.selectAll("text.annotate")
			.data(this.root)
			.enter()
			.filter((d) => d.data.annotate)
			.append("text")
			.text((d) => d.data.annotate)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y - 20)
			.attr("text-anchor", "middle")
			.attr("fill", this.colors.textColor)
			.style("font-family", "Fira")
			.style("font-size", this.dimensions.annotationFontSize);
	}
}
