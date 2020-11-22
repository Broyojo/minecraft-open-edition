import * as THREE from "../lib/three.module.js"
import {
    PointerLockControls
} from "../lib/PointerLockControls.js"
import Stats from "../lib/stats.module.js"
import buildChunkMesh from "./chunk.js"

let camera, scene, renderer
let stats, controls, socket

let moveFoward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let zoom = false

init()
draw()

function init() {
    // set up webgl renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // set up scene
    scene = new THREE.Scene()

    // set up camera
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000)
    camera.position.z = 2
    camera.getWorldDirection

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
    requestAnimationFrame(draw) // recursively call itself 60 times per second
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
        case "w":
            moveFoward = true
            break
        case "a":
            moveLeft = true
            break
        case "s":
            moveBackward = true
            break
        case "d":
            moveRight = true
            break
        case "c":
            zoom = true
            break
    }
}

document.onkeyup = (event) => {
    switch (event.key) {
        case "w":
            moveFoward = false
            break
        case "a":
            moveLeft = false
            break
        case "s":
            moveBackward = false
            break
        case "d":
            moveRight = false
            break
        case "c":
            zoom = false
            break
    }
}

function checkKeys() {
    let direction = new THREE.Vector3()
    camera.getWorldDirection(direction)
    if (moveFoward) {
        camera.position.add(direction)
    }

    if (moveLeft) {
        controls.moveRight(-1)
    }

    if (moveBackward) {
        camera.position.add(direction.multiplyScalar(-1))
    }

    if (moveRight) {
        controls.moveRight(1)
    }

    if (zoom) {
        camera.fov = 20
        camera.updateProjectionMatrix()
    } else {
        camera.fov = 90
        camera.updateProjectionMatrix()
    }
}