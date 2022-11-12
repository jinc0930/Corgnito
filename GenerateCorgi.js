let images = ["Corgi_Fall.jpg", "Corgi_Toast.png"];
const img = "Image/" + images[Math.floor(Math.random()*images.length)];
const corgi = document.getElementById("pic")
corgi.src = img;
