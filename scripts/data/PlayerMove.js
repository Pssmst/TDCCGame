import { playSound } from '../dialog.js';

export class PlayerMove {
    constructor(name, abbreviatedName, description, useType) {
        this.name            = name;
        this.abbreviatedName = abbreviatedName;
        this.description     = description;
        this.useType         = useType; // 0 = player, 1 = enemy, 2 = both
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

export class PlayerAttack extends PlayerMove {
    constructor(name, abbreviatedName, description, damage, chargeCost, useType=1, sound = 'hurt.wav') {
        super(name, abbreviatedName, description, useType);
        this.damage     = damage;
        this.chargeCost = chargeCost;
        this.sound      = sound;
    }
    execute(player, targets) {
        // Deduct charge from the player
        player.charge = Math.max(0, player.charge - this.chargeCost);

        // Apply damage to each target in turn
        targets.forEach(enemy => {
            enemy.hp = Math.max(0, enemy.hp - this.damage);
        });
        playSound(`../assets/sounds/${this.sound}`);
    }
}


export class Deadlock extends PlayerAttack {
    constructor(damage) {
        super('Deadlock', 'D. Lock', "Lowers enemy speed\nand dodge chance", damage, 0);
    }
}
export class DandruffStorm extends PlayerAttack {
    constructor(damage) {
        super('Dandruff Storm', 'Dand. Storm', "Stronger with Energy\nLarge damage", damage, 0);
    }
}
export class Hit extends PlayerAttack {
    constructor(damage) {
        super('Hit', 'Hit', "Attack with blunt force\nFree", damage, 0);
    }
}
export class RageSpell extends PlayerAttack {
    constructor(damage) {
        super('Rage Spell', 'R. Spell', "Inflicts *Berzerk*\nCosts 1 Mana", damage, 1);
    }
}
export class DomeShield extends PlayerAttack {
    constructor(damage) {
        super('Dome Shield', 'D. Shield', "Healing protection\nCosts 2 Mana", damage, 2, 0);
    }
}
export class DoubleTap extends PlayerAttack {
    constructor(damage) {
        super('Double Tap', 'D. Tap', "Skill = Damage\nCosts 3 Mana", damage, 3);
    }
}
export class Dash extends PlayerAttack {
    constructor(damage) {
        super('Dash', 'Dash', "Simple attack\nSensitive damage", damage, 0);
    }
}
export class StealthCloak extends PlayerAttack {
    constructor(damage) {
        super('Stealth Cloak', 'S. Cloak', "2-part attack\n+Stealth, +Dodge %", damage, 0);
    }
}
export class Nunchucks extends PlayerAttack {
    constructor(damage) {
        super('Nunchucks', 'N. Chucks', "\nMedium damage", damage, 0);
    }
}
export class BlueCrown extends PlayerAttack {
    constructor(damage) {
        super('Blue Crown', 'B. Crown', "", damage, 0);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

export class PlayerAction extends PlayerMove {
    constructor(name, abbreviatedName, description, useType=0, sound = 'hurt.wav') {
        super(name, abbreviatedName, description, useType);
        this.sound = sound;
    }
    execute(player, targets) {
        playSound(`../assets/sounds/${this.sound}`);
    }
}

export class Defend extends PlayerAction {
    constructor() {
        super('Defend', 'Defend', "", 0);
    }

    execute(player, targets) {
        player.defense += 5;
    }
}
export class Check extends PlayerAction {
    constructor() {
        super('Check', 'Check', "\nUseful observation", 1);
    }
}
export class Flee extends PlayerAction {
    constructor() {
        super('Flee', 'Flee', "\nAttempt to leave battle", 0);
    }
}
export class LesterHealingPotion extends PlayerAction {
    constructor() {
        super('Lester Healing Potion', 'L.H.P.', "Chance to heal or damage\nScales with Energy", 2);
    }
}
export class Charge extends PlayerAction {
    constructor() {
        super('Charge', 'Charge', "\n+1 Mana", 0);
    }
}
export class BadJoke extends PlayerAction {
    constructor() {
        super('Bad Joke', 'B.Joke', "Say a questionable joke\nInflicts *Cringe*", 1);
    }
}
export class Ramble extends PlayerAction {
    constructor() {
        super('Ramble', 'Ramble', "Small damage\nInflicts *Bored*", 1);
    }
}