import * as THREE from "https://threejs.org/build/three.module.js"
import {
    PointerLockControls
} from "https://threejs.org/examples/jsm/controls/PointerLockControls.js"
import Stats from "https://mrdoob.github.io/stats.js/build/stats.module.js"
import buildChunkMesh from "./chunk.js"

let camera, scene, renderer
let stats, controls, socket

let direction = new THREE.Vector3()
let moveFoward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let moveUp = false
let moveDown = false
let zoom = false

init()
draw()

function init() {
    // set up webgl renderer
    renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "high-performance",
        gammaFactor: 2.2,
        outputEncoding: THREE.sRGBEncoding,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // set up scene
    scene = new THREE.Scene()

    // set up camera
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 2

    // set up controls
    controls = new PointerLockControls(camera, renderer.domElement)
    document.addEventListener("click", () => {
        controls.lock()
    }, false)

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
    requestAnimationFrame(draw)
    checkKeys()
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

document.onkeydown = (event) => {
    switch (event.key) {
        case "W":
        case "w":
            moveFoward = true
            break
        case "A":
        case "a":
            moveLeft = true
            break
        case "S":
        case "s":
            moveBackward = true
            break
        case "D":
        case "d":
            moveRight = true
            break
        case "C":
        case "c":
            zoom = true
            break
        case " ":
            moveUp = true
            break
        case "Shift":
            moveDown = true
            break
    }
}

document.onkeyup = (event) => {
    switch (event.key) {
        case "W":
        case "w":
            moveFoward = false
            break
        case "A":
        case "a":
            moveLeft = false
            break
        case "S":
        case "s":
            moveBackward = false
            break
        case "D":
        case "d":
            moveRight = false
            break
        case "C":
        case "c":
            zoom = false
            break
        case " ":
            moveUp = false
            break
        case "Shift":
            moveDown = false
            break
    }
}

function checkKeys() {
    camera.getWorldDirection(direction)
    if (moveFoward) {
        camera.position.x += direction.x * 2
        camera.position.z += direction.z * 2
    }

    if (moveLeft) {
        controls.moveRight(-2)
    }

    if (moveBackward) {
        camera.position.x -= direction.x * 2
        camera.position.z -= direction.z * 2
    }

    if (moveRight) {
        controls.moveRight(2)
    }

    if (zoom) {
        camera.fov = 20
        camera.updateProjectionMatrix()
    } else {
        camera.fov = 90
        camera.updateProjectionMatrix()
    }

    if (moveUp) {
        camera.position.y++
    }
    if (moveDown) {
        camera.position.y--
    }
}