$(document).ready(function() {
   var count = 0;
   var data = [{
      "x": 256,
      "y": 256,
      "r": 256,
      "id": count
   }];
   count++;

   d3.select("svg").append("circle");
   applyAttrs();

   var circles = d3.selectAll("circle");
   circles.data(data);

   circles
      .attr("cx", function(d){
         return d.x;
      })
      .attr("cy", function(d){
         return d.y;
      })
      .attr("r", function(d) {
         return d.r;
      })
      .attr("id", function(d) {
         return d.id;
      });

   function addHandlers() {
      d3.selectAll("circles")
         .on("mouseenter", function() {
            if (this.getAttribute("r") > 2) {
               var c1 = d3.select("svg").append("circle");
               var c2 = d3.select("svg").append("circle");
               var c3 = d3.select("svg").append("circle");
               var c4 = d3.select("svg").append("circle");

               var arr = [c1, c2, c3, c4];

               addData(this.getAttribute("cx"), this.getAttribute("cy"), this.getAttribute("r"));
               applyAttrs();
               
               data.splice(this.getAttribute("id"), 1);
               var currentCicle = document.getElementById(this.getAttribute("id"));
               currentCicle.remove();

               resetIds();

               for(var i = 0; i < 4; i++) {
                  arr[i].onmousemove(addHandlers());
               }
            }
         });
   }

   function addData(x, y, r) {
      // Top left
      data.push({
         "x": (x - r) + r / 2,
         "y": (y - r) + r / 2,
         "r": r / 2,
         "id": count
      });
      count++

      // Bottom left
      data.push({
         "x": (x - r) + r / 2,
         "y": (y - r) + r * 1.5,
         "r": r / 2,
         "id": count
      });
      count++

      // Top right
      data.push({
         "x": (x - r) + r * 1.5,
         "y": (y - r) + r / 2,
         "r": r / 2,
         "id": count
      });
      count++

      // Bottom right
      data.push({
         "x": (x - r) + r * 1.5,
         "y": (y - r) + r * 1.5,
         "r": r / 2,
         "id": count
      });
      count++
   }

   function applyAttrs() {
      var selection = d3.selectAll("circle");
      selection.data(data);

      selection
         .attr("cx", function(d){
            return d.x;
         })
         .attr("cy", function(d){
            return d.y;
         })
         .attr("r", function(d) {
            return d.r;
         })
         .attr("id", function(d) {
            return d.id;
         });
   }

   addHandlers();

   function resetIds() {
      for (var i = 0; i < data.length; i++) {
         data[i].id = i;
      }
   }
});