import { playSound } from '../dialog.js';

export class Buff {
    constructor(name, description, sound = 'hurt.wav') {
        this.name        = name;
        this.description = description;
        this.sound       = sound;
    }

    execute(player, targets) {
        playSound(`../assets/sounds/${this.sound}`);
    }
}