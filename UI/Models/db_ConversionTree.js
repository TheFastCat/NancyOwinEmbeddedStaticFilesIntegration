$(function() {	
		var treeData = [ 
			{
			    "name" : "Transactional Lead",
			    "text" : "Transactional Lead" + ' (' + my.newCustomersCountVal() + ')',
			    "type" : "black",
			    "level" : "gray",
			    "value" : my.newCustomersCountVal(),
			    "children": [
			                 {
			                	 "name" : "Hot",
			                	 "text" : "Hot" + ' (' + (4).toString() + ')',
			                	 "parent": "Transactional Lead",
			                	 "criteria": "Within 1 day of creation",
			                	 "type" : "gray",
			                	 "level" : "red",
			                	 "value": 4,		                	 
			                	 "children" : [
			                	               {
			                	            	   "name" : "Call",
			                	            	   "text" : (4).toString(),
			                	            	   "parent": "Hot",
			                	            	   "criteria": "A DSAR activity has been completed",
			                	            	   "type" : "gray",
			                	            	   "level" : "red",	
			                	            	   "icon" : "../../Resources/Images/phone16.png",
			                	            	   "value": 4,
			                	            	   /*
			                	            	   "children" : [
			                	            	                 {
			                	            	                	 
			                	            	                	 "name": "Shipments",
			                	            	                	 "parent": "Activities",
			                	            	                	 "criteria": "A new shipment has been entered",
			                	            	                	 "type" : "gray",
			                	            	                	 "level" : "light blue",
			                	            	                	 "value": 4,
			                	            	                 }
			                	            	                 ]
			                	            	                 */
			                	               },
			                	               {
			                	            	   "name" : "Meet",
			                	            	   "parent": "Hot",
			                	            	   "text" : (8).toString(),
			                	            	   "criteria": "A DSAR activity has been completed",
			                	            	   "type" : "gray",
			                	            	   "level" : "red",
			                	            	   "icon" : "../../Resources/Images/users32.png",
			                	            	   "value": 8,
			                	            	   /*
			                	            	   "children" : [
			                	            	                 {
			                	            	                	 
			                	            	                	 "name": "Shipments",
			                	            	                	 "parent": "Activities",
			                	            	                	 "criteria": "A new shipment has been entered",
			                	            	                	 "type" : "gray",
			                	            	                	 "level" : "light blue",
			                	            	                	 "value": 4,
			                	            	                 }
			                	            	                 ]
			                	            	                 */
			                	               }	
			                	               ]
			                	               
			                 },
			                 {
			                	 "name" : "Warm",
			                	 "text" : "Warm" + ' (' + (7).toString() + ')',
			                	 "parent": "Transactional Lead",
			                	 "criteria": "Within 3 day of creation", 
			                	 "type" : "gray",
			                	 "level" : "orange",
			                	 "value": 7,		                	 
			                	 "children" : [
			                	               {
			                	            	   "name" : "Call",
			                	            	   "text" : (4).toString(),
			                	            	   "parent": "Warm",
			                	            	   "criteria": "A DSAR activity has been completed",
			                	            	   "type" : "gray",
			                	            	   "level" : "orange",
			                	            	   "icon" : "../../Resources/Images/phone16.png",
			                	            	   "value": 4,
			                	            	   /*
			                	            	   "children" : [
			                	            	                 {
			                	            	                	 
			                	            	                	 "name": "Shipments",
			                	            	                	 "parent": "Activities",
			                	            	                	 "criteria": "A new shipment has been entered",
			                	            	                	 "type" : "gray",
			                	            	                	 "level" : "light blue",
			                	            	                	 "value": 4,
			                	            	                 }
			                	            	                 ]
			                	            	                 */
			                	               },
			                	               {
			                	            	   "name": "Call",
			                	            	   "text" : (4).toString(),
			                	            	   "parent": "Warm",
			                	            	   "criteria": "A DSAR activity has been completed",
			                	            	   "type" : "gray",
			                	            	   "level" : "orange",
			                	            	   "icon" : "../../Resources/Images/users32.png",
			                	            	   "value": 4,
			                	            	   /*
			                	            	   "children" : [
			                	            	                 {
			                	            	                	 
			                	            	                	 "name": "Shipments",
			                	            	                	 "parent": "Activities",
			                	            	                	"criteria": "A new shipment has been entered",
			                	            	                	 "type" : "gray",
			                	            	                	 "level" : "light blue",
			                	            	                	 "value": 4,
			                	            	                 }
			                	            	                 ]
			                	            	                 */
			                	               }
			                	               ]
			                 },
			                 {
			                	 "name": "Stale",
			                	 "text" : "Stale" + ' (' + (3).toString() + ')',
			                	 "parent": "Transactional Lead",
			                	 "criteria": "Within 7 day of creation", 
			                	 "type" : "gray",
			                	 "level" : "brown",
			                	 "value": 3,
			                	 "children" : [
			                	               {
			                	            	   "name": "Call",
			                	            	   "text" : (4).toString(),
			                	            	   "parent": "Stale",
			                	            	   "criteria": "A DSAR activity has been completed",
			                	            	   "type" : "gray",
			                	            	   "level" : "brown",
			                	            	   "icon" : "../../Resources/Images/phone16.png",
			                	            	   "value": 4,
			                	            	   /*
			                	            	   "children" : [
			                	            	                 {
			                	            	                	 
			                	            	                	 "name": "Shipments",
			                	            	                	 "parent": "Activities",
			                	            	                	 "criteria": "A new shipment has been entered",
			                	            	                	 "type" : "gray",
			                	            	                	 "level" : "light blue",
			                	            	                	 "value": 4,
			                	            	                 }
			                	            	                 ]
			                	            	                 */
			                	               },
			                	               {
			                	            	   "name": "Call",
			                	            	   "parent": "Stale",
			                	            	   "text" : (4).toString(),
			                	            	   "criteria": "A DSAR activity has been completed",
			                	            	   "type" : "gray",
			                	            	   "level" : "brown",
			                	            	   "icon" : "../../Resources/Images/users32.png",
			                	            	   "value": 4,
			                	            	   /*
			                	            	   "children" : [
			                	            	                 {
			                	            	                	 
			                	            	                	 "name": "Shipments",
			                	            	                	 "parent": "Activities",
			                	            	                	 "criteria": "A new shipment has been entered",
			                	            	                	 "type" : "gray",
			                	            	                	 "level" : "light blue",
			                	            	                	 "value": 4,
			                	            	                 }
			                	            	                 ]
			                	            	                 */
			                	               }
			                	               ]
			                 },
			                 {
			                	 "name": "Moldy",
			                	 "text" : "Moldy" + ' (' + (1).toString() + ')',
			                	 "parent": "Transactional Lead",
			                	 "criteria": "Greater than 7 day from creation", 
			                	 "type" : "gray",
			                	 "level" : "black",
			                	 "value": 1,
			                	 "children" : [
			                	               {
			                	            	   "name": "Call",
			                	            	   "text" : (4).toString(),
			                	            	   "parent": "Moldy",
			                	            	   "criteria": "A DSAR activity has been completed",
			                	            	   "type" : "gray",
			                	            	   "level" : "black",
			                	            	   "icon" : "../../Resources/Images/phone16.png",
			                	            	   "value": 4,
			                	            	   /*
			                	            	   "children" : [
			                	            	                 {
			                	            	                	 
			                	            	                	 "name": "Shipments",
			                	            	                	 "parent": "Activities",
			                	            	                	 "criteria": "A new shipment has been entered",
			                	            	                	 "type" : "gray",
			                	            	                	 "level" : "light blue",
			                	            	                	 "value": 4,
			                	            	                 }
			                	            	                 ]
			                	            	                 */
			                	               },
			                	               {
			                	            	   "name": "Call",
			                	            	   "text" : (4).toString(),
			                	            	   "parent": "Moldy",
			                	            	   "criteria": "A DSAR activity has been completed",
			                	            	   "type" : "gray",
			                	            	   "level" : "black",
			                	            	   "icon" : "../../Resources/Images/users32.png",
			                	            	   "value": 4,
			                	            	   /*
			                	            	   "children" : [
			                	            	                 {
			                	            	                	 
			                	            	                	 "name": "Shipments",
			                	            	                	 "parent": "Activities",
			                	            	                	 "criteria": "A new shipment has been entered",
			                	            	                	 "type" : "gray",
			                	            	                	 "level" : "light blue",
			                	            	                	 "value": 4,
			                	            	                 }
			                	            	                 ]
			                	            	                 */
			                	               }
			                	               ]
			                 }
			    ]
				}
			];
	
		
			
		var margin = {top: 30, right: 20, bottom: 20, left: 20},
			width = ($('#box3').width()) - margin.right - margin.left,
			height = ($('#box3').height()) - margin.top - margin.bottom;
		
		var i = 0,
			duration = 750,
			root;
		
		var tree = d3.layout.tree()
			//.size([height, width]); 
			.nodeSize([90, 40]);
		
		//Draw pretty lines with natural curve to connect nodes
		var diagonal = d3.svg.diagonal()
			.projection(function(d) { return [d.x, d.y]; });
		
		var svg = d3.select("#box3").append("svg")
			.attr("width", width + margin.right + margin.left)
			.attr("height", height + margin.top + margin.bottom)
			  .append("g")
			.attr("transform", "translate(" + ((width/2) + margin.right) + "," + margin.top + ")");
	
		root = treeData[0];
		root.x0 = height / 2;
		root.y0 = 0;
		
		//Initialize collapsed
		root.children.forEach(collapse);
		
		update(root);
		
		my.newCustomersCountVal.subscribe(function(newValue) {			
			$.each(treeData, function() {	
				if (this.name == "Transactional Lead") {
					this.value = my.newCustomersCountVal();
				}
			});
			
			update(root);
			
		});
		
		
		function update(source) {
		
			 var nodes = tree.nodes(root),
			 	links = tree.links(nodes);		 
			 		 
			 //Set the vertical spacing of the nodes
			 nodes.forEach(function(d) { d.y = d.depth * 80; });
			 
			 
			 //Declare the variable node called later to select the appropriate object (a node) with the appropriate .id.
			 var node = svg.selectAll("g.node")
			 	.data(nodes, function(d) { return d.id || (d.id = ++i); });
			 
			 //Assigns the variable nodeEnter to the action of appending a node to a particular position
			 var nodeEnter = node.enter().append("g")
		 	 	.attr("class", "node")		 	
		 	 	.attr("transform", function(d) { 
		 	 		return "translate(" + source.x + "," + source.y + ")"; })
		 	 	.on("click", conversionMetricsTreeClick);
			 	 
			 //Append images
			 nodeEnter.append("image")
		       	 .attr("xlink:href", function(d) { return d.icon; })
			     .attr("x", "-35px")
			     .attr("y", "-18px")
			     .attr("width", "32px")
			     .attr("height", "32px");
		 
			 
			  // Transition nodes to their new position.
			  var nodeUpdate = node.transition()
				.duration(duration)
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
			 
			  nodeUpdate.select("circle")			  
			  	  .attr("r", function(d) { return d.value; })
				  //.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
			 
			  nodeUpdate.select("text")
				.style("fill-opacity", 1)
				.text(function(d) { return d.name + ' (' + d.value +')'; });
			  
			 
			  // Transition exiting nodes to the parent's new position.
			  var nodeExit = node.exit().transition()
			  	.duration(duration)
				.attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
				.remove();
			 
			  nodeExit.select("circle")
			  	.attr("r", 1e-6);
			 
			  nodeExit.select("text")
			  	.style("fill-opacity", 1e-6);
			 
			 //Appends the circle that comprises the node 
			 nodeEnter.append("circle")
			 	.attr("r", function(d) { return d.value; })
			 	.style("stroke", function(d) { return d.type; })
			 	.style("fill", function(d) { return d.level; })
			 	.style("cursor", "pointer");		 
			 
			 //Append the text for each node
			 nodeEnter.append("text")
			 	.attr("y", function(d) { 
			 		return d.children || d._children ? -18 : 20; })
			 	.attr("dy", ".35em")
			 	.attr("text-anchor", "middle")
			 	.text(function(d) { return d.name + ' (' + d.value +')'; })
			 	//.text(function(d) { return d.text; })
			 	.style("fill-opacity", 1)		 	
			 
			 //Create a link using diagonal path based on all links that have unique target id's
			 var link = svg.selectAll("path.link")
			 	.data(links, function(d) { return d.target.id; });
			
			 link.enter().insert("path", "g")
			 	.attr("class", "link")
			 	.style("stroke", function(d) { return d.target.level; })
			 	.style("stroke-width", function(d) { return d.target.value; })
			 	.style("fill", "none")
			 	.attr("d", diagonal);
			 
			 // Transition links to their new position.
			 link.transition()
			 	.duration(duration)
				.attr("d", diagonal);
			 
			 // Transition exiting links to the parent's new position.
			 link.exit().transition()
				.duration(duration)
				.attr("d", function(d) {
					var o = {x: source.x, y: source.y};
					return diagonal({source: o, target: o});
				})
				.remove();
			 
			  // Stash the old positions for transition.
			  nodes.forEach(function(d) {
				d.x0 = d.x;
				d.y0 = d.y;
			  });
		};
		
		
		
		//Expand and contract nodes on click
		function conversionMetricsTreeClick(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;			
			  } else {
				  d.children = d._children;
				  d._children = null;
			  }
			// If the node has a parent, then collapse its child nodes
			// except for this clicked node.
			if (d.parent) {			
			    d.parent.children.forEach(function(element) {
			    	if (d !== element) {		    		
			    		collapse(element);
			    	}
			    });
			}
			if (d.parent) {			
			    d.parent.children.forEach(function(element) {
			    	if (d !== element) {		    		
			    		collapse(element);
			    	}
			    });
			}
			update(d);
		};
		
		function collapse(d) {
			if (d.children) {
				d._children = d.children;
				d._children.forEach(collapse);
				d.children = null;
			}
		};
		
		// Toggle children, could be used to initiate with select nodes expanded
		function toggle(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else {
				d.children = d._children;
				d._children = null;
		  }
		}
		 
		
});
