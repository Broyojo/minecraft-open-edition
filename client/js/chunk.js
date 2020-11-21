import * as THREE from "../lib/three.module.js"

const texture = new THREE.TextureLoader().load("../assets/gold_ore.png")
texture.minFilter = THREE.NearestMipMapNearestFilter
texture.magFilter = THREE.NearestFilter
texture.generateMipmaps = true

const blockDirections = [
    [0, 0, 1], // front
    [0, 0, -1], // back
    [0, 1, 0], // top
    [0, -1, 0], // bottom
    [-1, 0, 0], // left
    [1, 0, 0], // right
]

const blockFaces = [
    [
        // front
        [0, 0, 1],
        [1, 0, 1],
        [0, 1, 1],
        [1, 1, 1],
    ],
    [
        // back
        [1, 0, 0],
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
    ],
    [
        // top
        [0, 1, 1],
        [1, 1, 1],
        [0, 1, 0],
        [1, 1, 0],
    ],
    [
        // bottom
        [1, 0, 1],
        [0, 0, 1],
        [1, 0, 0],
        [0, 0, 0],
    ],
    [
        // left
        [0, 1, 0],
        [0, 0, 0],
        [0, 1, 1],
        [0, 0, 1],
    ],
    [
        // right
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 0],
        [1, 0, 0],
    ],
]

const blockUVs = [
    [
        // front
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
    ],
    [
        // back
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
    ],
    [
        // top
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
    ],
    [
        // bottom
        [1, 1],
        [0, 1],
        [1, 0],
        [0, 0],
    ],
    [
        // left
        [0, 1],
        [0, 0],
        [1, 1],
        [1, 0],
    ],
    [
        // right
        [0, 1],
        [0, 0],
        [1, 1],
        [1, 0],
    ],
]

export default function buildChunkMesh(chunk, size) {
    const hasNeighbor = function (x, y, z, dir) {
        x += dir[0]
        y += dir[1]
        z += dir[2]

        if (x < 0 || x > size - 1 || y < 0 || y > size - 1 || z < 0 || z > size - 1) {
            return false
        }

        return chunk.Blocks[x][y][z] != 0
    }

    const start = performance.now()
    let positions = []
    let indices = []
    let normals = []
    let uvs = []

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            for (let z = 0; z < size; z++) {
                if (chunk.Blocks[x][y][z]) {
                    for (let i = 0; i < 6; i++) {
                        if (!hasNeighbor(x, y, z, blockDirections[i])) {
                            const offset = positions.length / 3
                            for (let j = 0; j < 4; j++) {
                                positions.push(blockFaces[i][j][0] + x + chunk.X * 16, blockFaces[i][j][1] + y + chunk.Y * 16, blockFaces[i][j][2] + z + chunk.Z * 16)
                                normals.push(...blockDirections[i])
                                uvs.push(...blockUVs[i][j])
                            }
                            indices.push(offset, offset + 1, offset + 2, offset + 2, offset + 1, offset + 3)
                        }
                    }
                }
            }
        }
    }

    //console.log("Took: " + (performance.now() - start).toString() + "ms to build mesh")

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3))
    geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3))
    geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2))
    geometry.setIndex(indices)

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        wireframe: false
    })
    const mesh = new THREE.Mesh(geometry, material)
    return mesh
}