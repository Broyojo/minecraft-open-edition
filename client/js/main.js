import * as THREE from "../lib/three.module.js"
import {
    OrbitControls,
} from "../lib/OrbitControls.js"
import Stats from "../lib/stats.module.js"
import buildChunkMesh from "./chunk.js"

const FOV = 75
let camera, scene, renderer
let stats, controls, socket

init()
draw()

function init() {
    // set up webgl renderer
    renderer = new THREE.WebGLRenderer({
        antialias: false
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // set up scene
    scene = new THREE.Scene()

    // set up camera
    camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 10000)
    camera.position.z = 2

    // set up controls
    controls = new OrbitControls(camera, renderer.domElement);

    // set up stats
    stats = new Stats()
    stats.showPanel(0)
    document.body.appendChild(stats.dom)

    // set up axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // set up socket
    socket = new WebSocket("ws://" + location.host + "/ws")
}

function draw() {
    requestAnimationFrame(draw) // recursively call itself 60 times per second

    controls.update()
    renderer.render(scene, camera)

    stats.update()
}

// scale camera and aspect ratio on resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

// do stuff when you get a message throught he socket
socket.onmessage = (event) => {
    const chunk = JSON.parse(event.data)
    //console.log(chunk)
    const mesh = buildChunkMesh(chunk, 16)
    scene.add(mesh)
}