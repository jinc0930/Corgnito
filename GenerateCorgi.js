let images = ["640x530.jpg", "Corgi_Blanket.jpeg", "Corgi_Eggtoast.png", "Corgi_Leash.jpeg", "Corgi_Toast.png", "Two_Corgi.png", "Toasts.png"];
const img = "Image/" + images[Math.floor(Math.random()*images.length)];
const corgi = document.createElement('img');
const width = 512;
const height = 512;
const max_layers= 8;
// pic.src = img;
corgi.src = img;
const c = document.getElementById("circle");
const ctx = c.getContext("2d");
let id = 0;

let circleArray = [];

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


function drawCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.fillStyle = convertRGBtoHex(color);
    ctx.fill();
    circleArray.push([x,y,r, id++]);
}

function convertRGBtoHex(color) {
    let R = color[0];
    let G = color[1];
    let B = color[2];
    if ((R >= 0 && R <= 255) && (G >= 0 && G <= 255) && (B >= 0 && B <= 255)) {
        return "#" + R.toString(16) + G.toString(16) + B.toString(16);
    }
    return "#000000";
}

async function colors() {
    let circleColors = new Array(max_layers+1);

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
        const circles = Math.pow(2, max_layers)
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
        for (let a = max_layers - 1; a >= 0; --a) {
            circleColors[a] = calcNextColors(a,circleColors);
        }
        return circleColors;
    }
    return await calcSmallestCircleColors().then(array => circleColors[max_layers] = array).then(() => doRest(circleColors));

}

async function drawCanvas() {
    const colorArray = await colors();
    function onMouseMove(event) {
        let mouse = getMousePos(c,event);
        const possibleCircles= circleArray.map(e=>e).filter(e => Math.abs(mouse.x - e[0]) < e[2] && Math.abs(mouse.y - e[1]) < e[2] && e[2] >= 4);
        if (circleArray.filter(e => Math.abs(mouse.x - e[0]) < e[2] && Math.abs(mouse.y - e[1]) < e[2] && e[2] > width/max_layers)) {
            if(circleArray.length) {
                const circle = possibleCircles.reduce((acc,e) => Math.pow(mouse.x - e[0],2) + Math.pow(mouse.y - e[1], 2) < Math.pow(e[2],2)? e: acc,[]);
                if (circle.length) {
                    const layer = Math.log2((width/2)/circle[2]);
                    const left = Math.floor((circle[0]  - circle[2])/(circle[2]));
                    const top = Math.floor((circle[1]  - circle[2])/(circle[2]));
                    circleArray = circleArray.filter(e => e[3] !== circle[3]);
                    ctx.clearRect(circle[0]- circle[2], circle[1]- circle[2], 2*circle[2], 2* circle[2]);
                    drawCircle(circle[0]- circle[2]/2, circle[1]- circle[2]/2, circle[2]/2, colorArray[layer+1][left][top]);
                    drawCircle(circle[0]- circle[2]/2, circle[1]+ circle[2]/2, circle[2]/2, colorArray[layer+1][left][top+1]);
                    drawCircle(circle[0]+ circle[2]/2, circle[1]- circle[2]/2, circle[2]/2, colorArray[layer+1][left+1][top]);
                    drawCircle(circle[0]+ circle[2]/2, circle[1]+ circle[2]/2, circle[2]/2, colorArray[layer+1][left+1][top+1]);
                }
            }
        }
    }
    c.addEventListener("mousemove", (event) => onMouseMove(event), false);
    drawCircle(Math.round(width/2), Math.round(width/2), Math.round(height/2),colorArray[0][0][0]);
}
drawCanvas();

