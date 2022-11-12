let images = ["Corgi_Fall.jpg", "Corgi_Toast.png"];
const img = "Image/" + images[Math.ceil(Math.random()*images.length)];
document.getElementById("pic").src = img;