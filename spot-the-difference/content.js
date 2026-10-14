/* =====================================================================
   SPOT THE DIFFERENCE – CONTENT AND SETTINGS
   You can edit this file without any programming knowledge:
   change only the words and numbers, keep quotation marks, commas and brackets.
   ===================================================================== */

export const CONFIG = {
  roundsPerGame: 2,
  scenes: ["party", "party"],   // which scene is used in round 1, round 2, …
  wrongTapSeconds: 10,          // a tap where there is no difference costs this many seconds
  germanSeconds: 10,            // "Oops, German!" costs this many seconds
  levels: {
    1: { name: "Easy",   info: "A small party – find 5 differences",          extras: 3, differences: 5, seconds: 240 },
    2: { name: "Medium", info: "More things in the room – find 6 differences", extras: 5, differences: 6, seconds: 270 },
    3: { name: "Hard",   info: "A big party – find 7 differences",            extras: 7, differences: 7, seconds: 300 }
  },
  keyPhrases: [               // always visible during a round
    "In my picture there is / there are …",
    "Is there a … in your picture?",
    "Where is the …?  ·  What colour is the …?",
    "Me too.  ·  Not in my picture."
  ],
  phrases: [
    "In my picture there is a cat under the table.",
    "In my picture there are three presents.",
    "Is there a clock in your picture?",
    "How many balloons are there?",
    "Where is the dog?",
    "What colour is the sofa?",
    "What is the girl doing?",
    "The boy is playing the guitar.",
    "Me too. / Same here.",
    "Not in my picture. / In my picture it's …",
    "That's a difference! Let's tap it.",
    "Sorry, can you say that again, please?"
  ],
  prepositions: ["in", "on", "under", "next to", "behind", "in front of", "between", "above"]
};

/* Colour words. The game never uses red and green, and it only swaps colours
   that also look different in brightness (for players with colour vision deficiency). */
export const COLOURS = {
  blue:   { word: "blue",   c: "#2f6fd0" },
  yellow: { word: "yellow", c: "#f5c518" },
  purple: { word: "purple", c: "#7e4fc4" },
  orange: { word: "orange", c: "#f08a24" },
  pink:   { word: "pink",   c: "#f49ac2" },
  white:  { word: "white",  c: "#f8f6f0" },
  black:  { word: "black",  c: "#2c2c2c" },
  brown:  { word: "brown",  c: "#8b5a2b" },
  grey:   { word: "grey",   c: "#9ea3a8" }
};

export const NUMBERS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/* Words for the birthday party scene.
   a / the: how the thing is named in a sentence · where: where it is
   one / many: singular and plural for things you can count */
export const PARTY = {
  title: "Birthday party",
  places: {
    windowsill:  "on the windowsill",
    shelf:       "on the shelf",
    plant:       "next to the plant",
    underTable:  "under the table",
    onSofa:      "on the sofa",
    behindSofa:  "behind the sofa",
    frontSofa:   "in front of the sofa"
  },
  things: {
    cake:     { a: "a cake",       the: "the cake",       where: "on the table" },
    candles:  { one: "candle",     many: "candles",       where: "on the cake" },
    presents: { one: "present",    many: "presents",      where: "on the table" },
    cups:     { one: "cup",        many: "cups",          where: "on the table" },
    balloons: { one: "balloon",    many: "balloons",      where: "above the sofa", the: "the balloons" },
    clock:    { a: "a clock",      the: "the clock",      where: "on the wall" },
    lamp:     { a: "a lamp",       the: "the lamp",       where: "above the table" },
    sofa:     { a: "a sofa",       the: "the sofa" },
    cat:      { a: "a cat",        the: "the cat" },
    dog:      { a: "a dog",        the: "the dog" },
    teddy:    { a: "a teddy bear", the: "the teddy bear" },
    ball:     { a: "a ball",       the: "the ball" },
    car:      { a: "a toy car",    the: "the toy car" },
    girl:     { a: "a girl",       the: "the girl",       clothes: "dress" },
    boy:      { a: "a boy",        the: "the boy",        clothes: "T-shirt" },
    hat:      { a: "a party hat",  the: "party hat" }
  },
  activities: {
    eating:   "is eating cake",
    drinking: "is drinking lemonade",
    reading:  "is reading a book",
    guitar:   "is playing the guitar",
    photo:    "is taking a photo",
    waving:   "is waving",
    dancing:  "is dancing"
  },
  weather: {
    sun:  "the sun is shining",
    rain: "it's raining"
  },
  /* Extra words in the word list (with pictures) */
  furniture: { table: "table", window: "window", shelf: "shelf", plant: "plant", windowsill: "windowsill" }
};
