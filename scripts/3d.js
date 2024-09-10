import * as THREE from "./three-module.js";

// TagCloud.js ESFERA
function setCanvas() {
  //labels
  const Texts = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];
  var width = document.getElementById("canvas").offsetWidth;
  // console.log(width);
  var options = {
    radius: width * 0.5,
    maxSpeed: "normal",
    initSpeed: "slow",
    direction: 605,
    fps: 60,
    keep: true,
    backgroungColor: "#FFFF",
    sort: "a-z",
  };
  //settings
  var tagCloud = TagCloud("#canvas", Texts, options);
}
setCanvas();

// Luego puedes llamar a la función setTagCloudRadius con el nuevo radio que desees
window.addEventListener("resize", () => {
  var element = document.getElementById("canvas");
  element.innerText = "";
  setCanvas();
  addImgs();
});

//Crear elemento donde van las imgs
function addImgs() {
  var tags = [];
  tags = document.querySelectorAll(".tagcloud--item");

  //Crear el array con las rutas de las imgs
  const imagenes = [
    "./Img`s/icons/css-3.png",
    "./Img`s/icons/Django-Logo.png",
    "./Img`s/icons/docker.png",
    "./Img`s/icons/fast.png",
    "./Img`s/icons/git.png",
    "./Img`s/icons/js.png",
    "./Img`s/icons/ts.png",
    "./Img`s/icons/firebase.png",
    "./Img`s/icons/htmx.png",
    "./Img`s/icons/linux.png",
    "./Img`s/icons/mysql.png",
    "./Img`s/icons/physics.png",
    "./Img`s/icons/piton.png",
    "./Img`s/icons/Three.js.png",
  ];

  for (var i = 0; i < tags.length; i++) {
    // tagArray.push(tags[i]);
    const img = document.createElement("img");
    img.src = imagenes[i];
    img.classList.add("img-canvas");
    tags[i].appendChild(img);
  }
}
addImgs();
////////////////////////////////////////////////////////

//THREE GEOMETRY

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
camera.position.x = 7;

// console.log(window.innerWidth)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const body = document.getElementById("back3d");
body.appendChild(renderer.domElement);

// Creamos el CUBO
const geometry = new THREE.IcosahedronGeometry(7, 5, 7);
const material = new THREE.MeshBasicMaterial({
  color: "#000",
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//  PUNTOS EN VERTICES
const positions = geometry.attributes.position.array;
const pointsGeometry = new THREE.BufferGeometry(1);
const pointsMaterial = new THREE.PointsMaterial({
  color: "#fff",
  size: 0.001,
  sizeAttenuation: true,
});
const points = new THREE.Points(pointsGeometry, pointsMaterial);
// Crear vector para almacenar los puntos
const vertices = [];
// Agregar puntos a los vértices
for (let i = 0; i < positions.length; i += 3) {
  const x = positions[i];
  const y = positions[i + 1];
  const z = positions[i + 2];
  vertices.push(new THREE.Vector3(x, y, z));
}
// Agregar puntos a la geometría
pointsGeometry.setFromPoints(vertices);
// Agregar puntos a la escena
scene.add(points);
// // Rotar el objeto Group en la función animate()
function animate() {
  requestAnimationFrame(animate);
  const position = cube.position;
  const quaternion = cube.quaternion;
  const scale = cube.scale;
  points.position.copy(position);
  points.quaternion.copy(quaternion);
  points.scale.copy(scale);
}
animate();

//LADOS DEL RENDER
const edges = new THREE.EdgesGeometry(geometry);
const edgesColor = new THREE.LineBasicMaterial({ color: "rgb(15, 15, 15 )" });
const edgesVar = new THREE.LineSegments(edges, edgesColor);
scene.add(edgesVar);

// Función para actualizar la posición de los bordes en cada cuadro de la animación
function updateEdgesPosition() {
  const position = cube.position;
  const quaternion = cube.quaternion;
  const scale = cube.scale;
  edgesVar.position.copy(position);
  edgesVar.quaternion.copy(quaternion);
  edgesVar.scale.copy(scale);
}

// Función para actualizar Three.js
function updateThree() {
  // Actualiza el tamaño del renderizador
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);

  // Actualiza la relación de aspecto de la cámara
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Renderiza la escena nuevamente
  renderer.render(scene, camera);
}

// Controlador de evento "resize"
window.addEventListener("resize", () => {
  let width = window.innerWidth;
  if (width % 10 === 0 ) { // Verifica si el ancho es múltiplo de 300
    console.log("Ancho es múltiplo de 300:", width);
    updateThree(); // Llama a la función para actualizar Three.js
  }
});


//Animacion de rotacion de la figura
const animate3 = function () {
  const clock = new THREE.Clock();
  requestAnimationFrame(animate3);
  cube.rotation.x += 0.0002;
  cube.rotation.y += 0.0002;
  cube.rotation.z += 0.0002;

  const delta = clock.getDelta();
  cube.rotation.x += 0.5 * delta;
  cube.rotation.y += 0.5 * delta;

  updateEdgesPosition();

  renderer.render(scene, camera);
};
animate3();
