import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
let scene, cameraPerspetivaFixa, activeCamera, renderer;
let directionalLight, ambientLight
let rings = [];
let shapes = [];
let ringHeight = 5;
let ringWidth = 10;
let ringSegments = 100;
let firstRingRadius = 55;
let secondRingRadius = 35;
let thirdRingRadius = 15;
let centralHeight = 50;
let fourthRingRadius = 5;
let ring1height = 0;
let ring2height = 0;
let ring3height = 0;
var keysPressed = {};
let ringSpeed = 0.2
let ring1Down = false;
let ring2Down = false;
let ring3Down = false;
let mobiusRadius = 10;
let mobiusWidth = 50;
let mobiusSegments = 100;
let mobiusStrip;
let rotationSpeed = 0.5;
/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#bdeaf2");
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';    

    // Câmera Perspectiva Fixa 
    cameraPerspetivaFixa = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    cameraPerspetivaFixa.position.set(100, 50, 0);
    cameraPerspetivaFixa.lookAt(scene.position);

    // Define a câmera ativa inicialmente como a câmera padrão
    activeCamera = cameraPerspetivaFixa;
}
/////////////////////
/* CREATE HELPERS */
/////////////////////
function createControls() {
    'use strict';
    const controls = new OrbitControls(activeCamera, renderer.domElement)
}

function createHelpers() {
    'use strict';
    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(gridHelper);
}
/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict';

    // Directional light setup
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0).normalize();
    scene.add(directionalLight);

    // Ambient light setup
    ambientLight = new THREE.AmbientLight(0xffa500, 0.2); // Low intensity orange light
    scene.add(ambientLight);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function getObjectHeight(object) {
    const box = new THREE.Box3().setFromObject(object);
    return box.max.y - box.min.y;
}

function createParametricShapes(matId) {
    let maxSize = 4;
    let minSize = 3;
    let radius = [firstRingRadius, secondRingRadius, thirdRingRadius];
    let material;

    if(matId == 0){
        material = new THREE.MeshLambertMaterial({ color: 0x00ff00, side: THREE.DoubleSide});
    }if(matId == 1){
        material = new THREE.MeshPhongMaterial({color: 0x0000ff, shininess: 100, specular: 0x555555, side: THREE.DoubleSide})
    }if(matId == 2){
        material = new THREE.MeshToonMaterial({color: 0xff0000, side: THREE.DoubleSide})
    }if(matId == 3){
        material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide})
    }if(matId == 4){
        material = new THREE.MeshStandardMaterial({color: 0xff0000, side: THREE.DoubleSide})
    }


    // Funções para diferentes superfícies paramétricas
    let parametricFunctions = [
        whitney,
        wave,
        parametricFunction2,
        parametricFunction3,
        parametricFunction4,
        parametricFunction5,
        parametricFunction6,
        parametricFunction7
    ];


    // Loop para cada anel
    for (let i = 0; i < radius.length; i++) {
        // Loop para cada superfície paramétrica
        for (let j = 0; j < parametricFunctions.length; j++) {
            let geometry = new ParametricGeometry(parametricFunctions[j], 25, 25);
            let parametricShape = new THREE.Mesh(geometry, material);

            // Dimensionar a superfície aleatoriamente
            let scale = Math.random() * (maxSize - minSize) + minSize;
            parametricShape.scale.set(scale, scale, scale);

            // Distribuir radialmente a cada 45 graus
            let angle = j * (Math.PI / 4);
            parametricShape.position.set(radius[i] * Math.sin(angle), getObjectHeight(parametricShape) / 2, radius[i] * Math.cos(angle));
            
            // Adicionar a superfície à lista de formas e ao anel correspondente
            shapes.push(parametricShape);
            rings[i].add(parametricShape);

            // Definir uma rotação constante
            let axis = new THREE.Vector3(0, 0.5, 0).normalize();
            let speed = Math.random() * 0.02 + 0.01; // Velocidade de rotação aleatória

            // Função de animação para a rotação
            function animate() {
                if(j%2==0){
                    parametricShape.rotateOnAxis(axis, speed);
                }
                else{
                    parametricShape.rotateOnAxis(axis, -speed);
                }
                requestAnimationFrame(animate);
            }
            animate();
        }
    }
}

// Função paramétrica 1: Whitney Umbrella
function whitney(u, v, target) {
    let x = u;
    let y = u * v;
    let z = v;
    target.set(x, y, z);
}

function wave(u, v, target) {
    const x = u * 3 - 2;
    const y = v * 3 - 2;
    const z = Math.sin(u * Math.PI * 4) * Math.sin(v * Math.PI * 4);
    target.set(x, y, z);
}


