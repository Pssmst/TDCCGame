// Simple promise‐based wait
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)]
}

//////////////////////////////////////////////////////////////////////////////////////////////

let audioContext = null;
let audioUnlocked = false;

function initAudio() {
    if (!audioContext) {
        audioContext = new(window.AudioContext || window.webkitAudioContext)();
    }
}
initAudio();

function unlockAudio() {
    if (audioContext && audioContext.state === "suspended") {
        audioContext.resume().then(() => {
            audioUnlocked = true;
        });
    } else {
        audioUnlocked = true;
    }
    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
}
document.addEventListener("click", unlockAudio);
document.addEventListener("keydown", unlockAudio);

export function playSound(soundUrl, volume = .5, pitchVariance = 0) {
    if (!audioUnlocked) return;
    fetch(soundUrl)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            const gainNode = audioContext.createGain();
            gainNode.gain.value = volume;
            const pitch = 1 + (Math.random() * pitchVariance - pitchVariance / 2);
            source.playbackRate.value = pitch;
            source.connect(gainNode).connect(audioContext.destination);
            source.start(0);
        })
        .catch(err => console.error("Sound load/play error:", err));
}

//////////////////////////////////////////////////////////////////////////////////////////////

function getPlayerAttributes(prefix) {
    switch (prefix) {
        case "PP":
            return ["#00deb9", "brannonTalk.wav"];
        case "DX":
            return ["#99b5c2", "destinTalk.wav"];
        case "LR":
            return ["#4e63cc", "landonTalk.wav"];
        case "GB":
            return ["#ff5722", "garrettTalk.wav"];
        case "PR":
            return ["#11db18", "patrickTalk.wav"];
        case "KD":
            return ["#a35943", "clydeTalk.wav"]; // Kaydence
        default:
            return ["#ffffff", "talk.wav"];
    }
}

// Given a string (which may contain "\n"), return an array of wrapped lines
// so that each line’s width ≤ textboxWidth. Explicit "\n" forces a break.
function wrapText(ctx, text, fontSize, font, textboxWidth) {
    const wrapped = [];
    // First, remove the backslashes before splitting and measuring
    const textWithoutBackslashes = text.replace(/\\/g, "");
    const rawLines = textWithoutBackslashes.split("\n");

    ctx.font = fontSize + "px " + font;

    for (let i = 0; i < rawLines.length; i++) {
        const raw = rawLines[i];
        if (raw.trim() === "") {
            // Preserve empty lines
            wrapped.push("");
        } else {
            const words = raw.split(" ");
            let current = words[0];

            for (let w = 1; w < words.length; w++) {
                const word = words[w];
                const test = current + " " + word;

                if (ctx.measureText(test).width <= textboxWidth) {
                    current = test;
                } else {
                    wrapped.push(current);
                    current = word;
                }
            }
            wrapped.push(current);
        }
        // If not last raw line, force an empty line for the "\n"
        if (i < rawLines.length - 1) {
            wrapped.push("");
        }
    }
    return wrapped;
}

export function drawText(ctx, text, font="EightBitDragon", color="#ffffff", fontSize=16, x=20, y=20, verticalSpacing=1.4) {
    // Set font, baseline, and fill style once
    ctx.font = fontSize + "px " + font;
    ctx.textBaseline = "top";
    ctx.fillStyle = color;

    // Split the text by newline characters
    const lines = text.split('\n');

    // Draw each line
    for (let i = 0; i < lines.length; i++) {
        const lineY = y + i * fontSize * verticalSpacing;
        ctx.fillText(lines[i], x, lineY);
    }
}

export function getTextWidth(ctx, text, font, fontSize) {
    ctx.font = fontSize + "px " + font;
    const lines = text.split("\n");
    let maxWidth = 0;
    for (let i = 0; i < lines.length; i++) {
        const { width } = ctx.measureText(lines[i]);
        if (width > maxWidth) maxWidth = width;
    }
    return maxWidth;
}

