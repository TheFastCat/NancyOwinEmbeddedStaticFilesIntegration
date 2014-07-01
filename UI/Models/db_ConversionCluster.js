$(function() {
var treeData = [ 
		{
		    "name" : "Transactional Lead",
		    "type" : "black",
		    "level" : "gray",
		    "value" : 15,
		    "children": [
		                 {
		                	 "name": "Hot",
		                	 "parent": "Transactional Lead",
		                	 "criteria": "Within 1 day of creation",
		                	 "type" : "gray",
		                	 "level" : "red",
		                	 "value": 4,
		                	 "children" : [
		                	               {
		                	            	   "name": "Activities",
		                	            	   "parent": "Hot",
		                	            	   "criteria": "A DSAR activity has been set",
		                	            	   "type" : "gray",
		                	            	   "level" : "light blue",
		                	            	   "value": 4,
		                	            	   "children" : [
		                	            	                 {
		                	            	                	 
		                	            	                	 "name": "Shipments",
		                	            	                	 "parent": "Activities",
		                	            	                	 "criteria": "A DSAR activity has been set",
		                	            	                	 "type" : "gray",
		                	            	                	 "level" : "light blue",
		                	            	                	 "value": 4,
		                	            	                 }
		                	            	                 ]
		                	               }		                	               
		                	               ]
		                 },
		                 {
		                	 "name": "Warm",
		                	 "parent": "Transactional Lead",
		                	 "criteria": "Within 3 day of creation", 
		                	 "type" : "gray",
		                	 "level" : "yellow",
		                	 "value": 7,
		                	 "children" : [
		                	               {
		                	            	   "name": "Activities",
		                	            	   "parent": "Hot",
		                	            	   "criteria": "A DSAR activity has been set",
		                	            	   "type" : "gray",
		                	            	   "level" : "light blue",
		                	            	   "value": 4,
		                	            	   "children" : [
		                	            	                 {
		                	            	                	 
		                	            	                	 "name": "Shipments",
		                	            	                	 "parent": "Activities",
		                	            	                	 "criteria": "A DSAR activity has been set",
		                	            	                	 "type" : "gray",
		                	            	                	 "level" : "light blue",
		                	            	                	 "value": 4,
		                	            	                 }
		                	            	                 ]
		                	               },		                	               
		                	               ]
		                 },
		                 {
		                	 "name": "Stale",
		                	 "parent": "Transactional Lead",
		                	 "criteria": "Within 7 day of creation", 
		                	 "type" : "gray",
		                	 "level" : "brown",
		                	 "value": 3,
		                	 "children" : [
		                	               {
		                	            	   "name": "Activities",
		                	            	   "parent": "Hot",
		                	            	   "criteria": "A DSAR activity has been set",
		                	            	   "type" : "gray",
		                	            	   "level" : "light blue",
		                	            	   "value": 4,
		                	            	   "children" : [
		                	            	                 {
		                	            	                	 
		                	            	                	 "name": "Shipments",
		                	            	                	 "parent": "Activities",
		                	            	                	 "criteria": "A DSAR activity has been set",
		                	            	                	 "type" : "gray",
		                	            	                	 "level" : "light blue",
		                	            	                	 "value": 4,
		                	            	                 }
		                	            	                 ]
		                	               }		                	              
		                	               ]
		                 },
		                 {
		                	 "name": "Moldy",
		                	 "parent": "Transactional Lead",
		                	 "criteria": "Greater than 7 day from creation", 
		                	 "type" : "gray",
		                	 "level" : "black",
		                	 "value": 1,
		                	 "children" : [
		                	               {
		                	            	   "name": "Activities",
		                	            	   "parent": "Hot",
		                	            	   "criteria": "A DSAR activity has been set",
		                	            	   "type" : "gray",
		                	            	   "level" : "light blue",
		                	            	   "value": 4,
		                	            	   "children" : [
		                	            	                 {
		                	            	                	 
		                	            	                	 "name": "Shipments",
		                	            	                	 "parent": "Activities",
		                	            	                	 "criteria": "A DSAR activity has been set",
		                	            	                	 "type" : "gray",
		                	            	                	 "level" : "light blue",
		                	            	                	 "value": 4,
		                	            	                 }
		                	            	                 ]
		                	               }
		                	               ]
		                 }
		    ]
			}
		];

var root = treeData[0];

var margin = {top: 50, right: 20, bottom: 20, left: 20},
	width = ($('#box3').width()) - margin.right - margin.left,
	height = ($('#box3').height()) - margin.top - margin.bottom;

var cluster = d3.layout.cluster()
    .size([height, width - 160]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#box3").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(40,0)");


  var nodes = cluster.nodes(root),
      links = cluster.links(nodes);

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append("circle")
      .attr("r", 4.5);

  node.append("text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 3)
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.name; });
});

//d3.select(self.frameElement).style("height", height + "px");