// Função paramétrica 2: Superfície de Hélice
function parametricFunction1(u, v, target) {
    let x = Math.sin(u) * Math.cos(v);
    let y = Math.sin(u) * Math.sin(v);
    let z = Math.cos(u) + v;
    target.set(x, y, z);
}

// Função paramétrica 3: Cilindro Hiperbólico
function parametricFunction2(u, v, target) {
    let x = Math.sinh(u);
    let y = v;
    let z = Math.cosh(u);
    target.set(x, y, z);
}

// Função paramétrica 4: Ondas Senoidais
function parametricFunction3(u, v, target) {
    let x = u;
    let y = Math.sin(u) * Math.cos(v);
    let z = Math.sin(u) * Math.sin(v);
    target.set(x, y, z);
}

// Função paramétrica 5: Paraboloide Hiperbólico
function parametricFunction4(u, v, target) {
    let x = u;
    let y = v;
    let z = u * u - v * v;
    target.set(x, y, z);
}

// Função paramétrica 6: Enneper's Surface
function parametricFunction5(u, v, target) {
    let x = u - (u * u * u) / 3 + u * v * v;
    let y = v - (v * v * v) / 3 + v * u * u;
    let z = u * u - v * v;
    target.set(x, y, z);
}

// Função paramétrica 7: Mobius Strip
function parametricFunction6(u, v, target) {
    u = u - 0.5; // Ajuste para centralizar a faixa
    let x = Math.cos(2 * Math.PI * u) * (1 + v * Math.cos(2 * Math.PI * u / 2));
    let y = Math.sin(2 * Math.PI * u) * (1 + v * Math.cos(2 * Math.PI * u / 2));
    let z = v * Math.sin(2 * Math.PI * u / 2);
    target.set(x, y, z);
}

// Função paramétrica 8: Hiperboloide de uma folha
function parametricFunction7(u, v, target) {
    let x = Math.cosh(u) * Math.cos(v);
    let y = Math.cosh(u) * Math.sin(v);
    let z = Math.sinh(u);
    target.set(x, y, z);
}



// Function to create a Möbius strip geometry
function createMoebiusStrip(matId) {
    const mobiusRadius = 25; // Define your radius
    const mobiusWidth = 5; // Define your width
    const mobiusSegments = 100; // Define the number of segments

    let vertices = [];
    let indices = [];
    let phi = 0;
    let x, y, z;

    let material;

    if(matId == 0){
        material = new THREE.MeshLambertMaterial({ color: 0x00aaa0, side: THREE.DoubleSide});
    }if(matId == 1){
        material = new THREE.MeshPhongMaterial({color: 0x0023ff, shininess: 100, specular: 0x555555, side: THREE.DoubleSide})
    }if(matId == 2){
        material = new THREE.MeshToonMaterial({color: 0xffff00, side: THREE.DoubleSide})
    }if(matId == 3){
        material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide})
    }if(matId == 4){
        material = new THREE.MeshStandardMaterial({color: 0xfdd930, side: THREE.DoubleSide})
    }

    for (let i = 0; i <= mobiusSegments; i++) {
        phi = i * 2 * Math.PI / mobiusSegments;

        x = (mobiusRadius + mobiusWidth / 2 * Math.cos(phi / 2)) * Math.cos(phi);
        y = (mobiusRadius + mobiusWidth / 2 * Math.cos(phi / 2)) * Math.sin(phi);
        z = mobiusWidth / 2 * Math.sin(phi / 2);
        vertices.push(x, y, z);

        x = (mobiusRadius - mobiusWidth / 2 * Math.cos(phi / 2)) * Math.cos(phi);
        y = (mobiusRadius - mobiusWidth / 2 * Math.cos(phi / 2)) * Math.sin(phi);
        z = -mobiusWidth / 2 * Math.sin(phi / 2);
        vertices.push(x, y, z);
    }

    for (let i = 0; i < mobiusSegments; i++) {
        indices.push(2 * i, 2 * i + 1, 2 * (i + 1));
        indices.push(2 * i + 1, 2 * (i + 1) + 1, 2 * (i + 1));
    }

    const mobiusGeometry = {
        vertices: vertices,
        indices: indices,
    };

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(mobiusGeometry.vertices, 3));
    geometry.setIndex(mobiusGeometry.indices);

    const mobiusStrip = new THREE.Mesh(geometry, material);
    mobiusStrip.position.set(0, 60, 0);
    mobiusStrip.rotation.x += Math.PI / 2;

    scene.add(mobiusStrip);
}

