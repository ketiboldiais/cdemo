// The bipartite implementation is a refactoring of Mike Bostock's Sankey implementation.

/* Copyright 2015, Mike Bostock
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the author nor the names of contributors may be used to
  endorse or promote products derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import D3Base from "../../core/d3_base/D3Base.mjs";
import { px } from "../../core/utils/size.mjs";
import { translate } from "../../core/utils/translate.mjs";
import { palette } from "../../core/utils/color.mjs";
import setValue from "../../core/utils/setValue.mjs";

export class Bipartite extends D3Base {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(40, 40, 40, 40);
		this.svg = () => this.setSVGDimensions(400, 430);
		this.SVG_CONTAINER = this.generateSVGContainer(60, 60);
		this.SVG = this.generateSVG();
		this.data = obj.data;
		this.nodeCount = obj.data.nodes.length;
		this.colorPalette = setValue(palette(obj.palette), palette("plain"));

		this.edgeStrokeColor = setValue(
			obj.edgeStrokeColor,
			this.colorPalette.secondaryStrokeColor,
		);
		this.nodeFillColor = setValue(
			obj.nodeFillColor,
			this.colorPalette.secondaryFillColor,
		);
		this.circleStrokeWidth = setValue(obj.circleStrokeWidth, px(1));
		this.nodeStrokeColor = setValue(
			obj.nodeStrokeColor,
			this.colorPalette.primaryStrokeColor,
		);
		this.nodeRadius = setValue(obj.nodeRadius, 5);
		this.nodeTextColor = setValue(
			obj.nodeTextColor,
			this.colorPalette.primaryTextColor,
		);

		this.x0 = 0;
		this.y0 = 0;
		this.x1 = this.svg().width;
		this.y1 = this.svg().height; // extent
		this.dx = 5; // node width
		// node padding
		this.py = obj.nodePadding ? obj.nodePadding : this.nodeCount * 4;
		this.dy = this.py ? this.py : 8;
		this.id = (d) => d.index; // default id
		this.align = this.justify;
		this.sort;
		this.linkSort;

		this.iterations = 5;
		this.computeNodeLinks(this.data);
		this.computeNodeValues(this.data);
		this.computeNodeDepths(this.data);
		this.computeNodeHeights(this.data);
		this.computeNodeBreadths(this.data);
		this.computeLinkBreadths(this.data);
		this.nodes = this.data.nodes;
		this.links = this.data.links;
	}

	render() {
		const linkGen = d3
			.linkHorizontal()
			.source((d) => [d.source.x1, d.source.y1])
			.target((d) => [d.target.x0, d.target.y0]);
		const link = this.SVG.selectAll("paths")
			.data(this.links)
			.enter()
			.append("g");
		const linkPath = link
			.append("path")
			.attr("d", (d) => linkGen(d))
			.attr("fill", "none")
			.attr("stroke-width", (d) => d.value)
			.attr("stroke", this.edgeStrokeColor);
		const node = this.SVG.selectAll(".node")
			.data(this.nodes)
			.enter()
			.append("g")
			.attr("transform", (d) => translate(d.x0, d.y0));
		// add circles for nodes
		node
			.append("circle")
			.attr("stroke-width", this.circleStrokeWidth)
			.attr("stroke", this.nodeStrokeColor)
			.attr("fill", this.nodeFillColor)
			.attr("r", this.nodeRadius);
		node
			.append("text")
			.attr("fill", this.nodeTextColor)
			.attr("dy", -this.nodeRadius * 2)
			.attr("text-anchor", "middle")
			.text((d) => d.name);
	}

	computeLinkBreadths({ nodes }) {
		for (const node of nodes) {
			let y0 = node.y0;
			let y1 = y0;
			for (const link of node.sourceLinks) {
				link.y0 = y0 + link.width / 2;
				y0 += link.width;
			}
			for (const link of node.targetLinks) {
				link.y1 = y1 + link.width / 2;
				y1 += link.width;
			}
		}
	}

	justify(node, n) {
		return node.sourceLinks.length ? node.depth : n - 1;
	}

	find(nodeById, id) {
		const node = nodeById.get(id);
		if (!node) throw new Error("missing: " + id);
		return node;
	}

	computeNodeLayers({ nodes }) {
		const x = d3.max(nodes, (d) => d.depth) + 1;
		const kx = (this.x1 - this.x0 - this.dx) / (x - 1);
		const columns = new Array(x);
		for (const node of nodes) {
			const i = Math.max(
				0,
				Math.min(x - 1, Math.floor(this.align.call(null, node, x))),
			);
			node.layer = i;
			node.x0 = this.x0 + i * kx;
			node.x1 = node.x0 + this.dx;
			if (columns[i]) columns[i].push(node);
			else columns[i] = [node];
		}
		if (this.sort)
			for (const column of columns) {
				column.sort(this.sort);
			}
		return columns;
	}

	computeNodeLinks({ nodes, links }) {
		for (const [i, node] of nodes.entries()) {
			node.index = i;
			node.sourceLinks = [];
			node.targetLinks = [];
		}
		const nodeById = new Map(
			nodes.map((d, i) => [this.id(d, i, nodes), d]),
		);
		for (const [i, link] of links.entries()) {
			link.index = i;
			let { source, target } = link;
			if (typeof source !== "object")
				source = link.source = this.find(nodeById, source);
			if (typeof target !== "object")
				target = link.target = this.find(nodeById, target);
			source.sourceLinks.push(link);
			target.targetLinks.push(link);
		}
	}

	computeNodeValues({ nodes }) {
		for (const node of nodes) {
			node.value =
				node.fixedValue === undefined
					? Math.max(
							d3.sum(node.sourceLinks, node.value),
							d3.sum(node.targetLinks, node.value),
					  )
					: node.fixedValue;
		}
	}

	computeNodeDepths({ nodes }) {
		const n = nodes.length;
		let current = new Set(nodes);
		let next = new Set();
		let x = 0;
		while (current.size) {
			for (const node of current) {
				node.depth = x;
				for (const { target } of node.sourceLinks) {
					next.add(target);
				}
			}
			if (++x > n) throw new Error("circular link");
			current = next;
			next = new Set();
		}
	}

	computeNodeHeights({ nodes }) {
		const n = nodes.length;
		let current = new Set(nodes);
		let next = new Set();
		let x = 0;
		while (current.size) {
			for (const node of current) {
				node.height = x;
				for (const { source } of node.targetLinks) {
					next.add(source);
				}
			}
			if (++x > n) throw new Error("circular link");
			current = next;
			next = new Set();
		}
	}

	initializeNodeBreadths(columns) {
		let ky = d3.max(
			columns,
			(c) =>
				(this.y1 - this.y0 - (c.length - 1) * this.py) /
				d3.sum(c, c.value),
		);
		if (!isFinite(ky)) {
			ky = 0;
		}
		for (const nodes of columns) {
			let y = this.y0;
			for (const node of nodes) {
				node.y0 = y;
				node.y1 = y + node.value * ky;
				y = node.y1 + this.py;
				for (const link of node.sourceLinks) {
					link.width = link.value * ky;
				}
			}
			y = (this.y1 - y + this.py) / (nodes.length + 1);
			for (let i = 0; i < nodes.length; ++i) {
				const node = nodes[i];
				node.y0 += y * (i + 1);
				node.y1 += y * (i + 1);
			}
			this.reorderLinks(nodes);
		}
	}

	computeNodeBreadths(graph) {
		const columns = this.computeNodeLayers(graph);
		this.py = Math.min(
			this.dy,
			(this.y1 - this.y0) / (d3.max(columns, (c) => c.length) - 1),
		);
		this.initializeNodeBreadths(columns);
		for (let i = 0; i < this.iterations; ++i) {
			const alpha = Math.pow(0.99, i);
			const beta = Math.max(1 - alpha, (i + 1) / this.iterations);
			this.relaxRightToLeft(columns, alpha, beta);
			this.relaxLeftToRight(columns, alpha, beta);
		}
	}

	// Returns the source.y0 that would produce an ideal link from source to target.
	sourceTop(source, target) {
		let y = target.y0 - ((target.targetLinks.length - 1) * this.py) / 2;
		for (const { source: node, width } of target.targetLinks) {
			if (node === source) break;
			y += width + this.py;
		}
		for (const { target: node, width } of source.sourceLinks) {
			if (node === target) break;
			y -= width;
		}
		return y;
	}

	reorderLinks(nodes) {
		if (linkSort === undefined) {
			for (const { sourceLinks, targetLinks } of nodes) {
				sourceLinks.sort(ascendingTargetBreadth);
				targetLinks.sort(ascendingSourceBreadth);
			}
		}
	}

	reorderNodeLinks({ sourceLinks, targetLinks }) {
		if (this.linkSort === undefined) {
			for (const {
				source: { sourceLinks },
			} of targetLinks) {
				sourceLinks.sort(this.ascendingTargetBreadth);
			}
			for (const {
				target: { targetLinks },
			} of sourceLinks) {
				targetLinks.sort(this.ascendingSourceBreadth);
			}
		}
	}

	// Push any overlapping nodes up.
	resolveCollisionsBottomToTop(nodes, y, i, alpha) {
		for (; i >= 0; --i) {
			const node = nodes[i];
			const dy = (node.y1 - y) * alpha;
			if (dy > 1e-6) (node.y0 -= dy), (node.y1 -= dy);
			y = node.y0 - this.py;
		}
	}

	// Push any overlapping nodes down.
	resolveCollisionsTopToBottom(nodes, y, i, alpha) {
		for (; i < nodes.length; ++i) {
			const node = nodes[i];
			const dy = (y - node.y0) * alpha;
			if (dy > 1e-6) (node.y0 += dy), (node.y1 += dy);
			y = node.y1 + this.py;
		}
	}

	resolveCollisions(nodes, alpha) {
		const i = nodes.length >> 1;
		const subject = nodes[i];
		this.resolveCollisionsBottomToTop(
			nodes,
			subject.y0 - this.py,
			i - 1,
			alpha,
		);
		this.resolveCollisionsTopToBottom(
			nodes,
			subject.y1 + this.py,
			i + 1,
			alpha,
		);
		this.resolveCollisionsBottomToTop(
			nodes,
			this.y1,
			nodes.length - 1,
			alpha,
		);
		this.resolveCollisionsTopToBottom(nodes, this.y0, 0, alpha);
	}

	// Returns the target.y0 that would produce an ideal link from source to target.
	targetTop(source, target) {
		let y = source.y0 - ((source.sourceLinks.length - 1) * this.py) / 2;
		for (const { target: node, width } of source.sourceLinks) {
			if (node === target) break;
			y += width + this.py;
		}
		for (const { source: node, width } of target.targetLinks) {
			if (node === source) break;
			y -= width;
		}
		return y;
	}

	// Push any overlapping nodes up.
	resolveCollisionsBottomToTop(nodes, y, i, alpha) {
		for (; i >= 0; --i) {
			const node = nodes[i];
			const dy = (node.y1 - y) * alpha;
			if (dy > 1e-6) (node.y0 -= dy), (node.y1 -= dy);
			y = node.y0 - this.py;
		}
	}

	// Push any overlapping nodes down.
	resolveCollisionsTopToBottom(nodes, y, i, alpha) {
		for (; i < nodes.length; ++i) {
			const node = nodes[i];
			const dy = (y - node.y0) * alpha;
			if (dy > 1e-6) (node.y0 += dy), (node.y1 += dy);
			y = node.y1 + this.py;
		}
	}

	resolveCollisions(nodes, alpha) {
		const i = nodes.length >> 1;
		const subject = nodes[i];
		this.resolveCollisionsBottomToTop(
			nodes,
			subject.y0 - this.py,
			i - 1,
			alpha,
		);
		this.resolveCollisionsTopToBottom(
			nodes,
			subject.y1 + this.py,
			i + 1,
			alpha,
		);
		this.resolveCollisionsBottomToTop(
			nodes,
			this.y1,
			nodes.length - 1,
			alpha,
		);
		this.resolveCollisionsTopToBottom(nodes, this.y0, 0, alpha);
	}

	// Reposition each node based on its incoming (target) links.
	relaxLeftToRight(columns, alpha, beta) {
		for (let i = 1, n = columns.length; i < n; ++i) {
			const column = columns[i];
			for (const target of column) {
				let y = 0;
				let w = 0;
				for (const { source, value } of target.targetLinks) {
					let v = value * (target.layer - source.layer);
					y += this.targetTop(source, target) * v;
					w += v;
				}
				if (!(w > 0)) continue;
				let dy = (y / w - target.y0) * alpha;
				target.y0 += dy;
				target.y1 += dy;
				this.reorderNodeLinks(target);
			}
			if (this.sort === undefined) column.sort(ascendingBreadth);
			this.resolveCollisions(column, beta);
		}
	}

	// Reposition each node based on its outgoing (source) links.
	relaxRightToLeft(columns, alpha, beta) {
		for (let n = columns.length, i = n - 2; i >= 0; --i) {
			const column = columns[i];
			for (const source of column) {
				let y = 0;
				let w = 0;
				for (const { target, value } of source.sourceLinks) {
					let v = value * (target.layer - source.layer);
					y += this.sourceTop(source, target) * v;
					w += v;
				}
				if (!(w > 0)) continue;
				let dy = (y / w - source.y0) * alpha;
				source.y0 += dy;
				source.y1 += dy;
				this.reorderNodeLinks(source);
			}
			if (this.sort === undefined) column.sort(ascendingBreadth);
			this.resolveCollisions(column, beta);
		}
	}

	ascendingSourceBreadth(a, b) {
		return ascendingBreadth(a.source, b.source) || a.index - b.index;
	}

	ascendingTargetBreadth(a, b) {
		return ascendingBreadth(a.target, b.target) || a.index - b.index;
	}

	reorderLinks(nodes) {
		if (this.linkSort === undefined) {
			for (const { sourceLinks, targetLinks } of nodes) {
				sourceLinks.sort(this.ascendingTargetBreadth);
				targetLinks.sort(this.ascendingSourceBreadth);
			}
		}
	}

	justify(node, n) {
		return node.sourceLinks.length ? node.depth : n - 1;
	}
}

function ascendingBreadth(a, b) {
	return a.y0 - b.y0;
}
