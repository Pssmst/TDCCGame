import { battle } from './battle.js';
import { handleDialog, playSound } from './dialog.js';

import {
    players,
    enemies,
    getEnemies,
    level
} from './data/EntityData.js';

import {
    Deadlock,
    DandruffStorm,

    Hit,
    RageSpell,
    DomeShield,
    DoubleTap,

    Dash,

    Nunchucks,
    StealthCloak,
    BlueCrown,

    Defend,
    Check,
    Flee,
    LesterHealingPotion,
    Charge,
    BadJoke,
    Ramble
} from './data/PlayerMove.js';

import {
    FirstAidKit,
    GranolaBar,
    TrailMix,
    BagOfNuts,
    OatCake,
    NutButters,
    SliceOfBananaBread,
    WaterBottle,
    Harness,
    CheddarSunChips,
    SunscreenCan,

    GrapplingHook,
    DiabetesKit,
    Wallet,
    Compass,

    NoWeapon,
    Trowel,
    IceAxe,

    NoArmor,
    ClimbingHelmet,
} from './data/Item.js';

import { Buff } from './data/Buff.js';

import {
    RockSlam,
    DustDevil
} from './data/EnemyMove.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const uiCanvas = document.getElementById("uiCanvas");
const uiCtx = uiCanvas.getContext("2d", { alpha: true });

// Resize to full window
function resizeCanvas(canvas, ctx) {
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = "640px";
    canvas.style.height = "480px";
    canvas.width  = 640 * dpr;
    canvas.height = 480 * dpr;
    ctx.scale(dpr, dpr);

    // Turn off smoothing *after* scaling
    ctx.imageSmoothingEnabled = false;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(canvas, ctx);
resizeCanvas(uiCanvas, uiCtx);

//////////////////////////////////////////////////////////////////////////////////////////////

/// ATTACKS ////

players[0].attacks = [ new Deadlock(players[0].att), new DandruffStorm(players[0].att) ];
players[1].attacks = [ new Hit(players[0].att), new RageSpell(players[0].att), new DomeShield(players[0].att), new DoubleTap(players[0].att) ];
players[2].attacks = [ new Dash(players[0].att) ];
players[3].attacks = [ new Nunchucks(players[0].att), new StealthCloak(players[0].att), new BlueCrown(players[0].att) ];

//// ACTIONS ////

players[0].actions = [ new Check(), /*new Flee(),*/ new LesterHealingPotion() ];
players[1].actions = [ new Check(), /*new Flee(),*/ new Charge() ];
players[2].actions = [ new Check(), /*new Flee(),*/ new BadJoke(), new Ramble() ];
players[3].actions = [ new Check(), /*new Flee(),*/ ];

//// ITEMS ////

players[0].inventory.consumables = [ new FirstAidKit(1), new GranolaBar(3), new TrailMix(2), new BagOfNuts(1), new OatCake(3), new NutButters(4), new SliceOfBananaBread(1) ];
players[0].inventory.keyItems = [  ];
players[0].inventory.weapons = [  ];
players[0].inventory.armor = [  ];
players[0].inventory.equippedWeapon = new NoWeapon();
players[0].inventory.equippedArmor = new NoArmor();

players[1].inventory.consumables = [ new WaterBottle(12) ];
players[1].inventory.keyItems = [ new GrapplingHook(1), new DiabetesKit(1) ];
players[1].inventory.weapons = [  ];
players[1].inventory.armor = [  ];
players[1].inventory.equippedWeapon = new NoWeapon();
players[1].inventory.equippedArmor = new NoArmor();

players[2].inventory.consumables = [ new Harness(4), new CheddarSunChips(1), new WaterBottle(3) ];
players[2].inventory.keyItems = [ new Wallet(1) ];
players[2].inventory.weapons = [ new Trowel() ];
players[2].inventory.armor = [  ];
players[2].inventory.equippedWeapon = new IceAxe();
players[2].inventory.equippedArmor = new NoArmor();

players[3].inventory.consumables = [ new SunscreenCan(2), new WaterBottle(2) ];
players[3].inventory.keyItems = [ new Compass(1) ];
players[3].inventory.weapons = [  ];
players[3].inventory.armor = [  ];
players[3].inventory.equippedWeapon = new ClimbingHelmet();
players[3].inventory.equippedArmor = new NoArmor();

//// ACTIONS ////

players[0].defend = [ new Defend() ];
players[1].defend = [ new Defend() ];
players[2].defend = [ new Defend() ];
players[3].defend = [ new Defend() ];

//////////////////////////////////////////////////////////////////////////////////////////////

enemies[0].attacks = [ new RockSlam(), new DustDevil() ];

let chosenEnemies = getEnemies(["Cringling"]);
battle(canvas, uiCanvas, players, chosenEnemies);

//////////////////////////////////////////////////////////////////////////////////////////////
