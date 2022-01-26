import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// typewriter
//   .typeString('A simple yet powerful native javascript')
//   .pauseFor(300)
//   .start();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Objects
 */
const objectsDistance = 4

// Material
const material = new THREE.MeshBasicMaterial({ color: '#ffffff', wireframe:true})

// Meshes

var mesh1 = new THREE.Object3D();
var loader = new STLLoader();

loader.load('head.stl', function ( geometry ) {

	const material1 = new THREE.MeshPhongMaterial( { color: 0xffffff} );
	mesh1 = new THREE.Mesh( geometry, material1 );

	mesh1.position.set( 0, 0, 0 );
	mesh1.rotation.set( -1.7,0,0 );
	mesh1.scale.set( 0.01, 0.01, 0.01);
    geometry.center();
    scene.add(mesh1);
	} );


var mesh2 = new THREE.Object3D();

loader.load('gear.stl', function ( geometry ) {

	const material2 = new THREE.MeshPhongMaterial( { color: 0xffffff} );
	mesh2 = new THREE.Mesh( geometry, material2 );

	mesh2.position.set( -1.5, - objectsDistance * 1, 0 );
	mesh2.rotation.set( 0,0,0 );
	mesh2.scale.set( 0.055, 0.055, 0.055);
    geometry.center();
    scene.add(mesh2);
	} );


    var mesh3 = new THREE.Object3D();

    loader.load('megaphone.stl', function ( geometry ) {
    
        const material3 = new THREE.MeshPhongMaterial( { color: 0xffffff} );
        mesh3 = new THREE.Mesh( geometry, material3 );
        mesh3.position.set( 1.5, - objectsDistance * 2, 0 );
        mesh3.rotation.set( 0,2,0 );
        mesh3.scale.set( 0.004, 0.004, 0.004);
        geometry.center();
        scene.add(mesh3);
        } );

const sectionMeshes = [mesh1,mesh2, mesh3 ]

scene.add(mesh1,mesh2,mesh3)

/**
 * Particles
 */
// Geometry
const particlesCount = 500
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * 3
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: '#ffeded',
    sizeAttenuation: true,
    size: 0.03
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)


const directionalLight2 = new THREE.DirectionalLight('#ffffff', 1)
directionalLight2.position.set(1,  - objectsDistance * 1, 0)
scene.add(directionalLight2)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection

        gsap.to(
            
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3'
            }
        )

        gsap.to(
            
            mesh1.rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                z: '+=3'
            }
        )

        gsap.to(
            
            mesh2.rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                z: '+=6',
                x: '+=3'
            }
        )

        gsap.to(
            
            mesh3.rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                z: '+=3',
                x: '+=3'
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

// const loader = new STLLoader();
//  loader.load( 'bird.stl', function ( geometry ) {
//  scene.add( new THREE.Mesh( geometry ) );
//  });

const light = new THREE.AmbientLight( 0x000000 ); // soft white light
light.position.x=10;
scene.add( light );





const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    particles.rotateY(0.005);
    mesh2.rotateZ(0.005);
    mesh2.rotateY(0.0025);
    mesh3.rotateY(0.005);
    mesh3.rotateZ(0.0025);

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
        mesh1.rotation.z += deltaTime * 0.1
    }

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    if (sizes.width<sizes.height) { 
        mesh1.position.z = 0;
        mesh1.position.x = 0;
        mesh1.position.y = 0.25;

        mesh3.position.y = - objectsDistance * 2 + 0.5;
        mesh3.position.x = 0;
        mesh3.position.z = 0;

        mesh2.position.y = - objectsDistance * 1 + 0.5;
        mesh2.position.x = 0;
        mesh2.position.z = 0;
  } else {
        mesh1.position.z = 0;
        mesh1.position.x = 1.5;
        mesh1.position.y = 0;
    
        mesh3.position.y = - objectsDistance * 2 ;
        mesh3.position.x = 1.5;
        mesh3.position.z = 0;
            
        mesh2.position.y = - objectsDistance * 1 ;
        mesh2.position.x = 1.5;
        mesh2.position.z = 0;
  }



    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()