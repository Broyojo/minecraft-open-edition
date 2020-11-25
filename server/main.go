// server handles game logic and serving chunks to the client

package main

import (
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/Broyojo/minecraft-open-edition/server/engine/voxel"
	"github.com/gorilla/websocket"
)

var seed int64

func main() {
	rand.Seed(time.Now().UnixNano())
	seed = rand.Int63()
	http.Handle("/", http.FileServer(http.Dir("../client")))
	http.HandleFunc("/ws", serveWebsocket)
	log.Println("starting server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func serveWebsocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	for y := 0; y < 10; y++ {
		for x := 0; x < 20; x++ {
			for z := 0; z < 20; z++ {
				start := time.Now()
				c := voxel.NewChunk(x, y, z)

				//c.SimplexOctave3D(seed, 16, 0.05, 1, 0.5, 2)
				c.Map(func(x, y, z int) voxel.Block {
					return voxel.Dirt
				})
				//c.Blocks[0][0][0] = voxel.Dirt

				log.Println("took:", time.Since(start))
				if err := conn.WriteJSON(c); err != nil {
					log.Println(err)
					return
				}
			}
		}
	}
}
