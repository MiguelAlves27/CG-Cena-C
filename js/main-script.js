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
let centralHight = 40;
let firstRingRadius = 50;
let secondRingRadius = 35;
let thirdRingRadius = 20;
let fourdRingRadius = 2;
let rings = [];
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
function createRings(){
    'use strict';

    // Definir altura dos anéis
    const ringHeights = [4, 4, 4]; // Altura de cada anel
    
    // Criar os anéis com altura
    const ringGeometries = ringHeights.map((height, i) => {
        const innerRadius = 2 + i * 5; // Raio interno dos anéis (aumenta com o índice)
        const outerRadius = innerRadius + 5 ; // Raio externo dos anéis
        const segments = 32; // Número de segmentos
    
        const shape = new THREE.Shape();
        shape.moveTo(outerRadius, 0);
        shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
        shape.holes.push(new THREE.Path().absarc(0, 0, innerRadius, 0, Math.PI * 2, true));
    
        const extrudeSettings = {
            steps: 1,
            depth: height,
            bevelEnabled: false
        };
    
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    });
    
    // Definir materiais dos anéis
    const ringMaterial = [
        new THREE.MeshBasicMaterial({ color: "#7a7676", side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ color: "#b36262", side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ color: "#548a8a", side: THREE.DoubleSide })];
    
    // Criar e adicionar os anéis à cena
    const ring = ringGeometries.map((geometry, i) => {
        const ring = new THREE.Mesh(geometry, ringMaterial[i]);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = (3-i)*ringHeights[i];
        scene.add(ring);
        rings.push(ring);
        return ring;
    });
    
}

function createCentralRing(){
    'use strict';
    const geometry = new THREE.CylinderGeometry(fourdRingRadius, fourdRingRadius, centralHight,1000);
    const material = new THREE.MeshStandardMaterial({color: 0x8bc0d4});
    const object = new THREE.Mesh(geometry, material);
    object.translateY(centralHight/2);
    scene.add(object);
}

////////////////////////
/* CREATE SKYDOME */
////////////////////////
function createSkydome() {
    'use strict';
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('sky.png', function(texture) {
        const geometry = new THREE.SphereGeometry(500, 60, 40);
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

    createRings();
    createCentralRing();
    createSkydome(); // Adiciona a skydome

}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    render();
    requestAnimationFrame(animate); // Corrige o ciclo de animação
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

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
}

init();
animate();
window.addEventListener('resize', onResize, false); // Adiciona evento de redimensionamento
