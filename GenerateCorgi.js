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
    console.log(colorArray);
    // let circleLayer = 0;
    matrixCircle(Math.floor(width/2),colorArray[0]);

    // c.onmousemove(() => {
    //     circleLayer +=1;
    //     c.getContext("2d").clearRect(0, 0, c.width, c.height);
    //     matrixCircle(Math.floor(width/Math.pow(2,circleLayer)),colorArray[circleLayer]);
    // });
}
drawCanvas();

