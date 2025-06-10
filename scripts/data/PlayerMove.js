import { playSound } from '../dialog.js';

export class PlayerMove {
    constructor(name, abbreviatedName, description) {
        this.name            = name;
        this.abbreviatedName = abbreviatedName;
        this.description     = description;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

export class PlayerAttack extends PlayerMove {
    constructor(name, abbreviatedName, description, damage, chargeCost, sound = 'hurt.wav') {
        super(name, abbreviatedName, description);
        this.damage     = damage;
        this.chargeCost = chargeCost;
        this.sound      = sound;
    }

    execute(player, enemyTargets) {
        // Deduct charge from the player
        player.charge = Math.max(0, player.charge - this.chargeCost);

        // Apply damage to each target in turn
        enemyTargets.forEach(enemy => {
            enemy.hp = Math.max(0, enemy.hp - this.damage);
        });
        playSound(`../assets/sounds/${this.sound}`);
    }
}


export class Deadlock extends PlayerAttack {
    constructor(damage) {
        super('Deadlock', 'D. Lock', '', damage, 0);
    }
}
export class DandruffStorm extends PlayerAttack {
    constructor(damage) {
        super('Dandruff Storm', 'Dand. Storm', '', damage, 0);
    }
}
export class RageSpell extends PlayerAttack {
    constructor(damage) {
        super('Rage Spell', 'R. Spell', '', damage, 0);
    }
}
export class DomeShield extends PlayerAttack {
    constructor(damage) {
        super('Dome Shield', 'D. Shield', '', damage, 0);
    }
}
export class DoubleTap extends PlayerAttack {
    constructor(damage) {
        super('Double Tap', 'D. Tap', '', damage, 0);
    }
}
export class Dash extends PlayerAttack {
    constructor(damage) {
        super('Dash', 'Dash', 'A quick dash that deals 10 damage to a single target.', damage, 0);
    }
}
export class StealthCloak extends PlayerAttack {
    constructor(damage) {
        super('Stealth Cloak', 'S. Cloak', '', damage, 0);
    }
}
export class Nunchucks extends PlayerAttack {
    constructor(damage) {
        super('Nunchucks', 'N. Chucks', '', damage, 0);
    }
}
export class BlueCrown extends PlayerAttack {
    constructor(damage) {
        super('Blue Crown', 'B. Crown', '', damage, 0);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

export class PlayerAction extends PlayerMove {
    constructor(name, abbreviatedName, description, sound = 'hurt.wav') {
        super(name, abbreviatedName, description);
        this.sound      = sound;
    }

    execute(player, enemyTargets) {
        playSound(`../assets/sounds/${this.sound}`);
    }
}


export class Check extends PlayerAction {
    constructor() {
        super('Check', 'Check', '');
    }
}
export class Flee extends PlayerAction {
    constructor() {
        super('Flee', 'Flee', '');
    }
}
export class LesterHealingPotion extends PlayerAction {
    constructor() {
        super('Lester Healing Potion', 'L.H.P.', '');
    }
}
export class Charge extends PlayerAction {
    constructor() {
        super('Charge', 'Charge', '');
    }
}
export class BadJoke extends PlayerAction {
    constructor() {
        super('Bad Joke', 'B.Joke', '');
    }
}
export class Ramble extends PlayerAction {
    constructor() {
        super('Ramble', 'Ramble', '');
    }
}