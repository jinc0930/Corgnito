let images = ["Corgi_Fall.jpg", "Corgi_Toast.png", "Corgi_Blanket.jpeg", "Corgi_Eggtoast.png", "Corgi_Leash.jpeg", "Corgi_Run.jpeg"];
const img = "Image/" + images[Math.floor(Math.random()*images.length)];
const corgi = document.createElement("img")
corgi.src = img;

const c = document.getElementById("circle");
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
    for(var x = 0; x < Math.floor(corgi.width/r); x++) {
        for(var y = 0; y < Math.floor(corgi.height/r); y++) {
            drawCircle((2*x+1)*r, (2*y+1)*r, r, convertRGBtoHex(color[x][y]));
        }
    }   
}

function decToHexa(n)
{
    // char array to store hexadecimal number
    let hexaDeciNum = Array.from({length: 2}, (_, i) => 0);
    let i = 0;
    while (n != 0) {
        let temp = 0;
        temp = n % 16;
        if (temp < 10) {
            hexaDeciNum[i] = String.fromCharCode(temp + 48);
            i++;
        }
        else {
            hexaDeciNum[i] =  String.fromCharCode(temp + 55);
            i++;
        }
        n = Math.floor(n / 16);
    }
    let hexCode = "";
    if (i == 2) {
        hexCode+=hexaDeciNum[0];
        hexCode+=hexaDeciNum[1];
    }
    else if (i == 1) {
        hexCode = "0";
        hexCode+=hexaDeciNum[0];
    }
    else if (i == 0)
        hexCode = "00";
    
    return hexCode;
}
    
function convertRGBtoHex(color)
{
    let R = color[0];
    let G = color[1];
    let B = color[2];
    if ((R >= 0 && R <= 255) && (G >= 0 && G <= 255) && (B >= 0 && B <= 255)) {
        let hexCode = "#";
        hexCode += decToHexa(R);
        hexCode += decToHexa(G);
        hexCode += decToHexa(B);
    
        return hexCode;
    }
}
    