function createRings(matId){
    'use strict';

    let material;

    if(matId == 0){
        material = new THREE.MeshLambertMaterial({ color: 0x00aaa0, side: THREE.DoubleSide});
    }if(matId == 1){
        material = new THREE.MeshPhongMaterial({color: 0x0023ff, shininess: 100, specular: 0x555555, side: THREE.DoubleSide})
    }if(matId == 2){
        material = new THREE.MeshToonMaterial({color: 0xffff00, side: THREE.DoubleSide})
    }if(matId == 3){
        material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide})
    }if(matId == 4){
        material = new THREE.MeshStandardMaterial({color: 0xfdd930, side: THREE.DoubleSide})
    }

    let ring = new THREE.Object3D();

    let outer = new THREE.Shape();
    for (let i = 0; i <= ringSegments; i++) {
        let angle = (i / ringSegments) * Math.PI * 2;
        let x = Math.cos(angle) * (firstRingRadius + ringWidth);
        let y = Math.sin(angle) * (firstRingRadius + ringWidth);
        if (i === 0) {
            outer.moveTo(x, y);
        } else {
            outer.lineTo(x, y);
        }
    }

    // Create the inner shape and add it as a hole in the outer shape
    let inner = new THREE.Path();
    for (let i = 0; i <= ringSegments; i++) {
        let angle = (i / ringSegments) * Math.PI * 2;
        let x = Math.cos(angle) * (firstRingRadius - ringWidth);
        let y = Math.sin(angle) * (firstRingRadius - ringWidth);
        if (i === 0) {
            inner.moveTo(x, y);
        } else {
            inner.lineTo(x, y);
        }
    }

    outer.holes.push(inner);

    let extrudeSettings = {
        steps: 1,
        depth: ringHeight,
    };

    let geometry = new THREE.ExtrudeGeometry(outer, extrudeSettings);
    let mesh = new THREE.Mesh(geometry, material);

    mesh.rotateX(Math.PI/2)
    //mesh.translateZ(-5);
    ring.add(mesh);
    ring.translateY(ringHeight);

    let ring2 = new THREE.Object3D();

    let outer2 = new THREE.Shape();
    for (let i = 0; i <= ringSegments; i++) {
        let angle = (i / ringSegments) * Math.PI * 2;
        let x = Math.cos(angle) * (secondRingRadius + ringWidth);
        let y = Math.sin(angle) * (secondRingRadius + ringWidth);
        if (i === 0) {
            outer2.moveTo(x, y);
        } else {
            outer2.lineTo(x, y);
        }
    }

    // Create the inner shape and add it as a hole in the outer shape
    let inner2 = new THREE.Path();
    for (let i = 0; i <= ringSegments; i++) {
        let angle = (i / ringSegments) * Math.PI * 2;
        let x = Math.cos(angle) * (secondRingRadius - ringWidth);
        let y = Math.sin(angle) * (secondRingRadius - ringWidth);
        if (i === 0) {
            inner2.moveTo(x, y);
        } else {
            inner2.lineTo(x, y);
        }
    }
    
    outer2.holes.push(inner2);

    let geometry2 = new THREE.ExtrudeGeometry(outer2, extrudeSettings);
    let mesh2 = new THREE.Mesh(geometry2, material);

    mesh2.rotateX(Math.PI/2)
    ring2.add(mesh2);
    ring2.translateY(ringHeight + 2);

    let ring3 = new THREE.Object3D();

    let outer3 = new THREE.Shape();
    for (let i = 0; i <= ringSegments; i++) {
        let angle = (i / ringSegments) * Math.PI * 2;
        let x = Math.cos(angle) * (thirdRingRadius + ringWidth);
        let y = Math.sin(angle) * (thirdRingRadius + ringWidth);
        if (i === 0) {
            outer3.moveTo(x, y);
        } else {
            outer3.lineTo(x, y);
        }
    }

    // Create the inner shape and add it as a hole in the outer shape
    let inner3 = new THREE.Path();
    for (let i = 0; i <= ringSegments; i++) {
        let angle = (i / ringSegments) * Math.PI * 2;
        let x = Math.cos(angle) * (thirdRingRadius - ringWidth);
        let y = Math.sin(angle) * (thirdRingRadius - ringWidth);
        if (i === 0) {
            inner3.moveTo(x, y);
        } else {
            inner3.lineTo(x, y);
        }
    }
    
    outer3.holes.push(inner3);

    let geometry3 = new THREE.ExtrudeGeometry(outer3, extrudeSettings);
    let mesh3 = new THREE.Mesh(geometry3, material);

    mesh3.rotateX(Math.PI/2)
    ring3.add(mesh3);
    ring3.translateY(ringHeight + 4);

    rings = [ring, ring2, ring3]
    scene.add(ring, ring2, ring3);
}