export function drawLine(ctx, x1, y1, x2, y2, color = "#ffffff", lineWidth = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

export function drawRect(ctx, x, y, width, height, color = "#ffffff") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

export function handleDialog(
    ctx,
    dialog,
    x = 20,
    y = 20,
    textboxWidth = 400,
    textboxHeight = 200,
    borderStyle = 1,
    font = "EightBitDragon",
    fontSize = 16,
    speed = 30,
    padding = 20,
    verticalSpacingMultiplier = 1.4,
    scrollMode = false
) {
    return new Promise(resolve => {
        // Normalize dialog to array
        const blocks = Array.isArray(dialog) ? dialog : [dialog];
        let currentIndex = 0;
        let skip = false;
        const lineHeight = fontSize * verticalSpacingMultiplier;

        // Calculate inner box coords & size
        const innerX = x + padding;
        const innerY = y + padding;
        const innerW = textboxWidth - padding * 2;
        const innerH = textboxHeight - padding * 2;

        // Keep history if scrolling
        const history = [];

        function drawBorder() {
            // full background
            ctx.fillStyle = "black";
            ctx.fillRect(x, y, textboxWidth, textboxHeight);
            // border line
            if (borderStyle > 0) {
                ctx.lineWidth = borderStyle === 1 ? 4 : 1;
                ctx.strokeStyle = "white";
                ctx.strokeRect(x, y, textboxWidth, textboxHeight);
            }
        }

        function clearInner() {
            // wipe the inside area to black
            ctx.fillStyle = "black";
            ctx.fillRect(innerX - 1, innerY - 1, innerW + 2, innerH + 2);
        }

        function wrapText(text) {
            const words = text.split(" ");
            const lines = [];
            let line = words[0] || "";
            ctx.font = `${fontSize}px ${font}`;
            for (let i = 1; i < words.length; i++) {
                const test = `${line} ${words[i]}`;
                if (ctx.measureText(test).width <= innerW) {
                    line = test;
                } else {
                    lines.push(line);
                    line = words[i];
                }
            }
            lines.push(line);
            return lines;
        }

        function drawBlock(lines, color) {
            ctx.font = `${fontSize}px ${font}`;
            ctx.textBaseline = "top";

            // draw history if in scroll mode
            if (scrollMode && history.length) {
                const startY = innerY + innerH - history.length * lineHeight;
                history.forEach((ln, idx) => {
                    ctx.fillStyle = ln.color;
                    ctx.fillText(ln.text, innerX, startY + idx * lineHeight);
                });
            }

            // draw current lines
            ctx.fillStyle = color;
            lines.forEach((ln, idx) => {
                const yPos = innerY + idx * lineHeight;
                ctx.fillText(ln, innerX, yPos);
            });
        }

        async function typeBlock(text) {
            skip = false;
            const [color, soundFile] = getPlayerAttributes(text.slice(0, 2));
            let displayed = "";
            let lines = [];

            for (let i = 0; i < text.length; i++) {
                if (skip) break;
                displayed += text[i];
                lines = wrapText(displayed);

                // redraw border + inner every frame
                drawBorder();
                clearInner();
                drawBlock(lines, color);

                playSound(`../assets/sounds/${soundFile}`, .5, 0.05);
                await wait(speed);
            }

            if (skip) {
                lines = wrapText(text);
                drawBorder();
                clearInner();
                drawBlock(lines, color);
            }

            if (scrollMode) {
                history.push(...lines.map(l => ({
                    text: l,
                    color
                })));
            }
        }

        async function onEnter(e) {
            if (e.code !== "Enter") return;
            document.removeEventListener("keydown", onEnter);

            if (currentIndex < blocks.length) {
                await typeBlock(blocks[currentIndex]);
                currentIndex++;
                document.addEventListener("keydown", onEnter);
            } else {
                // done
                clearInner();
                resolve();
            }
        }

        // initial draw
        drawBorder();
        clearInner();

        document.addEventListener("keydown", e => {
            if (e.code === "KeyX") skip = true;
        });
        document.addEventListener("keydown", onEnter);

        // kick it off
        (async () => {
            await typeBlock(blocks[0]);
            currentIndex = 1;
        })();
    });
}