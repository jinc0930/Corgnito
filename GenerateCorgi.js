let images = ["Corgi_Fall.jpg", "Corgi_Toast.png", "Corgi_Blanket.jpeg", "Corgi_Eggtoast.png", "Corgi_Leash.jpeg", "Corgi_Run.jpeg"];
const img = "Image/" + images[Math.floor(Math.random()*images.length)];
const corgi = document.createElement('img');
const canvasImg= document.getElementById('a');
const pic = document.getElementById("pic");
const width = 512;
const height = 512;
// pic.src = img;
corgi.src = img;

function drawCircle(x, y, r, color) {
   const c = document.getElementById("circle");
   if (c.getContext) {
      const ctx = c.getContext("2d");
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2*Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
   }
   return {
      "x": x,
      "y": y,
      "r": r,
      "color": color,
      "id": count++
   };
}

function matrixCircle(r, color) {
   for(let x = 0; x < Math.floor(width/(2*r)); x++) {
      for(let y = 0; y < Math.floor(height/(2*r)); y++) {
         drawCircle((2*x+1)*r, (2*y+1)*r, r, convertRGBtoHex(color[x][y]));
      }
   }
}

function convertRGBtoHex(color) {
   let R = color[0];
   let G = color[1];
   let B = color[2];
   if ((R >= 0 && R <= 255) && (G >= 0 && G <= 255) && (B >= 0 && B <= 255)) {
      return "#" + R.toString(16) + G.toString(16) + B.toString(16);
   }
}


async function colors() {
   const layers = 4;
   let circleColors = new Array(layers+1);

   const calcNextColors = (width, colorArray) => {
      let colColors = []
      for (let i = 0; i < Math.pow(2,width); ++i) {
         let rowColors = []
         for (let j = 0; j < Math.pow(2,width); ++j) {
               let rgb = [0, 0, 0];
               colorArray[width + 1][2 * i][2 * j].forEach((e, ind) => rgb[ind] += e);
               colorArray[width + 1][2 * i][2 * j + 1].forEach((e, ind) => rgb[ind] += e);
               colorArray[width + 1][2 * i + 1][2 * j].forEach((e, ind) => rgb[ind] += e);
               colorArray[width + 1][2 * i + 1][2 * j + 1].forEach((e, ind) => rgb[ind] += e);
               rgb = rgb.map(e => Math.floor(e / 4));
               rowColors.push(rgb);
         }
         colColors.push(rowColors);
      }
      return colColors;
   }

   async function calcSmallestCircleColors() {

      await new Promise((resolve) => { corgi.onload = resolve; });
      const circles = Math.pow(2, layers)
      let colorArray = [];
      const canvas = document.createElement("canvas");
      canvas.height = height;
      canvas.width = width;
      const corgiCanvas = canvas.getContext('2d', 'willReadFrequently');
      await corgiCanvas.drawImage(corgi, 0, 0, width, height);
      for (let i = 0; i < circles; ++i) {
         let lineColor = []
         const xoffset = Math.floor(i * width / circles);
         for (let j = 0; j < circles; ++j) {
               const yoffset = Math.floor(j * width / circles);
               let rgb = [0, 0, 0];

               let rgba = corgiCanvas.getImageData(
                  xoffset, yoffset, Math.floor(width/circles), Math.floor(height/circles)
               ).data;
               if (i===10&&j===10) {
                  console.log(rgba);
               }
               rgb = rgb.map((e,index) => rgba.reduce((acc,el, ind) => ind % 4 === index ? acc + el: acc, 0))
               rgb = rgb.map(e => Math.floor(4*e/rgba.length));
               lineColor.push(rgb);
            }
            colorArray.push(lineColor);
      }
      return colorArray;
   }
   const doRest = (colors) => {
      let circleColors = colors.map(e=> e);
      for (let a = layers - 1; a >= 0; --a) {
         circleColors[a] = calcNextColors(a,circleColors);
      }
      return circleColors;
   }
   return await calcSmallestCircleColors().then(array => circleColors[layers] = array).then(() => doRest(circleColors));

}
async function drawCanvas() {
   // const c = document.getElementById("circle")
   const colorArray = await colors();
   // console.log(colorArray);
   // let circleLayer = 0;
   // matrixCircle(Math.floor(width/2),colorArray[0]);

   // c.onmousemove(() => {
   //     circleLayer +=1;
   //     c.getContext("2d").clearRect(0, 0, c.width, c.height);
   //     matrixCircle(Math.floor(width/Math.pow(2,circleLayer)),colorArray[circleLayer]);
   // });

   let circle = drawCircle(width / 2, width / 2, width / 2, colorArray[0]);
   circlesData.push(circle);
   console.log(circlesData[0]["id"]);
   let r = Math.floor(width / 2);
   let y = width / 2;
   drawCircle((circle.x - r) + r / 2, (y - r) + r / 2, r / 2, convertRGBtoHex(colorArray[1][0][0]));
   drawCircle((circle.x - r) + r / 2, (y - r) + r * 1.5, r / 2, convertRGBtoHex(colorArray[1][0][1]));
   drawCircle((circle.x - r) + r * 1.5, (y - r) + r / 2, r / 2, convertRGBtoHex(colorArray[1][1][0]));
   drawCircle((circle.x - r) + r * 1.5, (y - r) + r * 1.5, r / 2, convertRGBtoHex(colorArray[1][1][1]));
}

drawCanvas();
let count = 0;



let circlesData = [];

// d3.select("canvas").append("circle");

// let circles = d3.selectAll("circle");

// circles
//    .attr("cx", function(d){
//       return d.x;
//    })
//    .attr("cy", function(d){
//       return d.y;
//    })
//    .attr("r", function(d) {
//       return d.r;
//    })
//    .attr("id", function(d) {
//       return d.id;
//    });

// function addData(x, y, r, color) {
//    // Top left
//    circlesData.push(drawCircle((x - r) + r / 2, (y - r) + r / 2, r / 2, colorArray[0]));

//    // Bottom left
//    circlesData.push(drawCircle((x - r) + r / 2, (y - r) + r * 1.5, r / 2, colorArray[0]));

//    // Top right
//    circlesData.push(drawCircle((x - r) + r * 1.5, (y - r) + r / 2, r / 2, colorArray[0]));

//    // Bottom right
//    circlesData.push(drawCircle((x - r) + r * 1.5, (y - r) + r * 1.5, r / 2, colorArray[0]));
// }