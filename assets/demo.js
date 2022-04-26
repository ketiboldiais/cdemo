import { linkedList } from "../cdemo/cdemo.mjs";
import { plot } from "../cdemo/cdemo.mjs";
import { plot3d } from "../cdemo/cdemo.mjs";
import { tree } from "../cdemo/cdemo.mjs";
import { matrix } from "../cdemo/cdemo.mjs";
import { truthTable } from "../cdemo/cdemo.mjs";
import { sequence } from "../cdemo/cdemo.mjs";
import { stack } from "../cdemo/cdemo.mjs";
import { queue } from "../cdemo/cdemo.mjs";
import { circularQueue } from "../cdemo/cdemo.mjs";
import { doublyLinkedList } from "../cdemo/cdemo.mjs";
import { horizontalTree } from "../cdemo/cdemo.mjs";
import { network } from "../cdemo/cdemo.mjs";
import { graph } from "../cdemo/cdemo.mjs";
import { scatterPlot } from "../cdemo/cdemo.mjs";
import { linePlot } from "../cdemo/cdemo.mjs";
import { bipartite } from "../cdemo/cdemo.mjs";

bipartite({
	id: "bipartiteDemo",
	data: {
		nodes: [
			{ node: 0, name: "Dan" },
			{ node: 1, name: "Serena" },
			{ node: 2, name: "Ben" },
			{ node: 3, name: "Vanessa" },
			{ node: 4, name: "Chuck" },
			{ node: 5, name: "Blair" },
			{ node: 6, name: "Nate" },
			{ node: 7, name: "Jenny" },
			{ node: 8, name: "Louis" },
			{ node: 9, name: "Carter" },
			{ node: 10, name: "Eva" },
			{ node: 11, name: "Raina" },
			{ node: 12, name: "Georgina" },
		],
		links: [
			{ source: 0, target: 5, value: 1 },
			{ source: 0, target: 1, value: 1 },
			{ source: 0, target: 3, value: 1 },
			{ source: 4, target: 3, value: 1 },
			{ source: 4, target: 7, value: 1 },
			{ source: 4, target: 5, value: 1 },
			{ source: 4, target: 12, value: 1 },
			{ source: 6, target: 5, value: 1 },
			{ source: 6, target: 1, value: 1 },
			{ source: 6, target: 11, value: 1 },
			{ source: 6, target: 3, value: 1 },
			{ source: 6, target: 7, value: 1 },
			{ source: 2, target: 1, value: 1 },
			{ source: 8, target: 5, value: 1 },
			{ source: 9, target: 1, value: 1 },
			{ source: 4, target: 10, value: 1 },
		],
	},
});

linePlot({
	id: "line_plot2",

	yMax: 70,
	legend: {
		Apache: "#BE3144",
		MIT: "#FF6C00",
		GPL: "#1597BB",
	},
	color: "greyScheme",
	tickCount: { x: 6, y: 6 },
	data: [
		{ x: 2013, y: 54, group: "GPL" },
		{ x: 2013, y: 18, group: "MIT" },
		{ x: 2013, y: 13, group: "Apache" },

		{ x: 2014, y: 45, group: "GPL" },
		{ x: 2014, y: 22, group: "MIT" },
		{ x: 2014, y: 15, group: "Apache" },

		{ x: 2015, y: 25, group: "GPL" },
		{ x: 2015, y: 18, group: "MIT" },
		{ x: 2015, y: 16.5, group: "Apache" },

		{ x: 2016, y: 25, group: "MIT" },
		{ x: 2016, y: 19, group: "GPL" },
		{ x: 2016, y: 15, group: "Apache" },

		{ x: 2021, y: 30, group: "Apache" },
		{ x: 2021, y: 26, group: "MIT" },
		{ x: 2021, y: 19, group: "GPL" },
	],
});

