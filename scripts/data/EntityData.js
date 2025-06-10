export const level = 1;

// PLAYER AND ENEMY DATA
export let players = [
    {
        name: "Landon",
        att: 4 * level,
        def: 6 * level,
        hp: 100,
        maxHP: 100,
        charge: 0,
        maxCharge: 100,
        attacks: [],
        actions: [],
        inventory: {},
        buffs: [],
    },
    {
        name: "Destin",
        att: 7 * level,
        def: 4 * level,
        hp: 100,
        maxHP: 100,
        charge: 0,
        maxCharge: 3,
        attacks: [],
        actions: [],
        inventory: {},
        buffs: [],
    },
    {
        name: "Brannon",
        att: 5 * level,
        def: 5 * level,
        hp: 100,
        maxHP: 100,
        charge: 0,
        maxCharge: 100,
        attacks: [],
        actions: [],
        inventory: {},
        buffs: [],
    },
    {
        name: "Garrett",
        att: 4 * level,
        def: 3 * level,
        hp: 100,
        maxHP: 100,
        charge: 0,
        maxCharge: 100,
        attacks: [],
        actions: [],
        inventory: {},
        buffs: [],
    },
];

export const enemies = [
    {
        name: "Cringling",
        att: 10,
        def: 10,
        hp: 50,
        maxHP: 50,
        attacks: [],
        buff: []
    },
    {
        name: "Big Rock",
        att: 10,
        def: 15,
        hp: 50,
        maxHP: 50,
        attacks: [],
        buff: []
    },
    {
        name: "Rock 1",
        att: 0,
        def: 10,
        hp: 25,
        maxHP: 25,
        attacks: [],
        buff: []
    },
    {
        name: "Rock 2",
        att: 3,
        def: 10,
        hp: 25,
        maxHP: 25,
        attacks: [],
        buff: []
    },
    {
        name: "Dreamer",
        att: 30,
        def: 70,
        hp: 100,
        maxHP: 100,
        attacks: [],
        buff: []
    },
    {
        name: "Cringe",
        att: 80,
        def: 40,
        hp: 143,
        maxHP: 143,
        attacks: [],
        buff: []
    },
    {
        name: "Dust Bunny",
        att: 45,
        def: 65,
        hp: 102,
        maxHP: 102,
        attacks: [],
        buff: []
    },
    {
        name: "Oshiro",
        att: 75,
        def: 0,
        hp: 100,
        maxHP: 100,
        attacks: [],
        buff: []
    },
    {
        name: "Wind Elemental",
        att: 50,
        def: 65,
        hp: 150,
        maxHP: 150,
        attacks: [],
        buff: []
    },
    {
        name: "Hand 1",
        att: 30,
        def: 30,
        hp: 60,
        maxHP: 60,
        attacks: [],
        buff: []
    },
    {
        name: "Hand 2",
        att: 30,
        def: 30,
        hp: 60,
        maxHP: 60,
        attacks: [],
        buff: []
    },
    {
        name: "Scopoclaustria",
        att: 80,
        def: 80,
        hp: 300,
        maxHP: 300,
        attacks: [],
        buff: []
    },
    {
        name: "Claustromitus",
        att: 35,
        def: 45,
        hp: 100,
        maxHP: 100,
        attacks: [],
        buff: []
    },
    {
        name: "Scopobition",
        att: 45,
        def: 35,
        hp: 100,
        maxHP: 100,
        attacks: [],
        buff: []
    },
    {
        name: "Patrick",
        att: 75,
        def: 999,
        hp: 100,
        maxHP: 100,
        attacks: [],
        buff: []
    },
    {
        name: "Diaxr",
        att: 98,
        def: 56,
        hp: 100,
        maxHP: 100,
        attacks: [],
        buff: []
    },
    {
        name: "Fluffy Rex",
        att: 100,
        def: 100,
        hp: 300,
        maxHP: 300,
        attacks: [],
        buff: []
    },
    {
        name: "Lust",
        att: 152,
        def: 143,
        hp: 999,
        maxHP: 999,
        attacks: [],
        buff: []
    },
];

export function getEnemies(names) {
    return enemies.filter(enemy => names.includes(enemy.name));
}