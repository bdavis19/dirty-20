// nameGenerator.js

const NAME_PARTS = {
  adjectives: [
    "Gilded","Silver","Iron","Crimson","Amber","Shadowed","Ancient",
    "Wandering","Forgotten","Twisted","Hollow","Emerald","Obsidian",
    "Runed","Mystic","Tarnished","Sundered","Ashen","Veiled","Arcane",

    "Golden","Ivory","Sable","Cobalt","Verdant","Luminous","Dusken",
    "Stormforged","Moonlit","Sunken","Frostbound","Duskwrought",
    "Bright","Whispering","Shimmering","Glowing","Ebon","Silent",
    "Burnished","Fabled","Sacred","Cursed","Blessed","Radiant",
    "Hidden","Witchbound","Spellbound","Grim","Elder","Celestial"
  ],

  nouns: [
    "Gauntlet","Wyrm","Lantern","Cauldron","Anvil","Compass","Tome",
    "Chalice","Sigil","Raven","Serpent","Crown","Coin","Flame",
    "Shield","Dagger","Scroll","Veil","Skull","Star",

    "Orb","Staff","Ring","Relic","Grimoire","Hammer","Blade",
    "Fang","Claw","Stone","Key","Mirror","Mask","Torch",
    "Banner","Gem","Idol","Horn","Mantle","Shard",
    "Beacon","Vault","Glyph","Phoenix","Dragon","Wolf",
    "Watcher","Harbinger","Sentinel","Relic"
  ],

  shopSuffixes: [
    "Emporium","Trading Co.","Goods","Wares","Supply",
    "Exchange","Outfitters","Curios","Relics","Sundries",

    "Bazaar","Arcana","Artifacts","Oddities","Treasures",
    "Provisions","Mercantile","Armory","Vault","Repository",
    "Cabinet","Market","Collective","Gallery","Arcanum",
    "Depot","Guildhall","Consortium","Sanctum","Storehouse",
    "Hall","Workshop","Trading Post","Enclave","Quartermaster"
  ],

  firstNames: [
    "Mira","Baldren","Orvyn","Thessaly","Caelan","Jorveth","Elspeth",
    "Dunwick","Sable","Aldric","Voss","Nara","Grimm","Tessa","Harwick",

    "Alric","Bram","Cedric","Delwyn","Eldra","Fenric","Garrick",
    "Halwen","Isolde","Jareth","Kaelin","Liora","Merrick","Niven",
    "Orla","Perrin","Quill","Roderic","Selwyn","Theren",
    "Ulric","Valen","Wren","Xander","Yorick","Zareth",
    "Brenna","Corvin","Darian","Eira","Fiora","Galen","Harkin"
  ],

  lastNameParts: [
    "stone","wood","wick","forge","vale","moor","ash","croft",
    "brand","field","helm","gate","thorn","brook","ridge",

    "briar","barrow","cliff","watch","spire","hall","mere",
    "well","ford","hollow","march","crest","grove","hold",
    "port","haven","run","dell","wall","bridge",
    "fen","bluff","reach","fall","peak","cairn",
    "strand","root","mantle","keep","shade","track"
  ],

  businessSuffixes: [
    "& Sons","& Daughters","& Co.","Trading","Merchant",
    "the Dealer","the Trader","the Merchant","Imports","Provisions",

    "Consortium","Mercantile","Supply","Exchange","Guild",
    "Cartel","Partnership","House","Trading House","Company",
    "and Heirs","and Kin","& Associates","& Partners","and Company",
    "Curios","Oddities","Artifacts","Relics","Arcana",
    "Collective","Consignment","Wares","Goods","Emporium"
  ]
};

function generateTavernName() {
  const { adjectives, nouns, shopSuffixes } = NAME_PARTS;

  const roll = Math.random();

  if (roll < 0.6) {
    // "The Gilded Gauntlet"
    const adj  = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `The ${adj} ${noun}`;
  } else {
    // "The Serpent Emporium"
    const noun   = nouns[Math.floor(Math.random() * nouns.length)];
    const suffix = shopSuffixes[Math.floor(Math.random() * shopSuffixes.length)];
    return `The ${noun} ${suffix}`;
  }
}

function generateProperName() {
  const { firstNames, lastNameParts, shopSuffixes, businessSuffixes } = NAME_PARTS;

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastPart  = lastNameParts[Math.floor(Math.random() * lastNameParts.length)];
  const lastName  = firstName.slice(0, 3).toLowerCase() + lastPart;
  const capLast   = lastName.charAt(0).toUpperCase() + lastName.slice(1);

  const roll = Math.random();

  if (roll < 0.4) {
    // "Mira's Emporium"
    const suffix = shopSuffixes[Math.floor(Math.random() * shopSuffixes.length)];
    return `${firstName}'s ${suffix}`;
  } else if (roll < 0.7) {
    // "Mirwick & Sons"
    const biz = businessSuffixes[Math.floor(Math.random() * businessSuffixes.length)];
    return `${capLast} ${biz}`;
  } else {
    // "Mira Mirwick's Goods"
    const suffix = shopSuffixes[Math.floor(Math.random() * shopSuffixes.length)];
    return `${firstName} ${capLast}'s ${suffix}`;
  }
}

function generateShopNames() {
  const names = [];

  for (let i = 0; i < 5; i++) {
    names.push(generateTavernName());
  }

  for (let i = 0; i < 5; i++) {
    names.push(generateProperName());
  }

  return names;
}