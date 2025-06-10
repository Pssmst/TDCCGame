import { handleDialog, drawText, drawRect, drawLine, playSound, getTextWidth, randomChoice } from './dialog.js';

const font = "EightBitDragon";

function formatTargetNames(targets) {
    if (targets.length === 1) return targets[0].name;
    if (targets.length === 2) return `${targets[0].name} and ${targets[1].name}`;
    if (targets.length > 2) {
        const last = names.pop();
        return `${names.join(", ")}, and ${last}`;
    }
}

const textures = {
    'frame':            "../assets/textures/battle/frame.png",
    'frameBeam':        "../assets/textures/battle/frameBeam.png",

    'symbolLandon':     "../assets/textures/battle/symbolLandon.png",
    'symbolDestin':     "../assets/textures/battle/symbolDestin.png",
    'symbolBrannon':    "../assets/textures/battle/symbolBrannon.png",
    'symbolGarrett':    "../assets/textures/battle/symbolGarrett.png",
    
    'destinCharge0':    "../assets/textures/battle/bars/destinCharge0.png",
    'destinCharge1':    "../assets/textures/battle/bars/destinCharge1.png",
    'destinCharge2':    "../assets/textures/battle/bars/destinCharge2.png",
    'destinCharge3':    "../assets/textures/battle/bars/destinCharge3.png",

    'menuAttack':       "../assets/textures/battle/menu/menuAttack.png",
    'menuAttackLandon': "../assets/textures/battle/menu/menuAttackLandon.png",
    'menuAttackBrannon':"../assets/textures/battle/menu/menuAttackBrannon.png",
    'menuAttackGarrett':"../assets/textures/battle/menu/menuAttackGarrett.png",

    'menuSpell':        "../assets/textures/battle/menu/menuSpell.png",
    'menuSpellDestin':  "../assets/textures/battle/menu/menuSpellDestin.png",

    'menuAct':          "../assets/textures/battle/menu/menuAct.png",
    'menuActLandon':    "../assets/textures/battle/menu/menuActLandon.png",
    'menuActDestin':    "../assets/textures/battle/menu/menuActDestin.png",
    'menuActBrannon':   "../assets/textures/battle/menu/menuActBrannon.png",
    'menuActGarrett':   "../assets/textures/battle/menu/menuActGarrett.png",

    'menuItem':         "../assets/textures/battle/menu/menuItem.png",
    'menuItemLandon':   "../assets/textures/battle/menu/menuItemLandon.png",
    'menuItemDestin':   "../assets/textures/battle/menu/menuItemDestin.png",
    'menuItemBrannon':  "../assets/textures/battle/menu/menuItemBrannon.png",
    'menuItemGarrett':  "../assets/textures/battle/menu/menuItemGarrett.png",

    'menuDefend':       "../assets/textures/battle/menu/menuDefend.png",
    'menuDefendLandon': "../assets/textures/battle/menu/menuDefendLandon.png",
    'menuDefendDestin': "../assets/textures/battle/menu/menuDefendDestin.png",
    'menuDefendBrannon':"../assets/textures/battle/menu/menuDefendBrannon.png",
    'menuDefendGarrett':"../assets/textures/battle/menu/menuDefendGarrett.png",
};

/**
 * battle: Initializes a battle scene with player and enemy names.
 *
 * @param {string|string[]} players – Array of player names
 * @param {string|string[]} enemies – Array of enemy names
 */
