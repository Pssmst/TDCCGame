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
        super('First-Aid Kit', 'Medkit', 'Restores HP when used.', amount, 'use.wav');
    }
}
export class GranolaBar extends Consumable {
    constructor(amount) {
        super('Granola Bar', 'G. Bar', 'Restores a small amount of HP.', amount, 'use.wav');
    }
}
export class TrailMix extends Consumable {
    constructor(amount) {
        super('Trail Mix', 'T. Mix', 'Boosts stamina slightly.', amount, 'use.wav');
    }
}
export class BagOfNuts extends Consumable {
    constructor(amount) {
        super('Bag of Nuts', 'NutBag', 'Snacks on nuts for a quick boost.', amount, 'use.wav');
    }
}
export class OatCake extends Consumable {
    constructor(amount) {
        super('Oat Cake', 'O. Cake', 'A hearty oat cake that restores HP.', amount, 'use.wav');
    }
}
export class NutButters extends Consumable {
    constructor(amount) {
        super('Nut Butters', 'NutBut', 'Nut butter to recover a bit of HP.', amount, 'use.wav');
    }
}
export class SliceOfBananaBread extends Consumable {
    constructor(amount) {
        super('Slice of Banana Bread', 'BreadSlice', 'A sweet slice that restores HP.', amount, 'use.wav');
    }
}
export class WaterBottle extends Consumable {
    constructor(amount) {
        super('Water Bottle', 'Water B.', 'Quenches thirst and restores a bit of HP.', amount, 'use.wav');
    }
}
export class Carabiners extends Consumable {
    constructor(amount) {
        super('Carabiners', 'C. Biners', 'Useful climbing gear. (No direct HP effect.)', amount, 'use.wav');
    }
}
export class Harness extends Consumable {
    constructor(amount) {
        super('Harness', 'Harness', 'Climbing harness. (No direct HP effect.)', amount, 'use.wav');
    }
}
export class CheddarSunChips extends Consumable {
    constructor(amount) {
        super('Cheddar Sun Chips', 'Sun Chips', 'A snack that restores a bit of HP.', amount, 'use.wav');
    }
}
export class SunscreenCan extends Consumable {
    constructor(amount) {
        super('Sunscreen Can', 'Sun. Can', 'Protects you from the sun.', amount, 'use.wav');
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
        super('Diabetes Kit', '', 'A medical kit.', amount);
    }
}
export class Wallet extends KeyItem {
    constructor(amount) {
        super('Wallet', '', 'Holds money/ID.', amount);
    }
}
export class Compass extends KeyItem {
    constructor(amount) {
        super('Compass', '', 'Shows direction.', amount);
    }
}
export class GrapplingHook extends KeyItem {
    constructor(amount) {
        super('Grappling Hook', '', 'Useful for climbing.', amount);
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
        super('Nothing', '', 'You are fighting with nothing', 0)
    }
}
export class Trowel extends Weapon {
    constructor() {
        super('Trowel', '', 'Small digging tool.', 5);
    }
}
export class IceAxe extends Weapon {
    constructor() {
        super('Ice Axe', '', 'A climbing tool.', 5);
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
        super('Nothing', '', 'You are wearing nothing', 0)
    }
}
export class ClimbingHelmet extends Armor {
    constructor() {
        super('Climbing Helmet', '', 'Protects your head.', 5);
    }
}