import { playSound } from '../dialog.js';

export class EnemyMove {
    constructor(name, damage, sound = 'hurt.wav') {
        this.name   = name;
        this.damage = damage;
        this.sound  = sound;
    }

    execute(enemy, playerTargets) {
        // Apply damage to each target in turn
        playerTargets.forEach(player => {
            player.hp = Math.max(0, player.hp - this.damage);
        });
        playSound(`../assets/sounds/${this.sound}`);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

export class RockSlam extends EnemyMove {
    constructor() {
        super('Rock Slam', 8);
    }
}
export class DustDevil extends EnemyMove {
    constructor() {
        super('Dust Devil', 12);
    }
}