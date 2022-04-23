import D3Base from "../../core/d3_base/D3Base.mjs";
import setValue from "../../core/utils/setValue.mjs";

export class Tree extends D3Base {
	constructor(obj) {
		super(obj);
		this.narrow = setValue(this.OBJ.narrow, 0);
		this.margins = () =>
			this.setMargin(20, 20 + this.narrow, 20, 20 + this.narrow);
		this.svg = () => this.setSVGDimensions(300, 350);
		this.SVG_CONTAINER = this.generateSVGContainer(70, 35);
		this.SVG = this.generateSVG();

		this.ATTRIBUTES = {
			edgeStroke: 1,
			strokeWidth: 1,
			fontSize: "0.85rem",
			radius: 8,
			annotationFontSize: "0.7rem",
			edgeLabelFontSize: "0.65rem",
			levelFontSize: "0.85rem",
		};

		this.treeData = this.OBJ.data;
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
			levelTextColor: "lightgrey",
			heightMarkColor: "#8FBDD3",
			depthMarkColor: "#CDB699",
		};

		this.root = d3
			.stratify()
			.id((d) => d.child)
			.parentId((d) => d.parent)(this.treeData);

		this.edgeLength = setValue(this.OBJ.edgeLength, this.calculateTreeSize())
	}

	calculateTreeSize() {
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
		const newHeight = d3.max(levelWidth) * 40;
		return newHeight;
	}

	render() {
		const treeStructure = d3
			.tree()
			.size([this.svg().width - this.narrow, this.edgeLength])
			.separation((a, b) => (a.parent == b.parent ? 1 : 1.1));
		treeStructure(this.root);

		if (this.OBJ.directed) this.addArrowDefinitions();
		if (this.OBJ.markLevel) this.markLevels();
		if (this.OBJ.markDepth) this.markDepth();
		if (this.OBJ.markHeight) this.markHeight();
		if (this.OBJ.markBalanceFactor) this.markBalanceFactor();

		const links = this.generateLinks();
		this.generateLinkLabels(links);
		this.generateArrowToLink(links);
		const node = this.generateNodes();
		this.addCirclesForNodes(node);
		this.generateSubtreeSymbol(node);
		const labels = this.generateNodeText();
		this.generatePointers(node);
		this.generateAnnotations(labels);
	}

	calculateBalanceFactor(d) {
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
	}

	addArrowDefinitions() {
		this.SVG.append("svg:defs")
			.selectAll("marker")
			.data(["end"])
			.enter()
			.append("svg:marker")
			.attr("id", "arrow_end")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 25)
			.attr("refY", 0)
			.attr("markerWidth", 5)
			.attr("markerHeight", 5)
			.attr("orient", "auto")
			.attr("fill", this.colors.strokeColor)
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");
	}

	nodesByLevel(nodeList) {
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

	markLevels() {
		const levelNums = this.SVG.append("g")
			.selectAll("text")
			.data(this.nodesByLevel(this.root.descendants()))
			.enter();
		levelNums
			.append("text")
			.attr("x", 0)
			.attr("y", (d) => d.y + 3)
			.attr("text-anchor", "middle")
			.attr("fill", this.colors.levelTextColor)
			.style("font-family", "Fira")
			.style("font-size", this.ATTRIBUTES.annotationFontSize)
			.text((d) => d.depth + 1);
		levelNums
			.append("line")
			.attr("class", "level-line")
			.attr("x1", (d) => -this.svg().width + this.svg().width + 10)
			.attr("y1", (d) => d.y)
			.attr("x2", (d) => this.svg().width)
			.attr("y2", (d) => d.y)
			.attr("stroke", this.colors.levelTextColor);
	}

	markDepth() {
		const DepthNums = this.SVG.append("g");
		DepthNums.selectAll("text")
			.data(this.root.descendants())
			.enter()
			.filter((d) => !d.data.display)
			.append("text")
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("dx", -this.ATTRIBUTES.radius - this.ATTRIBUTES.radius / 2)
			.text((d) => d.depth)
			.attr("text-anchor", "middle")
			.attr("fill", this.colors.depthMarkColor)
			.style("font-family", "Fira")
			.style("font-size", this.ATTRIBUTES.annotationFontSize);
	}

	markHeight() {
		const heightNums = this.SVG.append("g");
		heightNums
			.selectAll("text")
			.data(this.root.descendants())
			.enter()
			.filter((d) => !d.data.display)
			.append("text")
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("dx", this.ATTRIBUTES.radius + this.ATTRIBUTES.radius / 2)
			.text((d) => d.height + 1)
			.attr("text-anchor", "middle")
			.attr("fill", this.colors.heightMarkColor)
			.style("font-family", "Fira")
			.style("font-size", this.ATTRIBUTES.annotationFontSize);
	}

	markBalanceFactor() {
		const bfNums = this.SVG.append("g");
		bfNums
			.selectAll("text")
			.data(this.root.descendants())
			.enter()
			.filter((d) => !d.data.display)
			.filter((d) => !d.data.type)
			.append("text")
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("dy", -this.ATTRIBUTES.radius - this.ATTRIBUTES.radius / 2)
			.text((d) => this.calculateBalanceFactor(d))
			.attr("text-anchor", "middle")
			.attr("fill", (d) => {
				if (Math.abs(this.calculateBalanceFactor(d)) > 1) {
					return `firebrick`;
				} else {
					return `forestgreen`;
				}
			})
			.style("font-family", "Fira")
			.style("font-size", this.ATTRIBUTES.annotationFontSize);
	}

	generateLinks() {
		const links = this.SVG.append("g");
		links
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
			.attr("marker-end", "url(#arrow_end)")
			.attr("stroke-width", (d) => {
				if (d.target.data.path) {
					return 3;
				} else {
					return this.ATTRIBUTES.edgeStroke;
				}
			});
		return links;
	}

	generateLinkLabels(links) {
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
			.style("font-size", this.ATTRIBUTES.edgeLabelFontSize);
	}

	generateArrowToLink(links) {
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
	}

	generateNodes() {
		const nodes = this.SVG.selectAll("circle")
			.data(this.root.descendants())
			.enter()
			.append("g");
		return nodes;
	}

	addCirclesForNodes(nodes) {
		const circles = nodes
			.filter((d) => !d.data.display)
			.filter((d) => !d.data.noCircle)
			.filter((d) => !d.data.type)
			.append("circle")
			.attr("class", "treeNode")
			.attr("cx", (d) => d.x)
			.attr("cy", (d) => d.y)
			.attr("r", this.ATTRIBUTES.radius)
			.style("fill", (d) => {
				if (this.OBJ?.displayNodes) {
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
				if (this.OBJ?.displayNodes) {
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
			.attr("stroke-width", this.ATTRIBUTES.strokeWidth);
	}

	generateSubtreeSymbol(node) {
		const triangles = node
			.filter((d) => d.data.type)
			.append("path")
			.attr("transform", (d, i) => {
				return `translate(${d.x}, ${d.y + this.ATTRIBUTES.radius})`;
			})
			.attr("stroke-width", 1)
			.attr(
				"d",
				d3
					.symbol()
					.type(d3.symbolTriangle)
					.size(this.ATTRIBUTES.radius * 18),
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
	}

	generateNodeText() {
		// Append labels group
		const labels = this.SVG.append("g");

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
					return d.y + this.ATTRIBUTES.radius;
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
			.style("font-size", this.ATTRIBUTES.fontSize);
		return labels;
	}

	generatePointers(node) {
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
	}

	generateAnnotations(labels) {
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
			.style("font-size", this.ATTRIBUTES.annotationFontSize);
	}
}
