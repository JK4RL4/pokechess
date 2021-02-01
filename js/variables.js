// Pokemon images for each piece set
const electricSet = {
    king: "raikou",
    queen: "zeraora",
    rook: "electivire",
    bishop: "toxtricity-amped",
    knight: "jolteon",
    pawn: "pikachu"
};

const iceSet = {
    king: "mr-rime",
    queen: "sneasel",
    rook: "mamoswine",
    bishop: "regice",
    knight: "walrein",
    pawn: "sealeo"
};

const fireSet = {
    king: "entei",
    queen: "infernape",
    rook: "coalossal",
    bishop: "typhlosion",
    knight: "ponyta",
    pawn: "charmander"
};

const waterSet = {
    king: "empoleon",
    queen: "primarina",
    rook: "carracosta",
    bishop: "dracovish",
    knight: "kingdra",
    pawn: "squirtle"
};

const dragonSet = {
    king: "garchomp",
    queen: "palkia",
    rook: "guzzlord",
    bishop: "giratina-altered",
    knight: "dialga",
    pawn: "dratini"
};

const psychicSet = {
    king: "solgaleo",
    queen: "gardevoir",
    rook: "metagross",
    bishop: "gothitelle",
    knight: "girafarig",
    pawn: "drowzee"
};

// Array of chess board tiles
const validMoves = ["11", "12", "13", "14", "15", "16", "17", "18",
                    "21", "22", "23", "24", "25", "26", "27", "28",
                    "31", "32", "33", "34", "35", "36", "37", "38",
                    "41", "42", "43", "44", "45", "46", "47", "48",
                    "51", "52", "53", "54", "55", "56", "57", "58",
                    "61", "62", "63", "64", "65", "66", "67", "68",
                    "71", "72", "73", "74", "75", "76", "77", "78",
                    "81", "82", "83", "84", "85", "86", "87", "88",];