export function battle(canvas, uiCanvas, players, enemies) {
    const ctx = canvas.getContext("2d");
    const uiCtx = uiCanvas.getContext("2d", { alpha: true });

    // Attempt to play audio as soon as possible, but browsers may block autoplay until user interaction.
    function tryPlayBattleMusic() {
        //playSound("../assets/sounds/songs/A Battle is Afoot!.wav", .5, 0);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", tryPlayBattleMusic);
    } else {
        tryPlayBattleMusic();
    }
    // To ensure playback on browsers that block autoplay, also listen for a user gesture:
    document.addEventListener("pointerdown", tryPlayBattleMusic, { once: true });
    document.addEventListener("keydown", tryPlayBattleMusic, { once: true });

    // Player (x,y) display variables
    const ANGLE = 24 * Math.PI / 180; // DEGREES * Math.PI / 180
    const X_OFFSET = 30;
    const HIGHEST_VERTICAL_END = 60;
    const LOWEST_VERTICAL_END = 240;

    // Menu navigation variables
    let menuMode = 0;
    let selectedPlayer = 0;
    let selectedOption = -1;
    let selectedOption2 = -1;
    let choice;
    let targetEnemy = -1;
    let targetPlayer = -1;
    let sequence = [];
    let drawingDialog = false;
    let goodToGo = true;
    let barCrush = 1;

    // Customizable menu variables
    const fontSize = 18;
    const healthColor = "#38b045";
    const healthLostColor = "#c43127";
    const playerNamesX = 80;
    const playerNamesY = 326;
    const healthTextWidth = 54;
    const barDistanceFromPlayerNamesX = 100;
    const endOfFrameX = 34 + 284*2 - 10;

    function ease(current, target, easeFactor) {
        return current + (target - current) * easeFactor;
    }

    function getPlayerColors(playerSelected) {
        switch (playerSelected) {
            //               main       charge     charge1    charge2    charge3
            case 0: return ["#3f51b5", "#054007", "#12b212", "#78d408", "#cbdc11"]; // Landon
            case 1: return ["#607d8b", "#0b3f66", "#0f78c8", "#01acf2", "#01acf2"]; // Destin
            case 2: return ["#009688", "#023b35", "#01acf2", "#17c47e", "#20e677"]; // Brannon
            case 3: return ["#ff5722", "#6e0d0d", "#b70a0a", "#fa3719", "#fe5721"]; // Garrett
            default: return ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]; // Default color
        }
    }

    function getOptionChoice(selectedOption) {
        switch (selectedOption) {
            case 0: // Attack
                return players[selectedPlayer].attacks;
            case 1: // Act
                return players[selectedPlayer].actions;
            case 2: // Item
                return players[selectedPlayer].inventory.consumables;
                break;
        }
    }

    function optionsGrid(array, maxRows, maxCols, tableW, tableH, startX, startY, listAmount = false) {
        const cellW = tableW / maxCols;
        const cellH = tableH / maxRows + ((tableH/maxRows - fontSize)/maxRows);

        // 3) Loop over each object in the array (stop if we exceed maxRows×maxCols)
        array.forEach((obj, index) => {
            if (index >= maxRows * maxCols) return; // No more room in the grid

            // Compute 0‐based row and column from the 1D index
            const row = Math.floor(index / maxCols);
            const col = index % maxCols;

            // Top‐left corner of this cell:
            const cellX = startX + col * cellW;
            const cellY = startY + row * cellH;

            /*// Debug
            drawRect(ctx, cellX, cellY, cellW, 1, "#ff0000");             // top edge
            drawRect(ctx, cellX, cellY + cellH - 1, cellW, 1, "#ff0000"); // bottom edge
            drawRect(ctx, cellX, cellY, 1, cellH, "#ff0000");             // left edge
            drawRect(ctx, cellX + cellW - 1, cellY, 1, cellH, "#ff0000"); // right edge

            ctx.lineWidth = 1;
            ctx.strokeStyle = "green";
            ctx.strokeRect(startX, startY, tableW, tableH); // draw table border*/

            const txtColor = (selectedOption2 === index) ? getPlayerColors(selectedPlayer)[0] : "#ffffff";

            let name;

            if (obj.amount && obj.amount > 1) {
                name = `${obj.name} (${obj.amount})`;
                if (getTextWidth(ctx, name, font, fontSize) >= cellW-5) {
                    name = `${obj.abbreviatedName} (${obj.amount})`;
                }
            }
            else {
                name = obj.name;
                if (getTextWidth(ctx, name, font, fontSize) >= cellW-5) {
                    name = obj.abbreviatedName;
                }
            }

            drawText(ctx, name, font, txtColor, fontSize, cellX, cellY);
        });
    }

    async function executeSequence() {
        // Loop through each queued step one at a time
        drawingDialog = true;
        for (let [actor, action, targets] of sequence) {
            action.execute(actor, targets);

            const beamX = healthScaleFormula(Math.max(...players.map(player => player.maxHP))) + playerNamesX + barDistanceFromPlayerNamesX + healthTextWidth;

            const textBoxW = 272 * 2;
            const textBoxH = 62 * 2;
            const textBoxY = 298 + 16;

            await handleDialog(
                uiCtx,
                `${actor.name.toUpperCase()} uses ${action.name.toUpperCase()} on ${formatTargetNames(targets).toUpperCase()}!`,
                beamX,
                textBoxY,
                textBoxW,
                textBoxH,
                0,
                font,
                fontSize,
                12
            );
        }
        // Once all steps are done
        uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
        drawingDialog = false;
        sequence = [];
    }

    let texturesLoaded = false;
    const cache = {};
    
    // Preload all textures into cache
    function preloadImages(callback) {
        let count = 0;
        const keys = Object.keys(textures);
        keys.forEach(key => {
            const texture = new Image();
            texture.src = textures[key];
            texture.onload = () => {
                cache[key] = texture;
                count++;
                if (count === keys.length) {
                    texturesLoaded = true;
                    callback();
                }
            };
            texture.onerror = () => {
                throw new Error(`Image loading error: ${textures[key]}`);
            };
        });
    }

    function healthScaleFormula(health) {
        return (7*Math.sqrt(health)-5)/barCrush;
    }

    function draw() {
        if (!texturesLoaded) return;
        ctx.clearRect(0, 0, 680, 480); // Clear canvas

        // Move bars over with largest health
        const largestBarWidth = healthScaleFormula(Math.max(...players.map(player => player.maxHP)));
        const beamX = largestBarWidth + playerNamesX + barDistanceFromPlayerNamesX + healthTextWidth;
        const menuOptionsX = beamX + 16;
        goodToGo = !sequence.some(entry => entry[3] == selectedPlayer);

        // Draw menu frame and beam
        ctx.drawImage(cache.frame, 34, 298, 284*2, 78*2);
        ctx.drawImage(cache.frameBeam, beamX, 298+16, 4*2, 62*2);

        // FOR EACH PLAYER
        players.forEach((player, index) => {
            const barWidth = healthScaleFormula(player.maxHP);
            if (selectedOption != 3) {
                barCrush = ease(barCrush, (menuMode < 2) ? 1 : 2, 0.01);
            }

            const playerColor = sequence.some(entry => entry[0] === player) ? "#383838" : selectedPlayer === index ? getPlayerColors(selectedPlayer)[0] : "#ffffff";
            const universalY = playerNamesY + 28*index;

            if (player.charge > player.maxCharge) {
                player.charge = player.maxCharge; // Clamp charge to maxCharge
            }
            if (player.charge < 0) {
                player.charge = 0; // Clamp charge to 0
            }
            if (player.hp > player.maxHP) {
                player.hp = player.maxHP; // Clamp hp to maxHP
            }
            if (player.maxHP < 1) {
                player.maxHP = 1; // Clamp hp to 0
            }

            // Draw player symbol
            if (selectedPlayer === index && !drawingDialog) {
                ctx.drawImage(cache[`symbol${player.name}`], playerNamesX-26, universalY - 2, 20, 20);
            }

            // Draw name of player
            drawText(ctx, player.name.toUpperCase(), font, playerColor, fontSize, playerNamesX, universalY);

            // Draw health
            const healthRemainingWidth = barWidth * (player.hp / player.maxHP);
            const barStartX = playerNamesX + barDistanceFromPlayerNamesX;
            const barEndX = barStartX + largestBarWidth;
            const barY = universalY + 11;
            const lostHealthStartX = barStartX + healthRemainingWidth;
            
            if (player.hp > 0) drawRect(ctx, barStartX, universalY, healthRemainingWidth, 8, healthColor);
            drawRect(ctx, lostHealthStartX, universalY, barWidth - healthRemainingWidth, 8, healthLostColor);
            
            if (index != 1) {
                // background (empty) bar
                drawRect(ctx, barStartX, barY, barWidth, 5, getPlayerColors(players.indexOf(player))[1]);

                // Create a 3‐stop gradient over the *entire* bar width:
                const grad = ctx.createLinearGradient(barStartX, barY, barStartX + barWidth, barY);
                grad.addColorStop(0, getPlayerColors(players.indexOf(player))[2]);   // leftmost
                grad.addColorStop(0.5, getPlayerColors(players.indexOf(player))[3]); // middle
                grad.addColorStop(1, getPlayerColors(players.indexOf(player))[4]);   // rightmost

                // Fill only the “filled” portion with that gradient:
                ctx.fillStyle = grad;
                ctx.fillRect(barStartX, barY, barWidth * (player.charge / player.maxCharge), 5);
            }
            else {
                let destinBarWidth = barWidth < 44 ? barWidth : 44;
                ctx.drawImage(cache[`destinCharge${player.charge}`], barStartX + barWidth - destinBarWidth + 2, universalY + 4, destinBarWidth, 12);
            }

            const healthStr = `${String(player.hp)}/${String(player.maxHP)}`;
            const chargeStr = player.name == "Destin" ? `${player.charge}/${player.maxCharge}` : `${String(Math.round(player.charge/player.maxCharge*100))}%`;
            const trueHealthTextWidth = getTextWidth(ctx, healthStr, font, 16)/2;
            const trueChargeTextWidth = getTextWidth(ctx, chargeStr, font, 16)/2;

            // Draw health numbers
            drawText(ctx, healthStr, 'm5x7', player.hp > 0 ? playerColor : "#ff0000", 16, barEndX + (beamX - barEndX - trueHealthTextWidth) / 2 + 1, universalY - 5);

            // Draw charge numbers
            drawText(ctx, chargeStr, 'm5x7', playerColor, 16, barEndX + (beamX - barEndX - trueChargeTextWidth) / 2 + 1, universalY + 4);
        });

        // Draw selected things
        const nameInfos = players.map(({ name }) => name);
        const optionInfos = [(selectedPlayer === 1 ? "Spell" : "Attack"), "Act", "Item", "Defend"];

        if (menuMode < 2) {
            optionInfos.forEach((name, index) => {
                ctx.drawImage(
                    menuMode === 0 ? cache[`menu${name}`] : (selectedOption === index ? cache[`menu${name}${nameInfos[selectedPlayer]}`] : cache[`menu${name}`]),
                    menuOptionsX,
                    playerNamesY + 28*index - 4,
                    24, 24
                );

                drawText(
                    ctx, 
                    name.toUpperCase(),
                    font,
                    selectedOption === index ? getPlayerColors(selectedPlayer)[0] : "#ffffff",
                    fontSize,
                    menuOptionsX + 32,
                    playerNamesY + 28*index
                );
            });
        }

        // Selecting attacks / acts / etc
        else if (menuMode === 2) {
            const gridPadding = 30;
            const gridWidth = endOfFrameX - beamX - gridPadding*1.75;
            const gridHeight = 104;
            const gridX = beamX + gridPadding;

            switch (selectedOption) {
                case 0: // Attack
                    optionsGrid(players[selectedPlayer].attacks, 4, 2, gridWidth, gridHeight, gridX, playerNamesY);
                    break;
                
                case 1: // Act
                    optionsGrid(players[selectedPlayer].actions, 4, 2, gridWidth, gridHeight, gridX, playerNamesY);
                    break;

                case 2: // Item
                    optionsGrid(players[selectedPlayer].inventory?.consumables, 4, 2, gridWidth, gridHeight, gridX, playerNamesY, true);
                    break;

                case 3: // Defend
                    sequence.push([players[selectedPlayer], players[selectedPlayer].defend[0], [players[selectedPlayer]], selectedPlayer, selectedOption, selectedOption2]);
                    menuMode = 0;
                    selectedOption = -1;
                    break;
            }
        }

        /*// DEBUG
        drawLine(ctx, 0-X_OFFSET, 480, 480*Math.tan(ANGLE)-X_OFFSET, 0, "#ffffff", 2);
        drawLine(ctx, 640+X_OFFSET, 480, 640 - 480*Math.tan(ANGLE)+X_OFFSET, 0, "#ffffff", 2);
        
        const debugText = `menuMode: ${menuMode}\nselectedPlayer: ${selectedPlayer}\nselectedOption: ${selectedOption}\nselectedOption2: ${selectedOption2}\ntargetEnemy: ${targetEnemy}\ntargetPlayer: ${targetPlayer}\n\nEnemy Health: ${enemies[0].hp}`;
        drawText(ctx, debugText, 'm5x7', "white", fontSize, 5, 0, .7); //*/

        const squareSize = 50; // Uhhh

        // calculate your endpoints once
        const xHigh = (480 - HIGHEST_VERTICAL_END) * Math.tan(ANGLE) - X_OFFSET;
        const yHigh = HIGHEST_VERTICAL_END;
        const xLow  = (480 - LOWEST_VERTICAL_END)  * Math.tan(ANGLE) - X_OFFSET;
        const yLow  = LOWEST_VERTICAL_END;
        const n = players.length;

        ctx.save();
        for (let i = 0; i < n; i++) {
            // t runs from 0 (first item) to 1 (last item)
            const t = n > 1 ? i / (n - 1) : 0.5;

            // interpolate
            const x = xHigh + (xLow - xHigh) * t;
            const y = yHigh + (yLow - yHigh) * t;

            const color = ["red", "blue", "green", "orange"][i % 4];

            // center the square at (x,y)
            drawRect(ctx, x - squareSize / 2, y - squareSize / 2, squareSize, squareSize, color);
        }
        ctx.restore();

        // mirror endpoints for the right line
        const xHighR = 640 - xHigh;
        const xLowR = 640 - xLow;
        const m = enemies.length;

        ctx.save();
        for (let j = 0; j < m; j++) {
            // t from 0→1 inclusive so first enemy at (xHighR,yHigh), last at (xLowR,yLow)
            const t = m > 1 ? j / (m - 1) : 0.5;

            // interpolate along the right line
            const xE = xHighR + (xLowR - xHighR) * t;
            const yE = yHigh + (yLow - yHigh) * t;

            // pick a color for each enemy (customize as needed)
            const eColor = ["magenta", "yellow", "cyan", "white"][j % 4];

            // draw a square centered at (xE,yE)
            drawRect(ctx, xE - squareSize / 2, yE - squareSize / 2, squareSize, squareSize, eColor);
        }
        ctx.restore();
    }

    // Single animation loop
    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    // Kick everything off: preload textures, then start loop
    preloadImages(() => {
        requestAnimationFrame(animate);
    });

    document.addEventListener("keydown", event => {
        if (
            ["ArrowUp", "ArrowDown"].includes(event.code)
            || (menuMode === 2 && ["ArrowLeft", "ArrowRight"].includes(event.code))
        ) {
            playSound(`../assets/sounds/select.wav`, .5, 0.01);
        }
        if (menuMode < 4 && ["KeyZ", "Enter"].includes(event.code) && goodToGo) {
            playSound(`../assets/sounds/popup.wav`, .5, 0.01);
        }
        if (menuMode > 0 && ["KeyX", "Escape"].includes(event.code)) {
            playSound(`../assets/sounds/popdown.wav`, .5, 0.01);
        }

        if (menuMode === 0) {
            if (event.code === "ArrowUp") {
                selectedPlayer = (selectedPlayer - 1 + players.length) % players.length;
            } else if (event.code === "ArrowDown") {
                selectedPlayer = (selectedPlayer + 1) % players.length;
            }
        }

        else if (menuMode === 1) {
            if (event.code === "ArrowUp") {
                selectedOption = (selectedOption - 1 + 4) % 4; // Wrap around
            } else if (event.code === "ArrowDown") {
                selectedOption = (selectedOption + 1) % 4; // Wrap around
            }
        }

        else if (menuMode === 2) {
            // Submenu grid navigation
            const maxRows = 4;
            const maxCols = 2;

            const optionsList = getOptionChoice(selectedOption) || [];
            const length = optionsList.length;

            if (selectedOption2 < 0) selectedOption2 = 0;

            const row = Math.floor(selectedOption2 / maxCols);
            const col = selectedOption2 % maxCols;

            switch (event.code) {
                case "ArrowRight": {
                    // Attempt to move right; if at edge, wrap within the same row
                    let nextCol = (col + 1) % maxCols;
                    let nextIndex = row * maxCols + nextCol;
                    if (nextIndex < length) {
                        selectedOption2 = nextIndex;
                    }
                    else {
                        // Wrap to first column of this row if valid
                        const wrapIndex = row * maxCols;
                        if (wrapIndex < length) {
                            selectedOption2 = wrapIndex;
                        }
                    }
                    break;
                }

                case "ArrowLeft": {
                    // Attempt to move left; if at edge, wrap within the same row
                    let prevCol = (col - 1 + maxCols) % maxCols;
                    let prevIndex = row * maxCols + prevCol;
                    if (prevIndex < length) {
                        selectedOption2 = prevIndex;
                    }
                    else {
                        // Wrap to last column of this row (or last valid in row)
                        const rowStart = row * maxCols;
                        const rowEnd = Math.min(rowStart + maxCols - 1, length - 1);
                        selectedOption2 = rowEnd;
                    }
                    break;
                }

                case "ArrowDown": {
                    // Attempt to move down; if at bottom, wrap to top of same column
                    let nextRow = (row + 1) % maxRows;
                    let nextIndex = nextRow * maxCols + col;
                    if (nextIndex < length) {
                        selectedOption2 = nextIndex;
                    }
                    else {
                        // Wrap to top row in this column if valid
                        const wrapIndex = col;
                        if (wrapIndex < length) {
                            selectedOption2 = wrapIndex;
                        }
                    }
                    break;
                }

                case "ArrowUp": {
                    // Attempt to move up; if at top, wrap to bottommost valid in same column
                    let prevRow = (row - 1 + maxRows) % maxRows;
                    let prevIndex = prevRow * maxCols + col;
                    if (prevIndex < length) {
                        selectedOption2 = prevIndex;
                    }
                    else {
                        // Find the bottommost row that has this column
                        let bottomRow = Math.floor((length - 1 - col) / maxCols);
                        if (bottomRow >= 0) {
                            selectedOption2 = bottomRow * maxCols + col;
                        }
                    }
                    break;
                }
            }
        }

        if (["KeyZ", "Enter"].includes(event.code)) {

            if (menuMode === 0) {
                selectedOption = 0;
            }

            else if (menuMode === 1) {
                selectedOption2 = 0;
            }
            
            else if (menuMode === 2) {
                choice = getOptionChoice(selectedOption)[selectedOption2];
                if (selectedOption === 0) {
                    targetEnemy = 0;
                }
            }

            else if (menuMode === 3) {
                sequence.push([players[selectedPlayer], choice, enemies, selectedPlayer, selectedOption, selectedOption2]);

                // Once done, go back up to player selection
                menuMode = 0;
                selectedOption = -1;
                selectedOption2 = -1;
                targetEnemy = -1;
                targetPlayer = -1;

                return;
            }

            if (goodToGo) menuMode++;

            if (sequence.length === players.length) {
                // Add in enemy attack
                sequence.push([enemies[0], enemies[0].attacks[0], [randomChoice(players)], selectedPlayer, selectedOption, selectedOption2]);

                (async () => {
                    await executeSequence();
                })();
            }
        }
        else if (["KeyX", "Escape"].includes(event.code) && !drawingDialog) {
            if (menuMode === 0 && sequence.length > 0) {
                menuMode = 2;
                selectedPlayer = sequence[sequence.length-1][3];
                selectedOption = sequence[sequence.length-1][4];
                selectedOption2 = sequence[sequence.length-1][5];
                sequence.pop(); // Remove last action if going back to player selection
            }
            else {
                menuMode--;
            }
            targetEnemy = -1;
            targetPlayer = -1;
        }

        // DEBUG
        if (menuMode === 0) {
            if (event.code === "Minus") {
                players[selectedPlayer]['maxHP']--;
            } else if (event.code === "Equal") {
                players[selectedPlayer]['maxHP']++;
            }
            if (event.code === "BracketLeft") {
                players[selectedPlayer]['hp']--;
            } else if (event.code === "BracketRight") {
                players[selectedPlayer]['hp']++;
            }
            if (event.code === "Semicolon") {
                players[selectedPlayer]['charge']--;
            } else if (event.code === "Quote") {
                players[selectedPlayer]['charge']++;
            }
        }

        // Clamp and reset selectedOption/selectedOption2 as before:
        menuMode = Math.max(0, Math.min(3, menuMode));
        selectedOption = menuMode >= 1 ? Math.max(0, selectedOption) : -1;
        selectedOption2 = menuMode >= 2 ? Math.max(0, selectedOption2) : -1;
    });
}