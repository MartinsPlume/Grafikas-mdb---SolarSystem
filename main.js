var scene, camera, renderer;
var W, H;

var earthSpeed = 0.1;


var t = 0;


// izmērs
W = window.innerWidth;
H = window.innerHeight;

// tekstūru loader
var loader = new THREE.TextureLoader();

// kamera un scēna
camera = new THREE.PerspectiveCamera(45, W / H, 1, 10000000);

camera.position.z = 250000;
scene = new THREE.Scene();


var ambientLight = new THREE.AmbientLight('#f4dc42');
scene.add(ambientLight);


//saules virsma
var texture = loader.load('textures/2k_sun.jpg');
sunMaterial = new THREE.MeshPhongMaterial(
    {
        map: texture,
    });

// saule

sunObject = new THREE.Mesh(new THREE.SphereGeometry(1391, 100, 100), sunMaterial);
sunObject.castShadow = false;
sunObject.receiveShadow = false;
sunObject.add(ambientLight);
scene.add(sunObject);

// gaisma

//var lights = ["front", "back", "right", "left", "top", "under"];
//var lightDistance = 2000;

//for (i = 0; i < 6; i++) {
//    lights[i] = new THREE.PointLight('#ffffff', 0.4, 10000, 2);
//    lights[i].castShadow = true;
//    lights[i].shadow.mapSize.width = 2048;
//    lights[i].shadow.mapSize.height = 2048;
//}


//for (i = 0; i < 6; i++) {
//    scene.add(lights[i]);
//}

//lights[0].position.z = lightDistance;
//lights[1].position.z = -lightDistance;
//lights[2].position.x = lightDistance;
//lights[3].position.x = -lightDistance;
//lights[4].position.y = lightDistance;
//lights[5].position.y = -lightDistance;


// LENS FLARE
//createLensFlare();

var BrightStars = AddStars(1);
scene.add(BrightStars);
var DimStars = AddStars(0.4);
scene.add(DimStars);

// Zeme
var texture = loader.load('textures/earthmap1k.jpg');
Material = new THREE.MeshPhongMaterial(
    {
        map: texture,
    });
var earth = CreatePlanet(127, Material);
var earthLight = CreatePlanetLight();
scene.add(earth);
scene.add(earthLight);

texture = loader.load('textures/2k_moon.jpg');
Material = new THREE.MeshPhongMaterial(
    {
        map: texture,
    });
var moon = CreatePlanet(35, Material);
scene.add(moon);

// Mars
var texture = loader.load('textures/2k_mars.jpg');
Material = new THREE.MeshPhongMaterial(
    {
        map: texture,
    });
var mars = CreatePlanet(80, Material);
var marsLight = CreatePlanetLight();
scene.add(mars);
scene.add(marsLight);
var light = new THREE.PointLight(0xffffff, 1.4, 1000000, 2);
light.shadow.camera.far = camera.far;


init();

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

animate();
function animate() {
    requestAnimationFrame(animate);

    sunObject.rotation.y += 0.002;

    t += Math.PI / 180 * 2;
    PlanetMovement(earth, earthLight, 38750, 36250, earthSpeed);
    earth.rotation.y += 0.01;
    moon.position.x = Math.sin(t * earthSpeed) * 38750 + Math.sin(t * 1) * 192;
    moon.position.z = Math.cos(t * earthSpeed) * 36250 + Math.cos(t * 1) * 192;
    PlanetMovement(mars, marsLight, 55750, 53250, earthSpeed / 2);
    mars.rotation.y += 0.005;
    renderer.render(scene, camera); 
}

function CreatePlanet(radius, surface) {
    object = new THREE.Mesh(new THREE.SphereGeometry(radius, 100, 100), surface);
    object.castShadow = true;
    object.receiveShadow = true;
    return object;
}

function CreatePlanetLight() {
    planetLight = new THREE.PointLight('#ffffff', 0.4, 2000, 2);
    planetLight.castShadow = true;
    planetLight.shadow.mapSize.width = 2048;
    planetLight.shadow.mapSize.height = 2048;
    return planetLight;
}

function PlanetMovement(object, planetLight, distance1, distance2, speed) {
    object.position.x = Math.sin(t * speed) * distance1;
    object.position.z = Math.cos(t * speed) * distance2;
    planetLight.position.x = Math.sin(t * speed) * (distance1 - 1000);
    planetLight.position.z = Math.cos(t * speed) * (distance2 - 1000);
}

function AddStars(opacityRating) {
    // zvaigznes atradu tutoriali
    var starsGeometry = new THREE.Geometry();
    var starsMaterial = new THREE.PointsMaterial(
        {
            color: 0xbbbbbb,
            size: 1,
            sizeAttenuation: false,
            opacity: opacityRating
        });
    var stars;

    for (var i = 0; i < 100000; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar(100000);
        starsGeometry.vertices.push(vertex);
    }

    stars = new THREE.Points(starsGeometry, starsMaterial);
    stars.scale.set(150, 150, 150);
    return stars
}

function createLensFlare() {
    var light = new THREE.PointLight(0xffffff, 1.4, 100, 2);
    var textureFlare1 = loader.load("textures/lensflare0.jpg");
    var textureFlare2 = loader.load("textures/lensflare2.png");

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    light.castShadow = true;
    var lensflare = new THREE.Lensflare();

    lensflare.addElement(new THREE.LensflareElement(textureFlare1, 1371,10000));
    lensflare.addElement(new THREE.LensflareElement(textureFlare2, 500, 10000));

    light.add(lensflare);
    scene.add(light);
}