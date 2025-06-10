import { playSound } from '../dialog.js';

export class Item {
    constructor(name, abbreviatedName, description, amount) {
        this.name            = name;
        this.abbreviatedName = abbreviatedName;
        this.description     = description;
        this.amount          = amount;
    }

    execute(player, targets) {
        console.log(`${player} used ${this.name}.`)
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

export class Consumable extends Item {
    constructor(name, abbreviatedName, description, amount, sound = 'use.wav') {
        super(name, abbreviatedName, description, amount);
        this.sound = sound;
    }
    execute(player, targets) {
        this.amount--;
        playSound(`../assets/sounds/${this.sound}`);
    }
}


export class FirstAidKit extends Consumable {
    constructor(amount) {
        super('First-Aid Kit', 'Medkit', 'The only logical heal\nRevive + full heal', amount, 'use.wav');
    }
}
export class GranolaBar extends Consumable {
    constructor(amount) {
        super('Granola Bar', 'G. Bar', 'Hits the granola spot\nHeals ## HP', amount, 'use.wav');
    }
}
export class TrailMix extends Consumable {
    constructor(amount) {
        super('Trail Mix', 'T. Mix', 'It has raisins...\nHeals ## HP', amount, 'use.wav');
    }
}
export class BagOfNuts extends Consumable {
    constructor(amount) {
        super('Bag of Nuts', 'NutBag', 'Nuts\nHeals ## HP', amount, 'use.wav');
    }
}
export class OatCake extends Consumable {
    constructor(amount) {
        super('Oat Cake', 'O. Cake', 'What even is this\nHeals ## HP', amount, 'use.wav');
    }
}
export class NutButters extends Consumable {
    constructor(amount) {
        super('Nut Butters', 'NutBut', 'High in trade value\nHeals ## HP', amount, 'use.wav');
    }
}
export class SliceOfBananaBread extends Consumable {
    constructor(amount) {
        super('Slice of Banana Bread', 'BreadSlice', 'Still hot, despite the cold\nHeals full HP', amount, 'use.wav');
    }
}
export class WaterBottle extends Consumable {
    constructor(amount) {
        super('Water Bottle', 'Water B.', 'Refreshing\n+## HP and +## Charge', amount, 'use.wav');
    }
}
export class Harness extends Consumable {
    constructor(amount) {
        super('Harness', 'Harness', 'You FEEL safer\n+5 defense for this turn', amount, 'use.wav');
    }
}
export class CheddarSunChips extends Consumable {
    constructor(amount) {
        super('Cheddar Sun Chips', 'Sun Chips', "Garrett's favorite\nHealing varies", amount, 'use.wav');
    }
}
export class SunscreenCan extends Consumable {
    constructor(amount) {
        super('Sunscreen Can', 'Sun. Can', 'Makes you slippery\nDefense down, dodge up', amount, 'use.wav');
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

export class KeyItem extends Item {
    constructor(name, abbreviatedName, description, amount) {
        super(name, abbreviatedName, description, amount);
    }
}


export class DiabetesKit extends KeyItem {
    constructor(amount) {
        super('Diabetes Kit', '', 'Needed for survival', amount);
    }
}
export class Wallet extends KeyItem {
    constructor(amount) {
        super('Wallet', '', 'Holds money', amount);
    }
}
export class Compass extends KeyItem {
    constructor(amount) {
        super('Compass', '', 'Shows direction.', amount);
    }
}
export class GrapplingHook extends KeyItem {
    constructor(amount) {
        super('Grappling Hook', '', 'Useful for climbing', amount);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

export class Weapon extends Item {
    constructor(name, abbreviatedName, description, damage) {
        super(name, abbreviatedName, description, 1);
        this.damage = damage;
    }
}


export class NoWeapon extends Weapon {
    constructor() {
        super('Nothing', '', '', 0)
    }
}
export class Trowel extends Weapon {
    constructor() {
        super('Trowel', '', 'Small digging tool', 5);
    }
}
export class IceAxe extends Weapon {
    constructor() {
        super('Ice Axe', '', 'A climbing tool', 5);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

export class Armor extends Item {
    constructor(name, abbreviatedName, description, defense) {
        super(name, abbreviatedName, description, 1);
        this.damage = defense;
    }
}


export class NoArmor extends Armor {
    constructor() {
        super('Nothing', '', '', 0)
    }
}
export class ClimbingHelmet extends Armor {
    constructor() {
        super('Climbing Helmet', '', 'Protects your head', 5);
    }
}