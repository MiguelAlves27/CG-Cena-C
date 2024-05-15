import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
let scene, cameraPerspetivaFixa, activeCamera, renderer;
let ringHight = 10;
let centralHight = 100;
let firstRingRadius = 50;
let secondRingRadius = 35;
let thirdRingRadius = 20;
let fourdRingRadius = 5;
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
    cameraPerspetivaFixa.position.set(100, 100, 0);
    cameraPerspetivaFixa.lookAt(scene.position);

    // Define a câmera ativa inicialmente como a câmera padrão
    activeCamera = cameraPerspetivaFixa;
}
/////////////////////
/* CREATE HELPERS */
/////////////////////
function createHelpers() {
    'use strict';
    const gridHelper = new THREE.GridHelper(200, 50)
    scene.add(gridHelper)
}
/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict';
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);
    directionalLight.position.set(10, 10, 10)
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.6);
    directionalLight2.position.set(-10, 10, -10)
    scene.add(directionalLight2);
}
////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createFirstRing(){
    'use strict';
    const geometry = new THREE.CylinderGeometry(firstRingRadius, firstRingRadius, ringHight,1000);
    const material = new THREE.MeshStandardMaterial({color: 0x8bc0d4});
    const object = new THREE.Mesh(geometry, material);
    object.translateY(ringHight/2);
    scene.add(object);
}

function createSecondRing(){
    'use strict';
    const geometry = new THREE.CylinderGeometry(secondRingRadius, secondRingRadius, ringHight,1000);
    const material = new THREE.MeshStandardMaterial({color: 0x8bc0d4});
    const object = new THREE.Mesh(geometry, material);
    object.translateY(ringHight/2 + ringHight);
    scene.add(object);
}


function createThirdtRing(){
    'use strict';
    const geometry = new THREE.CylinderGeometry(thirdRingRadius, thirdRingRadius, ringHight,1000);
    const material = new THREE.MeshStandardMaterial({color: 0x8bc0d4});
    const object = new THREE.Mesh(geometry, material);
    object.translateY(ringHight/2 + 2 * ringHight);
    scene.add(object);
}

function createFourdRing(){
    'use strict';
    const geometry = new THREE.CylinderGeometry(fourdRingRadius, fourdRingRadius, centralHight,1000);
    const material = new THREE.MeshStandardMaterial({color: 0x8bc0d4});
    const object = new THREE.Mesh(geometry, material);
    object.translateY(ringHight/2 + 3 * ringHight);
    scene.add(object);
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
    renderer.setSize(window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    createScene();
    createHelpers();
    createLights();
    createCameras();

    createFirstRing();
    createSecondRing();
    createThirdtRing();
    createFourdRing();

}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    render();

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
}

init();
animate();