linePlot({
	id: "linePlotDemo",
	yLabel: "user %",
	xLabel: "year",
	yMax: 70,
	legend: {
		LGPL: "#519872",
		BSD3: "#9153F4",
		Apache: "#BE3144",
		GPL: "#1597BB",
		MIT: "#FF6C00",
	},
	color: "greyScheme",
	tickCount: { x: 6, y: 6 },
	data: [
		[2010, 24.08, "GPL"],
		[2011, 26.17, "GPL"],
		[2012, 27.99, "GPL"],
		[2013, 28.13, "GPL"],
		[2014, 26.45, "GPL"],
		[2015, 25.78, "GPL"],
		[2016, 24.96, "GPL"],
		[2017, 23.82, "GPL"],
		[2018, 21.06, "GPL"],
		[2019, 21.03, "GPL"],
		[2020, 20.73, "GPL"],
		[2021, 20.24, "GPL"],
		[2022, 21.04, "GPL"],

		[2010, 64.68, "MIT"],
		[2011, 64.68, "MIT"],
		[2012, 59.09, "MIT"],
		[2013, 54.69, "MIT"],
		[2014, 55.29, "MIT"],
		[2015, 53.97, "MIT"],
		[2016, 54.7, "MIT"],
		[2017, 54.47, "MIT"],
		[2018, 55.2, "MIT"],
		[2019, 57.99, "MIT"],
		[2020, 58.65, "MIT"],
		[2021, 59.16, "MIT"],
		[2022, 60.12, "MIT"],

		[2010, 4.04, "Apache"],
		[2011, 5.92, "Apache"],
		[2012, 7.57, "Apache"],
		[2013, 9.14, "Apache"],
		[2014, 11.96, "Apache"],
		[2015, 13.66, "Apache"],
		[2016, 15.46, "Apache"],
		[2017, 16.81, "Apache"],
		[2018, 17.26, "Apache"],
		[2019, 16.97, "Apache"],
		[2020, 16.81, "Apache"],
		[2021, 16.37, "Apache"],
		[2022, 17.02, "Apache"],

		[2010, 3.33, "BSD3"],
		[2011, 4.87, "BSD3"],
		[2012, 5.31, "BSD3"],
		[2013, 2.84, "BSD3"],
		[2014, 3.97, "BSD3"],
		[2015, 3.15, "BSD3"],
		[2016, 2.74, "BSD3"],
		[2017, 2.24, "BSD3"],
		[2018, 2.03, "BSD3"],
		[2019, 1.86, "BSD3"],
		[2020, 1.9, "BSD3"],
		[2021, 1.97, "BSD3"],
		[2022, 2.13, "BSD3"],

		[2010, 3.87, "LGPL"],
		[2011, 3.94, "LGPL"],
		[2012, 4.44, "LGPL"],
		[2013, 4.6, "LGPL"],
		[2014, 3.64, "LGPL"],
		[2015, 2.71, "LGPL"],
		[2016, 2.36, "LGPL"],
		[2017, 1.92, "LGPL"],
		[2018, 1.67, "LGPL"],
		[2019, 1.48, "LGPL"],
		[2020, 1.4, "LGPL"],
		[2021, 1.3, "LGPL"],
		[2022, 1.24, "LGPL"],
	],
});

scatterPlot({
	id: "scatterPlotDemo",
	color: "mintScheme",
	yLabel: "y",
	xLabel: "x",
	radialMagnitude: true,
	data: [
		[0, 22],
		[5, 47],
		[10, 59],
		[15, 54],
		[20, 92],
		[25, 104],
		[30, 95],
		[35, 91],
		[40, 104],
		[45, 117],
		[50, 125],
		[55, 119],
	],
});

horizontalTree({
	id: "horizontalTreeDemo",
	data: [
		{ child: "preorder(F0)", parent: "" },
		{ child: "8", parent: "preorder(F0)" },
		{ child: "preorder(F1)", parent: "preorder(F0)" },
		{ child: "preorder(F2)", parent: "preorder(F0)" },
		{ child: "3", parent: "preorder(F1)" },
		{ child: "preorder(F3)", parent: "preorder(F1)" },
		{ child: "preorder(F4)", parent: "preorder(F1)" },
		{ child: "4", parent: "preorder(F3)" },
		{
			child: "preorder(0)",
			parent: "preorder(F3)",
			fill: "red",
			stroke: "firebrick",
		},
		{
			child: "preorder(0)",
			parent: "preorder(F3)",
			fill: "red",
			stroke: "firebrick",
		},
		{ child: "9", parent: "preorder(F4)" },
		{
			child: "preorder(0)",
			parent: "preorder(F4)",
			fill: "red",
			stroke: "firebrick",
		},
		{
			child: "preorder(0)",
			parent: "preorder(F4)",
			fill: "red",
			stroke: "firebrick",
		},
		{ child: "5", parent: "preorder(F2)" },
		{ child: "preorder(F5)", parent: "preorder(F2)" },
		{ child: "preorder(F6)", parent: "preorder(F2)" },
		{ child: "7", parent: "preorder(F5)" },
		{
			child: "preorder(0)",
			parent: "preorder(F5)",
			fill: "red",
			stroke: "firebrick",
		},
		{
			child: "preorder(0)",
			parent: "preorder(F5)",
			fill: "red",
			stroke: "firebrick",
		},
		{ child: "2", parent: "preorder(F6)" },
		{
			child: "preorder(0)",
			parent: "preorder(F6)",
			fill: "red",
			stroke: "firebrick",
		},
		{
			child: "preorder(0)",
			parent: "preorder(F6)",
			fill: "red",
			stroke: "firebrick",
		},
	],
});

doublyLinkedList({
	id: "doublyLinkedListDemo",
	data: [5, 8, 9, 2, 1],
});

