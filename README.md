# This project is a WIP. Nothing is finalized yet. 

## What is the point of this project?

It is to facilitate a free, open source, and unofficial version of Minecraft that is not governed by Microsoft or Mojang. Being open source, it can be better than the original Minecraft in every way, while staying free and secure. Plus, it runs in the browser so it is very easy for people to play it as their is no download required. This project is under the MIT license, contributions are welcome!

## Architecture (WIP)

The architecture of this game works as the following: It is split into two parts, the client and the server. The client handles rendering through three.js and implements movement, and other localized things. The server controls chunk generation and game logic and processing. Player data as well as chunk data is sent both ways through a websocket. Anyone can host a server and if anyone types the ip or domain name of the server into a web address in a browser, they can play on that server. 

## How do I run this project?
1. Clone this repository.
2. Make sure you have Go installed on your system (1.15.5 recommended): https://golang.org/dl/
3. Run the command `go run main.go` in the server directory. This will start the server.
4. Go to localhost:8080 in your favorite browser that supports WebGL (chrome, firefox, and edge will work).  
5. Enjoy!

The textures I am using for testing are Ewan Hwoell's great [f8thful textures](https://www.curseforge.com/minecraft/texture-packs/f8thful).

*I am not affiliated with Mojang or Microsoft in any way, shape, or form*
