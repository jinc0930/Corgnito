let images = ["Corgi_Fall.jpg", "Corgi_Toast.png", "Corgi_Blanket.jpeg", "Corgi_Eggtoast.png", "Corgi_Leash.jpeg", "Corgi_Run.jpeg"];
const img = "Image/" + images[Math.floor(Math.random()*images.length)];
const corgi = document.createElement('img');
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
    for(var x = 0; x < Math.floor(512/r); x++) {
        for(var y = 0; y < Math.floor(512/r); y++) {
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
                colorArray[width + 1][2 * i][2 * j].forEach((e, i) => rgb[i] += e);
                colorArray[width + 1][2 * i][2 * j + 1].forEach((e, i) => rgb[i] += e);
                colorArray[width + 1][2 * i + 1][2 * j].forEach((e, i) => rgb[i] += e);
                colorArray[width + 1][2 * i + 1][2 * j + 1].forEach((e, i) => rgb[i] += e);
                rgb = rgb.map(e => Math.floor(e / 4));
                rowColors.push(rgb);
            }
            colColors.push(rowColors);
        }
        return colColors;
    }

    async function calcSmallestCircleColors() {

        await new Promise((resolve) => { corgi.onload = resolve; });
        console.log('loaded');
        const circles = Math.pow(2, layers)
        let colorArray = [];
        const width = corgi.width;
        const height = corgi.height;
        const canvas = document.getElementById('c');
        canvas.width = width;
        canvas.height = height;
        const corgiCanvas = canvas.getContext('2d', 'willReadFrequently');
        corgiCanvas.drawImage(corgi, 0, 0);
        console.log('drew');
        for (let i = 0; i < circles; ++i) {
            let lineColor = []
            const xoffset = Math.floor(i * width / circles);
            for (let j = 0; j < circles; ++j) {
                const yoffset = Math.floor(j * width / circles);
                let rgb = [0, 0, 0];

                let rgba = corgiCanvas.getImageData(
                    xoffset, yoffset, width/circles, height/circles
                ).data;
                rgb = rgb.map((e,i) => rgba.reduce((acc,el, ind) => ind % 4 === i ? acc + el: acc, 0))
                rgb = rgb.map(e => Math.floor(e /= Math.pow(Math.floor(corgi.width / circles), 2)));
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
console.log(colors());