function createCentralRing(matId){
    'use strict';
    
    let material;

    if(matId == 0){
        material = new THREE.MeshLambertMaterial({ color: 0x00aaa0, side: THREE.DoubleSide});
    }if(matId == 1){
        material = new THREE.MeshPhongMaterial({color: 0x0023ff, shininess: 100, specular: 0x555555, side: THREE.DoubleSide})
    }if(matId == 2){
        material = new THREE.MeshToonMaterial({color: 0xffff00, side: THREE.DoubleSide})
    }if(matId == 3){
        material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide})
    }if(matId == 4){
        material = new THREE.MeshStandardMaterial({color: 0xfdd930, side: THREE.DoubleSide})
    }

    // Criar a geometria do cilindro
    const geometry = new THREE.CylinderGeometry(fourthRingRadius, fourthRingRadius, centralHeight,1000);
    
    // Criar o mesh do cilindro e adicionar à cena
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.translateY(centralHeight/2);
    scene.add(cylinder);
    rings.push(cylinder);   

     
}

////////////////////////
/* CREATE SKYDOME */
////////////////////////
function createSkydome() {
    'use strict';
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('sky.png', function(texture) {
        const geometry = new THREE.SphereGeometry(90, 60, 40,  0, 2*Math.PI, 0, 0.5 * Math.PI);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });
        const skydome = new THREE.Mesh(geometry, material);
        skydome.scale.set(-1, 1, 1); // Inverte a esfera
        skydome.rotation.order = 'XZY'; // Ajusta a ordem de rotação para aplicar corretamente
        skydome.rotation.y = Math.PI / 2; // Rotaciona a skydome para alinhar corretamente a textura
        scene.add(skydome);
    });
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

///////////////////////
/*  HANDLE MOVEMENT  */
///////////////////////
function handleMovement() {
    'use strict';

    if (keysPressed['1']) {
        let position = rings[0].getWorldPosition(new THREE.Vector3());
        if(position.y < centralHeight && !ring1Down){
            rings[0].translateY(ringSpeed);
        }
        else{
            ring1Down = true;
            rings[0].translateY(-ringSpeed);
            if(position.y <= ringHeight){
                ring1Down = false;
            }
        }
    }
    if (keysPressed['2']) {
        let position = rings[1].getWorldPosition(new THREE.Vector3());
        if(position.y < centralHeight && !ring2Down){
            rings[1].translateY(ringSpeed);
        }
        else{
            ring2Down = true;
            rings[1].translateY(-ringSpeed);
            if(position.y <= ringHeight){
                ring2Down = false;
            }
        }
    }
    if (keysPressed['3']) {
        let position = rings[2].getWorldPosition(new THREE.Vector3());
        if(position.y < centralHeight && !ring3Down){
            rings[2].translateY(ringSpeed);
        }
        else{
            ring3Down = true;
            rings[2].translateY(-ringSpeed);
            if(position.y <= ringHeight){
                ring3Down = false;
            }
        }
    }
    if (keysPressed['d']){
        setTimeout(() => {
            directionalLight.visible = !directionalLight.visible;
        }, 100); // Tempo de atraso em milissegundos (100ms)
    }
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, activeCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    // Initialize renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createHelpers();
    createLights();
    createCameras();
    createControls();

    createRings(0); // Adiciona os Anéis
    createCentralRing(1); // Adiciona o Anel central (cilindro)
    createSkydome(); // Adiciona a skydome
    createMoebiusStrip(2); // Adiciona a Moebius Strip
    createParametricShapes(3);  // Adiciona as formas paramétricas

    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    render();
    requestAnimationFrame(animate); // Corrige o ciclo de animação
    handleMovement();
    if(rings[3]){
        rings[3].rotateY(ringSpeed/10);
    }
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';
    cameraPerspetivaFixa.aspect = window.innerWidth / window.innerHeight;
    cameraPerspetivaFixa.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    keysPressed[e.key.toLowerCase()] = true;
    const keyElement = document.querySelector(`#hud .key[data-key="${e.key.toUpperCase()}"]`);
    if (keyElement) {
        keyElement.classList.add('active');
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
    'use strict';
    keysPressed[e.key.toLowerCase()] = false;

    const keyElement = document.querySelector(`#hud .key[data-key="${e.key.toUpperCase()}"]`);
    if (keyElement) {
        keyElement.classList.remove('active');
    }
}

init();
animate();