circularQueue({
	id: "circularQueueDemo",
	data: ["A", "B", "C", "D", "E", "F", "G"],
});

queue({
	id: "queueDemo",
	data: [5, 8, 9, 7, 3],
});

stack({
	palette: "darkRedScheme",
	id: "stackDemo",
	data: ["f()", "g()", "h()", "i()", "j()", "k()"],
});

plot3d({
	id: "plot3dDemo",
	fn: (x, y) => (x ** 2 - y ** 2) * 0.2,
});

linkedList({
	id: "aLinkedList",
	data: [2, 3, 9, 11, 17, 20],
});

plot({
	id: "sinePlot",
	fn: (x) => Math.sin(x),
	domain: [-10, 10],
	range: [-4, 4],
	precision: 100,
});

truthTable({
	id: "flipFlopGate",
	focus: [
		[7, 5],
		[7, 6],
	],
	headers: ["clock", "set", "reset", "set*", "reset*", "Q", "Q*"],
	rows: [
		[0, 0, 0, 1, 1, "NC", "NC"],
		[0, 0, 1, 1, 1, "NC", "NC"],
		[0, 1, 0, 1, 1, "NC", "NC"],
		[0, 1, 1, 1, 1, "NC", "NC"],
		[1, 0, 0, 1, 1, "NC", "NC"],
		[1, 0, 1, 1, 0, 0, 1],
		[1, 1, 0, 0, 1, 1, 0],
		[1, 1, 1, 0, 0, "⊥", "⊥"],
	],
});

matrix({
	id: "matrixDemo",
	margins: [50, 20, 50, 20],
	focus: [
		[1, 1],
		[1, 4],
		[1, 7],
		[1, 8],
		[1, 9],
		[2, 1],
		[2, 4],
		[2, 8],
		[3, 1],
		[3, 2],
		[3, 3],
		[3, 4],
		[3, 8],
		[4, 1],
		[4, 4],
		[4, 8],
		[5, 1],
		[5, 4],
		[5, 7],
		[5, 8],
		[5, 9],
	],
	indexed: true,
	data: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0],
		[0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
		[0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0],
		[0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
		[0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	],
});

sequence({
	id: "arrayDemo",
	data: [2, 4, 1, 3, 8, 0, 9, 7, 5],
});

network({
	id: "network",
	data: [
		{
			source: "Conekt",
			target: "AT&T",
			tattr: { radial: 30 },
			sattr: { fill: "pink", stroke: "firebrick" },
		},
		{ source: "house1", target: "n1" },
		{ source: "house2", target: "n1" },
		{ source: "house3", target: "n1" },
		{ source: "house4", target: "n1" },
		{ source: "n1", target: "town1" },
		{ source: "n2", target: "town1" },
		{ source: "n3", target: "town1" },
		{ source: "town1", target: "Conekt" },
		{ source: "town2", target: "Conekt" },
		{ source: "n4", target: "town2" },
		{ source: "n5", target: "town2" },
		{ source: "n6", target: "town2" },
		{ source: "town3", target: "Conekt" },
		{ source: "town4", target: "Conekt" },
		{ source: "town5", target: "Conekt" },
		{ source: "AT&T", target: "Comcast", tattr: { radial: 30 } },
		{
			source: "WireUp",
			target: "Comcast",
			sattr: { fill: "pink", stroke: "firebrick" },
		},
		{ source: "town105", target: "WireUp" },
		{ source: "town106", target: "WireUp" },
		{ source: "town107", target: "WireUp" },
		{ source: "town108", target: "WireUp" },
		{ source: "town109", target: "WireUp" },
	],
});

graph({
	id: "graph",
	color: "yellowScheme",
	data: [
		{ source: "house1", target: "house2" },
		{ source: "house2", target: "house1" },
		{ source: "house3", target: "house2" },
		{ source: "house2", target: "house3" },
		{ source: "house4", target: "house1" },
		{ source: "house1", target: "house4" },
		{ source: "house2", target: "house6" },
		{ source: "house3", target: "house4" },
		{ source: "house4", target: "house5" },
		{ source: "house5", target: "house4" },
		{ source: "house1", target: "house5" },
		{ source: "house5", target: "house1" },
		{ source: "house4", target: "house7" },
		{ source: "house6", target: "house2" },
		{ source: "house2", target: "house6" },
		{ source: "house7", target: "house3" },
		{ source: "house3", target: "house7" },
	],
});

tree({
	id: "binaryTree",
	narrow: 50,
	edgeLength: 110,
	data: [
		["a", ""],
		["b", "a"],
		["d", "b"],
		["h", "d"],
		["i", "d"],
		["j", "i"],
		["k", "i"],
		["e", "b"],
		["c", "a"],
	],
});
