package voxel

import noise "github.com/ojrac/opensimplex-go"

// ChunkSize - size of chunk on all sides
const ChunkSize = 16

// Chunk struct
type Chunk struct {
	X, Y, Z int
	Blocks  [ChunkSize][ChunkSize][ChunkSize]Block
}

// NewChunk - creates a new chunk pointer
func NewChunk(x, y, z int) *Chunk {
	var c Chunk
	c.X, c.Y, c.Z = x, y, z
	return &c
}

// Map - maps a function across all blocks
func (c *Chunk) Map(f func(x, y, z int) Block) {
	for x := 0; x < ChunkSize; x++ {
		for y := 0; y < ChunkSize; y++ {
			for z := 0; z < ChunkSize; z++ {
				c.Blocks[x][y][z] = f(x, y, z)
			}
		}
	}
}

// Simplex - generates the chunk with simplex noise
func (c *Chunk) Simplex(seed int64, freq, amp float64) {
	noise := noise.New(seed)
	c.Map(func(x, y, z int) Block {
		value := amp * noise.Eval3(float64(x+c.X*16)*freq, float64(y+c.Y*16)*freq, float64(z+c.Z*16)*freq)
		if value > 0.4 {
			return Dirt
		}
		return Air
	})
}

func (c *Chunk) SimplexOctave(seed int64, iter int, freq, amp, pers, lanc float64) {
	var data [ChunkSize][ChunkSize][ChunkSize]float64
	noise := noise.New(seed)
	for x := 0; x < ChunkSize; x++ {
		for y := 0; y < ChunkSize; y++ {
			for z := 0; z < ChunkSize; z++ {
				maxAmplitude, a, f := 0.0, amp, freq
				for i := 0; i < iter; i++ {
					data[x][y][z] += a * noise.Eval3(float64(x+c.X*16)*f, float64(y+c.Y*16)*f, float64(z+c.Z*16)*f)
					maxAmplitude += a
					a *= pers
					f *= lanc
				}
				data[x][y][z] /= maxAmplitude
			}
		}
	}

	c.Map(func(x, y, z int) Block {
		if data[x][y][z] > 0.2 {
			return Dirt
		}
		return Air
	})
}
