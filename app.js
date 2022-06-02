const contextSize = require('window-size')
const Jimp = require('jimp')
const { green } = require('colorette')

const ASCII_CHARS = '`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'

function getPixelBrightness(redPixel, greenPixel, bluePixel) {
    return (redPixel + greenPixel + bluePixel) / 3
}

function getAsciiCharacter(brightness) {
    return ASCII_CHARS.charAt(
        Math.trunc(brightness / 255 * ASCII_CHARS.length) - 1
    )
}

function printAsciiChar(asciiChar) {
    for (let i = 0; i < 3; i++) {
        process.stdout.write(asciiChar)
    }
}

// gets each pixel in the image and prints out its
// corresponding ascii char
async function generateAsciiArt(img) {
    img.scan(
        0,
        0,
        img.bitmap.width,
        img.bitmap.height,
        (x, y, idx) => printAsciiChar(
            green(
                getAsciiCharacter(
                    getPixelBrightness(
                        img.bitmap.data[idx + 0], // Red value of pixel
                        img.bitmap.data[idx + 1], // Green value of pixel
                        img.bitmap.data[idx + 2], // Blue value of pixel
                    )
                )
            )
        ),
    )
}

async function main() {
    try {
        const img = await Jimp.read('test-image.jpeg')
        await img.scaleToFit(
            contextSize.get().width,
            contextSize.get().height,
        )
        img.normalize()
        await generateAsciiArt(img)
    } catch(err) {
         throw err
    }
}

main().catch(err => console.log(err))