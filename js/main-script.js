import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
let scene, cameraPerspetivaFixa, activeCamera, renderer;
let ringHeight = 5;
let ringSegments = 100;
let firstRingRadius = 50;
let secondRingRadius = 35;
let thirdRingRadius = 20;
let centralHeight = 60;
let ringWidth = (firstRingRadius - secondRingRadius )/2;
let fourthRingRadius = thirdRingRadius - ringHeight;
let rings = [];
var keysPressed = {};
let ringSpeed = 0.2
let ring1Down = false;
let ring2Down = false;
let ring3Down = false;
let mobiusRadius = 10;
let mobiusWidth = 50;
let mobiusSegments = 100;
let mobiusStrip;
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
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.6);
    directionalLight2.position.set(-10, 10, -10);
    scene.add(directionalLight2);
}
////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

// Function to create a Möbius strip geometry
function createMoebiusStrip() {
    const mobiusRadius = 25; // Define your radius
    const mobiusWidth = 5; // Define your width
    const mobiusSegments = 100; // Define the number of segments

    let vertices = [];
    let indices = [];
    let phi = 0;
    let x, y, z;

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

    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, wireframe: false, side: THREE.DoubleSide });
    const mobiusStrip = new THREE.Mesh(geometry, material);
    mobiusStrip.position.set(0, 60, 0);
    mobiusStrip.rotation.x += Math.PI / 2;

    scene.add(mobiusStrip);
}

function createRings(){
    'use strict';

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
    let material = new THREE.MeshBasicMaterial({ color: "#548a8a", side: THREE.DoubleSide })
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
    let material2 = new THREE.MeshBasicMaterial({ color: "#54102a", side: THREE.DoubleSide })
    let mesh2 = new THREE.Mesh(geometry2, material2);

    mesh2.rotateX(Math.PI/2)
    ring2.add(mesh2);
    ring2.translateY(ringHeight);

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
    let material3 = new THREE.MeshBasicMaterial({ color: "#aaa02a", side: THREE.DoubleSide })
    let mesh3 = new THREE.Mesh(geometry3, material3);

    mesh3.rotateX(Math.PI/2)
    ring3.add(mesh3);
    ring3.translateY(ringHeight);

    rings = [ring, ring2, ring3]
    scene.add(ring, ring2, ring3);
}

function createCentralRing(){
    'use strict';
    const loader = new THREE.TextureLoader();
    loader.load('striped_texture.png', function(texture) {
        // Criar o material com a textura carregada
        const material = new THREE.MeshBasicMaterial({ map: texture });
        
        // Criar a geometria do cilindro
        const geometry = new THREE.CylinderGeometry(fourthRingRadius, fourthRingRadius, centralHeight,1000);
        
        // Criar o mesh do cilindro e adicionar à cena
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.translateY(centralHeight/2);
        scene.add(cylinder);
        rings.push(cylinder);   
    });
     
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

    createRings();
    createCentralRing();
    createSkydome(); // Adiciona a skydome
    createMoebiusStrip();

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
    rings[3].rotateY(ringSpeed/10);
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
