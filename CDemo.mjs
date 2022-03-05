class CDemo {
	renderStaticArray(obj) {
		const arrayContainer = document.querySelector(`#${obj.id}`);
		const array = document.createElement("ol");
		array.style.listStyle = "none";
		array.style.display = "flex";
		array.style.justifyContent = "center";
		arrayContainer.appendChild(array);
		for (let i = 0; i < obj.data.length; i++) {
			const arrayElement = document.createElement("ul");
			arrayElement.style.padding = "0";
			arrayElement.style.margin = "0";
			const arrayElementDataField = document.createElement("li");
			arrayElementDataField.style.listStyleType = "none";
			arrayElementDataField.style.border = "solid thin lightgrey";
			arrayElementDataField.style.margin = "0 1px";
			arrayElementDataField.style.padding = "5px 3px";
			arrayElementDataField.style.width = "22px";
			arrayElementDataField.style.height = "22px";
			arrayElementDataField.style.lineHeight = "1em";
			arrayElementDataField.style.textAlign = "center";
			arrayElementDataField.style.fontFamily = "Fira";
			arrayElementDataField.style.fontSize = "0.75rem";
			arrayElementDataField.style.boxShadow =
				"0 2px 1px 0px rgba(43, 43, 43, 0.2), 0 2px 1px 0 rgba(0,0,0,0.2)";
			arrayElementDataField.innerText = obj.data[i].val;
			if (obj.data[i].focus == "red") {
				arrayElementDataField.style.backgroundColor = "tomato";
				arrayElementDataField.style.color = "white";
				arrayElementDataField.style.borderColor = "var(--darkRed)";
				arrayElementDataField.style.boxShadow =
					"0 2px 0px 0px rgba(163, 0, 0, 0.726), 0 2px 1px 0 rgba(145, 0, 0, 0.459)";
			} else if (obj.data[i].focus == "green") {
				arrayElementDataField.style.backgroundColor = "var(--darkGreen)";
				arrayElementDataField.style.color = "white";
				arrayElementDataField.style.borderColor = "var(--darkGreen)";
				arrayElementDataField.style.boxShadow =
					"0 2px 0px 0px rgba(19, 97, 0, 0.911), 0 2px 1px 0 rgba(0, 61, 5, 0.733)";
			} else if (obj.data[i].focus == "blue") {
				arrayElementDataField.style.backgroundColor = "var(--darkBlue)";
				arrayElementDataField.style.color = "white";
				arrayElementDataField.style.borderColor = "var(--darkBlue)";
				arrayElementDataField.style.boxShadow =
					" 0 2px 0px 0px rgba(0, 78, 97, 0.911), 0 2px 1px 0 rgba(0, 44, 61, 0.733)";
			}
			arrayElement.appendChild(arrayElementDataField);
			if (obj.indexed) {
				const arrayElementIndexField = document.createElement("li");
				arrayElementIndexField.style.listStyle = "none";
				arrayElementIndexField.style.fontFamily = "CMU";
				arrayElementIndexField.style.fontSize = "0.7rem";
				arrayElementIndexField.innerText = i;
				arrayElement.appendChild(arrayElementIndexField);
			}
			if (obj.data[i].annotate) {
				const annotation = document.createElement("li");
				annotation.style.listStyle = "none";
				annotation.style.fontFamily = "Fira";
				annotation.style.fontSize = "0.7rem";
				annotation.innerText = obj.data[i].annotate;
				arrayElement.appendChild(annotation);
			}
			array.appendChild(arrayElement);
		}
	}

	renderQueue(obj) {
		const body = d3.select("body");
		const numberOfFrames = obj.data.length;
		const queueContainer = body.selectAll(`div#${obj.id}`);
		queueContainer.classed("demo-container", true);
		// SVG dimensions
		const margin = {
			top: 15,
			right: 5,
			bottom: 10,
			left: 5,
		};
		const dimensions = {
			width: 160 - margin.left - margin.right,
			height: 100 - margin.top - margin.bottom,
		};
		// x-axis scale
		const xScale = d3
			.scaleBand()
			.domain(d3.range(numberOfFrames))
			.rangeRound([0, dimensions.width])
			.paddingInner(0.01);
		// create SVG element
		const svg = queueContainer
			.append("div")
			.style("width", obj.divWidth ? `${obj.divWidth}%` : "40%")
			.style(
				"padding-bottom",
				obj.paddingBottom ? `${obj.paddingBottom}%` : "20%"
			)
			.classed("svg-container", true)
			.classed("queue", true)
			.classed("singleFrame", numberOfFrames == 1)
			.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${dimensions.width + margin.left + margin.right} ${
					dimensions.height + margin.top + margin.bottom
				}`
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);
		// g element <==> a single frame
		const queueFrameGroup = svg
			.selectAll("g")
			.data(obj.data)
			.enter()
			.append("g")
			.classed("frame", true)
			.classed("emphasis", (d) => d.emphasis != null)
			.attr("transform", (d, i) => {
				return `translate(${xScale(i)}, 0)`;
			})
			.attr("y", 0);
		// Frame rectangle
		const frameRect = queueFrameGroup
			.append("rect")
			.attr("width", xScale.bandwidth() / 1.5)
			.attr("height", 40)
			.attr("rx", 3)
			.attr("ry", 3);
		// Data Field
		const dataField = queueFrameGroup
			.append("text")
			.attr("text-anchor", "middle")
			.style("font-family", "Fira")
			.attr("x", (d, i) => xScale.bandwidth() / 3)
			.attr("y", 15)
			.text((d) => d.val);
		// Annotations
		const annotation = queueFrameGroup
			.filter((d) => d.annotate)
			.append("text")
			.classed("annotation", true)
			.attr("text-anchor", "middle")
			.style("font-family", "Fira")
			.attr("x", (d, i) => xScale.bandwidth() / 4)
			.attr("y", -4)
			.text((d) => d.annotate);
		// Index
		if (obj.indexed) {
			queueFrameGroup
				.append("text")
				.classed("index", true)
				.attr("text-anchor", "middle")
				.style("font-family", "CMU")
				.attr("x", (d, i) => xScale.bandwidth() / 3)
				.attr("y", 55)
				.text((d, i) => i);
		}
	}

	renderTree(demoObj) {
		const main = d3.select("body");
		const userInputWidth = demoObj.width ? demoObj.width : 400;
		const userInputHeight = demoObj.height ? demoObj.height : 200;
		const demoContainer = main.selectAll(`#${demoObj.id}`);
		demoContainer.classed("demo-container", true);
		const numberOfNodes = demoObj.treeData.length;
		const colors = {
			strokeColor: "var(--textColor)",
			nodeStrokeColor: "var(--textColor)",
			nodeColor: "#F9F3DF",
			leafColor: "#D5EEBB",
			textColor: "var(--textColor)",
			edgeLabelColor: "tomato",
			levelTextColor: "teal",
			heightMarkColor: "#B4CFB0",
			depthMarkColor: "#CDB699",
		};
		const margin = {
			top: 35,
			right: 20,
			bottom: 20,
			left: 20,
		};
		const dimensions = {
			width: userInputWidth - margin.left - margin.right,
			height: userInputHeight - margin.top - margin.bottom,
			edgeStroke: 1,
			strokeWidth: 1,
			radius: "0.65rem",
			fontSize: "0.85rem",
			annotationFontSize: "0.7rem",
			edgeLabelFontSize: "0.65rem",
			levelFontSize: "0.85rem",
		};
		// SVG rendering
		const svg = demoContainer
			.append("div")
			.style("display", "inline-block")
			.style("position", "relative")
			.style("width", demoObj.divWidth ? demoObj.divWidth : "80%")
			.style(
				"padding-bottom",
				demoObj.paddingBottom ? demoObj.paddingBottom : "40%"
			)
			.style("overflow", "hidden")
			.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${dimensions.width + margin.left + margin.right} ${
					dimensions.height + margin.top + margin.bottom
				}`
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		// Append SVG definition markers
		const svgDefs = svg.append("svg:defs");
		svgDefs
			.selectAll("marker")
			.data(["end"])
			.enter()
			.append("svg:marker")
			.attr("id", String)
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 26)
			.attr("refY", 0)
			.attr("markerWidth", 6)
			.attr("markerHeight", 8)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");

		function treeSize() {
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
			childCount(0, root);
			const newHeight = d3.max(levelWidth) * 30; // 30 pixels per line
			return newHeight;
		}
		// Data structuring
		const root = d3
			.stratify()
			.id((d) => d.child)
			.parentId((d) => d.parent)(demoObj.treeData);
		const treeStructure = d3
			.tree()
			.size([dimensions.width, treeSize()])
			.separation((a, b) => (a.parent == b.parent ? 1 : 1.2));
		treeStructure(root);
		// For left- or right-skewed trees, perform the following
		(function () {
			root.descendants().forEach((d) => (d.y = d.depth * 50));
			if (demoObj.skew == "right") {
				root.descendants().forEach((d) => (d.x = d.x + d.depth * 30));
			} else if (demoObj.skew == "left") {
				root.descendants().forEach((d) => (d.x = d.x - d.depth * 30));
			}
		})();
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

		function levelMark() {
			if (demoObj.leveled) {
				const levelNums = svg
					.append("g")
					.selectAll("text")
					.data(nodesByLevel(root.descendants()))
					.enter()
					.append("text")
					.attr("x", 0)
					.attr("y", (d) => d.y + 3)
					.text((d) => d.depth + 1)
					.attr("text-anchor", "middle")
					.attr("fill", colors.levelTextColor)
					.style("font-family", "Fira")
					.style("font-size", dimensions.levelFontSize);
			}
		}
		levelMark();

		function depthMark() {
			if (demoObj.depth) {
				const depthNums = svg.append("g");
				depthNums
					.selectAll("text")
					.data(nodesByLevel(root.descendants()))
					.enter()
					.append("text")
					.attr("x", 0)
					.attr("y", (d) => d.y + 3)
					.text((d) => d.depth)
					.attr("text-anchor", "middle")
					.attr("fill", colors.depthMarkColor)
					.style("font-family", "CMU")
					.style("font-size", dimensions.levelFontSize);
				depthNums
					.selectAll("line")
					.data(nodesByLevel(root.descendants()))
					.enter()
					.append("line")
					.attr("x1", (d) => -dimensions.width + dimensions.width + 10)
					.attr("y1", (d) => d.y)
					.attr("x2", (d) => dimensions.width)
					.attr("y2", (d) => d.y)
					.attr("stroke", colors.depthMarkColor);
			}
		}
		depthMark();

		if (demoObj.heightMarked) {
			const length = nodesByLevel(root.descendants()).length - 1;
			const heightNums = svg.append("g");
			heightNums
				.selectAll("text")
				.data(nodesByLevel(root.descendants()))
				.enter()
				.append("text")
				.attr("x", dimensions.width)
				.attr("y", (d) => d.y + 3)
				.text((d) => length - d.depth)
				.attr("text-anchor", "middle")
				.attr("fill", colors.heightMarkColor)
				.style("font-family", "Fira")
				.style("font-size", dimensions.levelFontSize);
			heightNums
				.selectAll("line")
				.data(nodesByLevel(root.descendants()))
				.enter()
				.append("line")
				.attr("x1", (d) => -dimensions.width + dimensions.width)
				.attr("y1", (d) => d.y)
				.attr("x2", (d) => dimensions.width - 10)
				.attr("y2", (d) => d.y)
				.attr("stroke", colors.heightMarkColor);
		}
		// Add links
		const links = svg.append("g");
		const physicalLink = links
			.selectAll("line")
			.data(root.links())
			.enter()
			.append("line")
			.attr("display", (d) =>
				d.source.data.display || d.target.data.display ? "none" : "initial"
			)
			.attr("x1", (d) => d.source.x)
			.attr("y1", (d) => d.source.y)
			.attr("x2", (d) => d.target.x)
			.attr("y2", (d) => d.target.y)
			.attr("stroke", (d) => {
				if (d.target.data.path) {
					return colors.edgeLabelColor;
				} else {
					return colors.strokeColor;
				}
			})
			.attr("stroke-opacity", (d) =>
				d.target.data.opacity ? d.target.data.opacity : 1
			)
			.attr("marker-end", () => {
				if (demoObj.directed) {
					return "url(#end)";
				}
			})
			.attr("stroke-width", (d) => {
				if (d.target.data.path) {
					return 3;
				} else {
					return dimensions.edgeStroke;
				}
			});

		// Edge label
		// edge labels included only if an edge has edgeLabel: property set
		const linkLabel = links
			.selectAll("text")
			.data(root.links())
			.enter()
			.filter((d) => d.target.data.edgeLabel)
			.append("text")
			.text((d) => {
				return d.target.data.edgeLabel;
			})
			.attr("x", (d) => (d.source.x + d.target.x) / 2)
			.attr("y", (d) => (d.source.y + d.target.y) / 2)
			.attr("text-anchor", "middle")
			.attr("fill", colors.edgeLabelColor)
			.style("font-family", "Fira")
			.style("font-size", dimensions.edgeLabelFontSize);

		// Append circles to group element
		const circles = svg
			.append("g")
			.selectAll("circle")
			.data(root.descendants())
			.enter()
			.filter((d) => !d.data.display)
			.append("circle")
			.attr("class", "treeNode")
			.attr("cx", (d) => d.x)
			.attr("cy", (d) => d.y)
			.attr("r", dimensions.radius)
			.attr("fill", (d) => {
				if (d.data.focus) {
					return `${d.data.focus}`;
				} else {
					return d.height == 0 ? colors.leafColor : colors.nodeColor;
				}
			})
			.attr("opacity", (d) => (d.data.opacity ? d.data.opacity : 1))
			.attr("stroke", colors.nodeStrokeColor)
			.attr("stroke-width", dimensions.strokeWidth);

		// Append labels
		const labels = svg.append("g");
		// Data labels
		const dataField = labels
			.selectAll("text")
			.data(root)
			.enter()
			.filter((d) => !d.data.display)
			.append("text")
			.text((d) => d.id)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y + 5)
			.attr("opacity", (d) => (d.data.opacity ? d.data.opacity : 1))
			.attr("text-anchor", "middle")
			.attr("fill", colors.textColor)
			.style("font-family", "Fira")
			.style("font-size", dimensions.fontSize);
		const annotate = labels
			.selectAll("text.annotate")
			.data(root)
			.enter()
			.filter((d) => d.data.annotate)
			.append("text")
			.text((d) => d.data.annotate)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y - 20)
			.attr("text-anchor", "middle")
			.attr("fill", colors.textColor)
			.style("font-family", "Fira")
			.style("font-size", dimensions.annotationFontSize);
	}

	renderLinkedList(obj) {
		const body = d3.select("body");
		const numberOfNodes = obj.nodes.length;
		const userWidth = obj.width ? obj.width : 150;
		const linkedList = body.selectAll(`div#${obj.id}`);
		linkedList.classed("demo-container", true);
		const margin = {
			top: 15,
			right: 20,
			bottom: 30,
			left: 20,
		};
		const dimensions = {
			width: userWidth - margin.left - margin.right,
			height: 80 - margin.top - margin.bottom,
		};

		// X Scale
		const xScale = d3
			.scaleBand()
			.domain(d3.range(numberOfNodes))
			.rangeRound([0, dimensions.width])
			.paddingInner(0.5);

		const svg = linkedList
			.append("div")
			.classed("svg-container", true)
			.classed("linkedList", true)
			.style(
				"padding-bottom",
				obj.bottomPadding ? obj.bottomPadding : "30%"
			)
			.style("width", obj.divWidth ? obj.divWidth : "60%")
			.classed("singleNode", obj.nodes.length == 1)
			.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${dimensions.width + margin.left + margin.right} ${
					dimensions.height + margin.top + margin.bottom
				}`
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr("transform", `translate(${numberOfNodes * 5}, ${margin.top})`);
		const svgDefs = svg.append("svg:defs");
		svgDefs
			.selectAll("marker")
			.data(["end"])
			.enter()
			.append("svg:marker")
			.attr("id", String)
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", xScale.bandwidth() - 15)
			.attr("refY", 0)
			.attr("markerWidth", 3)
			.attr("markerHeight", 4)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");
		const nodeGroup = svg
			.selectAll("g")
			.data(obj.nodes)
			.enter()
			.append("g")
			.attr("transform", (d, i) => {
				return `translate(${xScale(i)}, 0)`;
			})
			.attr("y", 0);

		const deletedNode = nodeGroup
			.filter((d) => d.deleted)
			.classed("deleted-node", true);

		// Data Field
		const dataField = nodeGroup.append("g").classed("data-field", true);

		// Deleted Node

		const dataFieldRectangle = dataField
			.append("rect")
			.attr("width", xScale.bandwidth())
			.attr("height", 10);
		const dataFieldLabel = dataField
			.append("text")
			.attr("text-anchor", "middle")
			.style("font-size", "7px")
			.style("font-family", "Fira")
			.attr("x", xScale.bandwidth() / 2)
			.attr("y", 7)
			.text((d) => d.data);

		// Indexing
		if (obj.indexed) {
			const index = dataField
				.append("text")
				.attr("text-anchor", "middle")
				.style("font-size", "8px")
				.style("font-family", "CMU")
				.attr("x", xScale.bandwidth() / 1.5)
				.attr("y", 20)
				.text((d, i) => i);
		}

		// Next Field
		const nextField = nodeGroup
			.append("g")
			.classed("next-field", true)
			.attr("transform", `translate(${xScale.bandwidth()}, 0)`);
		const nextFieldRectangle = nextField
			.append("rect")
			.attr("width", xScale.bandwidth() / 2)
			.attr("height", 10);

		// arrow
		const link = nodeGroup
			.filter((d) => !d.alone)
			.append("line")
			.classed("link", true)
			.attr("x1", xScale.bandwidth() + xScale.bandwidth() / numberOfNodes)
			.attr("y1", 5)
			.attr(
				"x2",
				xScale.bandwidth() + (xScale.bandwidth() - numberOfNodes)
			)
			.attr("y2", 5)
			.attr("marker-end", "url(#end)");

		const annotation = nextField
			.filter((d) => d.annotate)
			.append("text")
			.attr("text-anchor", "middle")
			.style("font-size", "9px")
			.style("font-family", "Fira")
			.attr("x", -xScale.bandwidth() / 4)
			.attr("y", -4)
			.text((d, i) => d.annotate)
			.style("fill", "var(--darkRed)");
	}

	renderHash(obj) {
		this.renderLinkedList(obj);
	}

	renderCircularQueue(obj) {
		const sections = [];
		for (let i = 0; i < obj.data.length; i++) {
			sections.push(1);
		}
		const main = d3.select("body");

		const userInputWidth = obj.width ? obj.width : 300;
		const userInputHeight = obj.height ? obj.height : 150;
		const demoContainer = main.selectAll(`#${obj.id}`);
		demoContainer.classed("demo-container", true);
		const numberOfNodes = obj.data.length;
		const colors = {
			strokeColor: "#F7ECDE",
			elementColor: (i) => {
				if (obj.focus && obj.focus[i] == "y") {
					return "#DE8971";
				} else if (obj.focus && obj.focus[i]) {
					return obj.focus[i];
				} else {
					return "#FBF8F1";
				}
			},
			textColor: (i) => {
				if (obj.focus && obj.focus[i] == "y") {
					return "#F8EDE3";
				} else if (obj.focus && obj.focus[i]) {
					return obj.focus[i];
				} else {
					return "#C7B198";
				}
			},
			indexColor: "#EEC373",
		};
		const margin = {
			top: 65,
			right: 105,
			bottom: 110,
			left: 140,
		};
		const dimensions = {
			width: userInputWidth - margin.left - margin.right,
			height: userInputHeight - margin.top - margin.bottom,
			edgeStroke: 1,
			strokeWidth: 1,
			radius: "0.65rem",
			fontSize: "0.85rem",
			edgeLabelFontSize: "0.65rem",
			levelFontSize: "0.85rem",
		};
		var outerRadius = dimensions.width / 2;
		var innerRadius = 50;
		// SVG rendering
		const svg = demoContainer
			.append("div")
			.style("display", "inline-block")
			.style("position", "relative")
			.style("width", obj.divWidth ? `${obj.divWidth}%` : "80%")
			.style(
				"padding-bottom",
				obj.paddingBottom ? `${obj.paddingBottom}%` : "40%"
			)
			.style("overflow", "hidden")
			.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${dimensions.width + margin.left + margin.right} ${
					dimensions.height + margin.top + margin.bottom
				}`
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		const dataScale = d3
			.scaleLinear()
			.domain([0, d3.max(obj.data, (d) => d[0])])
			.range([0, dimensions.width]);

		svg
			.select(`#${obj.id}`)
			.append("svg")
			.attr("width", dimensions.width)
			.attr("height", dimensions.width)
			.append("g")
			.attr(
				"transform",
				"translate(" +
					dimensions.width / 2 +
					"," +
					dimensions.height / 2 +
					")"
			);

		var pie = d3.pie();
		var data_ready = pie(sections);
		var pieData = pie(obj.data);
		const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
		const indexArc = d3
			.arc()
			.innerRadius(innerRadius * 1.5)
			.outerRadius(outerRadius * 1.8);
		const annotationArc = d3
			.arc()
			.innerRadius(innerRadius * 1.6)
			.outerRadius(outerRadius * 2.6);
		svg
			.selectAll("path")
			.data(data_ready)
			.enter()
			.append("path")
			.attr("d", arc)
			.attr("fill", (d, i) => colors.elementColor(i))
			.attr("stroke", colors.strokeColor)
			.style("stroke-width", "2px");

		const label = svg
			.selectAll("text")
			.data(data_ready)
			.enter()
			.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.style("font-family", "Fira")
			.style("font-size", "0.6rem")
			.attr("transform", (d) => `translate(${arc.centroid(d)})`)
			.data(pieData)
			.text((d) => d.data)
			.attr("fill", (d, i) => colors.textColor(i));

		if (obj.indexed) {
			const indexLabel = svg
				.selectAll("foo")
				.data(data_ready)
				.enter()
				.append("text")
				.attr("dy", "0.3em")
				.style("text-anchor", "middle")
				.style("font-family", "Fira")
				.style("font-size", "0.6rem")
				.attr("fill", colors.indexColor)
				.attr("transform", (d) => `translate(${indexArc.centroid(d)})`)
				.data(pieData)
				.text((d, i) => i);
		}
		if (obj.pointer) {
			const annotation = svg
				.selectAll("foo")
				.data(data_ready)
				.enter()
				.append("text")
				.attr("dy", "0.3em")
				.style("text-anchor", "middle")
				.style("font-family", "Fira")
				.style("font-size", "0.75rem")
				.attr("fill", "cornflowerblue")
				.attr(
					"transform",
					(d) => `translate(${annotationArc.centroid(d)})`
				)
				.data(pieData)
				.text((d, i) => {
					if (obj.pointer[i] != undefined) {
						return `${obj.pointer[i]}`;
					} else {
						return ``;
					}
				});
		}
	}

	renderDeque(obj) {
		const body = d3.select("body");
		const numberOfFrames = obj.data.length;
		const queueContainer = body.selectAll(`div#${obj.id}`);
		queueContainer.classed("demo-container", true);
		// Colors
		const colors = {
			queuerColor: "#FFF3D9",
			strokeColor: "#F7BEC0",
			textColor: "#900020",
			filter: "drop-shadow( -1px 2px 0 #F7BEC0)",
			pointerColor: "#D43790",
			indexColor: "#F8AFA6",
		};
		// SVG dimensions
		const margin = {
			top: 15,
			right: 5,
			bottom: 10,
			left: 5,
		};
		const dimensions = {
			width: 160 - margin.left - margin.right,
			height: 80 - margin.top - margin.bottom,
		};
		// x-axis scale
		const xScale = d3
			.scaleBand()
			.domain(d3.range(numberOfFrames))
			.rangeRound([0, dimensions.width])
			.paddingInner(0.01);
		// create SVG element
		const svg = queueContainer
			.append("div")
			.style("width", obj.divWidth ? `${obj.divWidth}%` : "40%")
			.style(
				"padding-bottom",
				obj.paddingBottom ? `${obj.paddingBottom}%` : "16%"
			)
			.classed("svg-container", true)
			.classed("queue", true)
			.classed("singleFrame", numberOfFrames == 1)
			.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${dimensions.width + margin.left + margin.right} ${
					dimensions.height + margin.top + margin.bottom
				}`
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);
		// g element <==> a single frame
		const queueFrameGroup = svg
			.selectAll("g")
			.data(obj.data)
			.enter()
			.append("g")
			.classed("emphasis", (d) => d.emphasis != null)
			.style("font-size", "0.7rem")
			.attr("transform", (d, i) => {
				return `translate(${xScale(i)}, 0)`;
			})
			.attr("y", 0);
		// Frame rectangle
		const frameRect = queueFrameGroup
			.append("rect")
			.attr("height", xScale.bandwidth() / 2)
			.attr("width", xScale.bandwidth() - 5)
			.attr("fill", colors.queuerColor)
			.attr("stroke", colors.strokeColor)
			.attr("stroke-width", "1")
			.style("filter", colors.filter)
			.attr("rx", 3)
			.attr("ry", 3);
		// Data Field
		const dataField = queueFrameGroup
			.append("text")
			.attr("text-anchor", "middle")
			.style("font-family", "Fira")
			.attr("fill", colors.textColor)
			.attr("x", (d, i) => xScale.bandwidth() / 2.4)
			.attr("y", xScale.bandwidth() / 2.8)
			.text((d) => d.val);
		// Annotations
		const annotation = queueFrameGroup
			.filter((d) => d.annotate)
			.append("text")
			.classed("annotation", true)
			.attr("text-anchor", "middle")
			.style("font-family", "Fira")
			.attr("fill", colors.pointerColor)
			.attr("x", (d, i) => xScale.bandwidth() / 2.5)
			.attr("y", xScale.bandwidth() - (xScale.bandwidth() + 2))
			.text((d) => d.annotate);
		// Index
		if (obj.indexed) {
			queueFrameGroup
				.append("text")
				.classed("index", true)
				.attr("text-anchor", "middle")
				.style("font-family", "CMU")
				.attr("fill", colors.indexColor)
				.attr("x", (d, i) => xScale.bandwidth() / 2.5)
				.attr("y", xScale.bandwidth() - 3)
				.text((d, i) => i);
		}
	}

	renderPriorityQueue(obj) {
		const body = d3.select("body");
		const numberOfFrames = obj.data.length;
		const userInputWidth = obj.width ? obj.width : 160;
		const userInputHeight = obj.height ? obj.height : 90;
		const queueContainer = body.selectAll(`div#${obj.id}`);
		queueContainer.classed("demo-container", true);
		// Colors
		const colors = {
			queuerColor: "#E7F2F8",
			priorityFillColor: "#FFF0DF",
			priorityStrokeColor: "#DC9750",
			strokeColor: "#74BDCB",
			textColor: "#74BDCB",
			filter: "drop-shadow( -1px 2px 0 #74BDCB)",
			pointerColor: "#C38370",
			indexColor: "#E4B7A0",
		};
		// SVG dimensions
		const margin = {
			top: 50,
			right: 5,
			bottom: 20,
			left: 5,
		};
		const dimensions = {
			width: userInputWidth - margin.left - margin.right,
			height: userInputHeight - margin.top - margin.bottom,
		};
		// x-axis scale
		const xScale = d3
			.scaleBand()
			.domain(d3.range(numberOfFrames))
			.rangeRound([0, dimensions.width])
			.paddingInner(0.01);
		// create SVG element
		const svg = queueContainer
			.append("div")
			.style("width", obj.divWidth ? `${obj.divWidth}%` : "40%")
			.style(
				"padding-bottom",
				obj.paddingBottom ? `${obj.paddingBottom}%` : "22%"
			)
			.classed("svg-container", true)
			.classed("queue", true)
			.classed("singleFrame", numberOfFrames == 1)
			.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${dimensions.width + margin.left + margin.right} ${
					dimensions.height + margin.top + margin.bottom
				}`
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);
		// g element <==> a single frame
		const queueFrameGroup = svg
			.selectAll("g")
			.data(obj.data)
			.enter()
			.append("g")
			.classed("emphasis", (d) => d.emphasis != null)
			.style("font-size", "0.7rem")
			.attr("transform", (d, i) => {
				return `translate(${xScale(i)}, 0)`;
			})
			.attr("y", 0);

		// Frame rectangle
		const frameRect = queueFrameGroup
			.append("rect")
			.attr("height", xScale.bandwidth() / 2)
			.attr("width", xScale.bandwidth() - 5)
			.attr("fill", colors.queuerColor)
			.attr("stroke", colors.strokeColor)
			.attr("stroke-width", "1")
			.style("filter", colors.filter)
			.attr("rx", 3)
			.attr("ry", 3);

		const priorityCircle = queueFrameGroup
			.append("circle")
			.attr("cx", xScale.bandwidth() / 2.4)
			.attr("cy", -xScale.bandwidth() + 15)
			.attr("r", xScale.bandwidth() / 3)
			.attr("fill", colors.priorityFillColor)
			.attr("stroke", colors.priorityStrokeColor)
			.attr("stroke-width", "1")
			.attr("rx", 3)
			.attr("ry", 3);

		const priorityLink = queueFrameGroup
			.append("line")
			.attr("x1", xScale.bandwidth() / 2.4)
			.attr("y1", -xScale.bandwidth() / 3.6)
			.attr("x2", xScale.bandwidth() / 2.4)
			.attr("y2", 0)
			.attr("fill", colors.priorityFillColor)
			.attr("stroke", colors.priorityStrokeColor)
			.attr("stroke-width", "1")
			.attr("rx", 3)
			.attr("ry", 3);

		// Data Field
		const dataField = queueFrameGroup
			.append("text")
			.attr("text-anchor", "middle")
			.style("font-family", "Fira")
			.attr("fill", colors.textColor)
			.attr("x", (d, i) => xScale.bandwidth() / 2.4)
			.attr("y", xScale.bandwidth() / 2.8)
			.text((d) => d.val[0]);
		// Priority
		const priorityField = queueFrameGroup
			.append("text")
			.attr("text-anchor", "middle")
			.style("font-family", "Fira")
			.attr("fill", colors.priorityStrokeColor)
			.attr("x", (d, i) => xScale.bandwidth() / 2.4)
			.attr("y", -xScale.bandwidth() + 19)
			.text((d) => d.val[1]);
		// Annotations
		const annotation = queueFrameGroup
			.filter((d) => d.annotate)
			.append("text")
			.classed("annotation", true)
			.attr("text-anchor", "middle")
			.style("font-family", "Fira")
			.style("font-size", "0.8rem")
			.attr("fill", colors.pointerColor)
			.attr("x", (d, i) => xScale.bandwidth() / 2.3)
			.attr("y", xScale.bandwidth() - xScale.bandwidth() * 2)
			.text((d) => d.annotate);
		// Index
		if (obj.indexed) {
			queueFrameGroup
				.append("text")
				.classed("index", true)
				.attr("text-anchor", "middle")
				.style("font-family", "CMU")
				.style("font-size", "0.85rem")
				.attr("fill", colors.indexColor)
				.attr("x", (d, i) => xScale.bandwidth() / 2.5)
				.attr("y", xScale.bandwidth() - 3)
				.text((d, i) => i);
		}
	}

	renderCallTrace(demoObj) {
		const main = d3.select("body");
		const userInputWidth = demoObj.width ? demoObj.width : 500;
		const userInputHeight = demoObj.height ? demoObj.height : 400;
		const demoContainer = main.selectAll(`#${demoObj.id}`);
		demoContainer.classed("demo-container", true);
		const numberOfNodes = demoObj.treeData.length;
		const colors = {
			strokeColor: "var(--textColor)",
			nodeStrokeColor: "var(--textColor)",
			leafColor: "tomato",
			nodeColor: "#D5EEBB",
			textColor: "var(--textColor)",
			leafText: "firebrick",
			branchText: "green",
			edgeLabelColor: "tomato",
			levelTextColor: "teal",
			heightMarkColor: "#B4CFB0",
			depthMarkColor: "#CDB699",
		};
		const margin = {
			top: 0,
			right: 100,
			bottom: 0,
			left: 90,
		};
		const dimensions = {
			width: userInputWidth - margin.left - margin.right,
			height: userInputHeight - margin.top - margin.bottom,
			edgeStroke: 1,
			strokeWidth: 1,
			radius: "0.65rem",
			fontSize: "0.6rem",
			annotationFontSize: "0.7rem",
			edgeLabelFontSize: "0.65rem",
			levelFontSize: "0.85rem",
		};
		// SVG rendering
		const svg = demoContainer
			.append("div")
			.style("display", "inline-block")
			.style("position", "relative")
			.style("width", demoObj.divWidth ? demoObj.divWidth : "80%")
			.style(
				"padding-bottom",
				demoObj.paddingBottom ? demoObj.paddingBottom : "40%"
			)
			.style("overflow", "hidden")
			.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${dimensions.width + margin.left + margin.right} ${
					dimensions.height + margin.top + margin.bottom
				}`
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		// Append SVG definition markers
		const svgDefs = svg.append("svg:defs");
		svgDefs
			.selectAll("marker")
			.data(["end"])
			.enter()
			.append("svg:marker")
			.attr("id", String)
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 26)
			.attr("refY", 0)
			.attr("markerWidth", 6)
			.attr("markerHeight", 8)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");

		// Data structuring
		const root = d3
			.stratify()
			.id((d) => d.child)
			.parentId((d) => d.parent)(demoObj.treeData);
		const treeStructure = d3
			.tree()
			.size([dimensions.height, dimensions.width])
			.separation((a, b) => (a.parent == b.parent ? 1 : 2));
		treeStructure(root);
		const nodes = root.descendants();
		const links = root.links();

		const g = svg.append("g");
		const link = g
			.selectAll(".link")
			.data(links)
			.enter()
			.append("line")
			.attr("class", "link")
			.attr("x1", (d) => d.source.y)
			.attr("y1", (d) => d.source.x)
			.attr("x2", (d) => d.target.y)
			.attr("y2", (d) => d.target.x)
			.attr("stroke", colors.strokeColor)
			.attr("opacity", "0.3");
		// adds each node as a group
		var node = g
			.selectAll(".node")
			.data(nodes)
			.enter()
			.append("g")
			.attr("class", function (d) {
				return "node" + (d.children ? " node--internal" : " node--leaf");
			})
			.attr("transform", function (d) {
				return "translate(" + d.y + "," + d.x + ")";
			});

		// adds the circle to the node
		node
			.append("circle")
			.attr("r", 3)
			.attr("fill", (d) => {
				return d.children ? colors.nodeColor : colors.leafColor;
			})
			.attr("stroke", colors.strokeColor);

		// adds the text to the node
		node
			.append("text")
			.attr("dy", ".35em")
			.attr("font-family", "Fira")
			.attr("font-size", "0.6rem")
			.attr("fill", (d) => {
				return d.children || d.data.call
					? colors.branchText
					: colors.leafText;
			})
			.attr("x", function (d) {
				return d.children ? -10 : 10;
			})
			.style("text-anchor", function (d) {
				return d.children ? "end" : "start";
			})
			.text(function (d) {
				return d.id;
			});
	}

	renderStackGrowth(obj) {
		const main = d3.select("body");
		const userInputWidth = obj.width ? obj.width : 250;
		const userInputHeight = obj.height ? obj.height : 240;
		const demoContainer = main.selectAll(`#${obj.id}`);
		demoContainer.classed("demo-container", true);
		const numberOfCalls = obj.data.length;
		const colors = {
			strokeColor: "firebrick",
			frameColor: "tomato",
			textColor: "white",
		};
		const margin = {
			top: 50,
			right: 10,
			bottom: 0,
			left: 10,
		};
		const dimensions = {
			width: userInputWidth - margin.left - margin.right,
			height: userInputHeight - margin.top - margin.bottom,
			edgeStroke: 1,
			strokeWidth: 1,
			radius: "0.65rem",
			fontSize: "0.6rem",
			annotationFontSize: "0.7rem",
			edgeLabelFontSize: "0.65rem",
			levelFontSize: "0.85rem",
			callRectangleHeight: 20,
			callRectangleWidth: 40,
		};
		// X Scale
		const xScale = d3
			.scaleBand()
			.domain(d3.range(numberOfCalls))
			.range([0, dimensions.width])
			.paddingInner(0.05);
		// Y Scale
		const yScale = d3
			.scaleLinear()
			.domain([0, 10])
			.range([0, dimensions.height]);
		const xAxis = d3.axisBottom().scale(xScale);
		// SVG rendering
		const svg = demoContainer
			.append("div")
			.style("display", "inline-block")
			.style("position", "relative")
			.style("width", obj.divWidth ? `${obj.divWidth}%` : "20%")
			.style(
				"padding-bottom",
				obj.paddingBottom ? `${obj.paddingBottom}%` : "15%"
			)
			.style("overflow", "hidden")
			.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${dimensions.width + margin.left + margin.right} ${
					dimensions.height + margin.top + margin.bottom
				}`
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		const call = svg
			.selectAll(".call")
			.data(obj.data)
			.enter()
			.append("g")
			.attr("transform", (d, i) => `translate(${xScale(i)}, 0)`);
		const frame = call
			.selectAll(".frame")
			.data((d, i) => obj.data[i])
			.enter()
			.append("g");
		const rectFrame = frame
			.append("rect")
			.attr("y", (d, i) => dimensions.callRectangleHeight - yScale(i))
			.attr("width", dimensions.callRectangleWidth)
			.attr("height", dimensions.callRectangleHeight)
			.attr("fill", colors.frameColor)
			.attr("stroke", colors.strokeColor)
			.attr("stroke-width", 2);
		const frameText = call
			.selectAll("text")
			.data((d, i) => obj.data[i])
			.enter()
			.append("text")
			.attr("y", (d, i) => dimensions.callRectangleHeight - yScale(i))
			.attr("dy", "1.1em")
			.attr("x", dimensions.callRectangleWidth / 2)
			.attr("text-anchor", "middle")
			.attr("font-family", "Fira")
			.attr("font-size", "0.65rem")
			.attr("fill", colors.textColor)
			.text((d) => d);
		const Axis_X = svg
			.append("g")
			.call(xAxis)
			.attr(
				"transform",
				`translate(0, ${
					dimensions.callRectangleHeight +
					dimensions.callRectangleWidth / 1.5
				})`
			);
	}

	plot(obj) {
		const main = d3.select("body");
		const userInputWidth = obj.width ? obj.width : 300;
		const userInputHeight = obj.height ? obj.height : 250;
		const userInputPrecision = obj.precision ? obj.precision : 100;
		const demoContainer = main.selectAll(`#${obj.id}`);
		const data = {
			domain: d3.ticks(obj.domain[0], obj.domain[1], userInputPrecision),
		};
		demoContainer.classed("demo-container", true);
		const colors = {
			strokeColor: "firebrick",
			tickColor: "#AECBD6",
		};

		// Margins
		const margin = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10,
		};

		// Dimensions
		const dimensions = {
			width: userInputWidth - margin.left - margin.right,
			height: userInputHeight - margin.top - margin.bottom,
			fontSize: "0.6rem",
		};

		// Scales
		const scales = {
			xScale: d3.scaleLinear(
				[-5, 5],
				[0, dimensions.width]
			),
			yScale: d3.scaleLinear(
				[obj.range[0], obj.range[1]],
				[dimensions.height, 0]
			),
			xValScale: d3.scaleLinear([0, 100]),
			yValScale: d3.scaleLinear([100, 0]),
		};

		// Points for function
		let dataset = [];
		let xTemp, yTemp;
		for (let i = 0; i <= data.domain.length - 1; i++) {
			xTemp = data.domain[i];
			yTemp = obj.fn(xTemp);
			if (isNaN(yTemp) || !isFinite(yTemp)) {continue}
			else {
				dataset.push([xTemp, yTemp]);
			}
		}

		// line generator
		const line = d3
			.line()
			.x((d) => scales.xScale(d[0]))
			.y((d) => scales.yScale(d[1]));

		const svg = demoContainer
			.append("div")
			.style("display", "inline-block")
			.style("position", "relative")
			.style("width", obj.divWidth ? `${obj.divWidth}%` : "60%")
			.style(
				"padding-bottom",
				obj.paddingBottom ? `${obj.paddingBottom}%` : "50%"
			)
			.style("overflow", "hidden")
			.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${dimensions.width + margin.left + margin.right} ${
					dimensions.height + margin.top + margin.bottom
				}`
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);
		const svgDefinitions = svg
			.append("svg:defs")
			.attr("id", "arrow")
			.append("svg:marker")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 15)
			.attr("refY", -1.5)
			.attr("markerWidth", 6)
			.attr("markerHeight", 6)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M 0 -5 10 10")
			.attr("stroke", "#000")
			.attr("stroke-width", 2);

		// Clip path
		const clipPath = svg
			.append("clipPath")
			.attr("id", "chart-area")
			.append("rect")
			.attr("x", margin.right)
			.attr("y", margin.top)
			.attr("width", dimensions.width)
			.attr("height", dimensions.height);

		// Axes
		const xAxis = d3
			.axisBottom(scales.xScale)
			.tickSizeInner(3)
			.tickSizeOuter(0);
		const yAxis = d3
			.axisLeft(scales.yScale)
			.tickSizeInner(3)
			.tickSizeOuter(0);

		// Append x-axis
		const addXAxis = svg
			.append("g")
			.attr("transform", `translate(0, ${dimensions.height / 2})`)
			.style("font-size", "0.45rem")
			.style("font-family", "CMU")
			.style("color", colors.tickColor)
			.call(xAxis);
		// const xArrow = addXAxis.select("path").attr("marker-end", "url(#arrow)");

		// Append y-axis
		const addYAxis = svg
			.append("g")
			.attr("transform", `translate(${dimensions.width / 2}, 0)`)
			.style("font-family", "CMU")
			.style("font-size", "0.45rem")
			.style("color", colors.tickColor)
			.call(yAxis);
		// const yArrow = addYAxis.select("path").attr("marker-end", "url(#arrow)");

		const xAxisTicks = addXAxis.selectAll(".tick").selectAll("line");
		const yAxisTicks = addYAxis.selectAll(".tick").selectAll("line");

		const lastXTick = addXAxis
			.selectAll(".tick:last-child")
			.selectAll("line");
		const lastXTickText = addYAxis
			.selectAll(".tick:last-child")
			.selectAll("text");
		const lastYTick = addYAxis
			.selectAll(".tick:last-child")
			.selectAll("line");
		const lastYTickText = addXAxis
			.selectAll(".tick:last-child")
			.selectAll("text");
		const firstXTick = addXAxis.select(".tick").selectAll("line");
		const firstXTickText = addXAxis.select(".tick").selectAll("text");
		const firstYTick = addYAxis.select(".tick").selectAll("line");
		const firstYTickText = addYAxis.select(".tick").selectAll("text");

		const ticks = [
			lastXTick,
			lastXTickText,
			lastYTick,
			lastYTickText,
			firstXTick,
			firstXTickText,
			firstYTick,
			firstYTickText,
		];
		for (let i = 0; i < ticks.length; i++) {
			ticks[i].style("display", "none");
		}

		// Offset ticks
		xAxisTicks.attr("y1", -3);
		yAxisTicks.attr("x1", 3);

		const plot = svg
			.append("path")
			.datum(dataset)
			.attr("clip-path", "url(#chart-area)")
			.attr("fill", "none")
			.attr("stroke", colors.strokeColor)
			.attr("stroke-width", 1)
			.attr("d", line);
	}
}

export const cdemo = new CDemo();
