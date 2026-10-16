/* =====================================================================
   WHO IS IT? – CONTENT AND SETTINGS
   You can edit this file without any programming knowledge:
   change only the words between the quotation marks and keep commas and brackets.
   ===================================================================== */

export const CONFIG = {
  roundsPerGame: 4,
  /* Two ways to play:
     team   – one describes, one guesses (suspects = people on the guesser's screen)
     versus – like the board game: both have a secret person, take turns asking (board = people on the board) */
  /* People:  suspects = people on the guesser's screen (team game), board = people on the board (versus).
     How they differ: in every round, "vary" features are picked from "pool" – only these features differ,
     everything else is the same for everybody. Each feature gets "values" different looks (e.g. [2, 3] = 2 or 3).
     Every look is shared by at least a quarter of the people, so a good question always rules out a group. */
  levels: {
    1: { name: "Easy",   info: "they look very different", suspects: 6,  board: 12, seconds: 150,
         pool: ["skin", "hairColour", "hairStyle", "glasses", "headwear", "top", "topColour", "facialHair"], vary: 4, values: [2, 3] },
    2: { name: "Medium", info: "some of them look alike",  suspects: 8,  board: 16, seconds: 150,
         pool: ["skin", "hairColour", "hairStyle", "glasses", "facialHair", "freckles", "earrings", "necklace", "headwear", "top", "topColour", "pattern"], vary: 5, values: [2, 3] },
    3: { name: "Hard",   info: "they look very similar",   suspects: 10, board: 20, seconds: 180,
         pool: ["skin", "hairColour", "hairStyle", "glasses", "facialHair", "freckles", "earrings", "necklace", "headwear", "top", "topColour", "pattern"], vary: 6, values: [2, 2] },
    4: { name: "Expert", info: "only small details are different", suspects: 12, board: 24, seconds: 210,
         pool: ["glasses", "freckles", "earrings", "necklace", "pattern", "hairStyle", "facialHair", "headwear"], vary: 6, values: [2, 2] }
  },
  modes: {
    team:   { name: "Team game", info: "Work together: one of you describes, the other one asks and guesses." },
    versus: { name: "Versus",    info: "Like the board game: you both have a secret person. Take turns asking. Who finds the other person first?" }
  },
  stars: [3, 2, 1],          // stars for a correct guess on the 1st, 2nd, 3rd+ try
  germanPenalty: 1,          // stars lost when you tap "Oops, German!"
  keyPhrases: {              // always visible during a round
    describer: [
      "This person has got …",
      "This person is wearing …",
      "Yes, that's right. / No, that's wrong."
    ],
    guesser: [
      "Has your person got … ?",
      "Is your person wearing … ?",
      "Can you say that again, please?"
    ],
    versus: [
      "Has your person got … ?",
      "Is your person wearing … ?",
      "Yes, he/she has. / No, he/she isn't."
    ]
  },
  phrases: {
    describer: [
      "This person has got … hair.",
      "This person has got light / brown / dark skin.",
      "This person is wearing a … .",
      "This person has got glasses / a beard / a moustache / freckles.",
      "This person has got a ponytail / a bun / spiky hair.",
      "This person is wearing earrings / a necklace / round glasses.",
      "This person hasn't got … .",
      "The T-shirt is blue with stripes.",
      "Yes, that's right. / No, that's wrong.",
      "Sorry, can you say that again, please?"
    ],
    guesser: [
      "Has your person got … ?",
      "Is your person wearing a … ?",
      "What colour is the … ?",
      "What colour is your person's skin?",
      "Is it striped or spotted?",
      "Sorry, can you say that again, please?",
      "What do you mean by … ?",
      "I think I've got it!"
    ],
    versus: [
      "Has your person got … ?",
      "Is your person wearing … ?",
      "Is your person's hair long or short?",
      "Has your person got light / brown / dark skin?",
      "Yes, he/she has. / No, he/she hasn't.",
      "Yes, he/she is. / No, he/she isn't.",
      "It's your turn.",
      "I think it's the person with …"
    ]
  }
};

/* Features of the people. "word" is what appears in the word bank. */
export const FEATURES = {
  skin: { group: "Skin", values: [
    { id: "light", word: "light skin", c: "#f3d0b2" },
    { id: "brown", word: "brown skin", c: "#bd845c" },
    { id: "dark",  word: "dark skin",  c: "#6b432c" } ] },
  hairColour: { group: "Hair", values: [
    { id: "blond", word: "blond", c: "#e9c46a" },
    { id: "brown", word: "brown", c: "#7b4a25" },
    { id: "black", word: "black", c: "#2b2523" },
    { id: "red",   word: "red",   c: "#c4532a" },
    { id: "grey",  word: "grey",  c: "#a7a9ad" } ] },
  hairStyle: { group: "Hair", values: [
    { id: "short", word: "short hair" },
    { id: "long",  word: "long hair" },
    { id: "curly", word: "curly hair" },
    { id: "ponytail", word: "a ponytail" },
    { id: "bun",   word: "a bun" },
    { id: "spiky", word: "spiky hair" },
    { id: "bald",  word: "bald", w: 0.6 } ] },
  facialHair: { group: "Face", values: [
    { id: "none", w: 3 },
    { id: "beard", word: "a beard" },
    { id: "moustache", word: "a moustache" } ] },
  glasses: { group: "Face", values: [
    { id: "none", w: 2 },
    { id: "round", word: "round glasses" },
    { id: "square", word: "square glasses" },
    { id: "sunglasses", word: "sunglasses" } ] },
  freckles: { group: "Face", values: [
    { id: "none", w: 3 },
    { id: "freckles", word: "freckles" } ] },
  earrings: { group: "Jewellery", values: [
    { id: "none", w: 2 },
    { id: "earrings", word: "earrings" } ] },
  necklace: { group: "Jewellery", values: [
    { id: "none", w: 2 },
    { id: "necklace", word: "a necklace" } ] },
  headwear: { group: "Clothes", values: [
    { id: "none", w: 2 },
    { id: "cap", word: "a cap" },
    { id: "woolly hat", word: "a woolly hat" } ] },
  top: { group: "Clothes", values: [
    { id: "tshirt", word: "a T-shirt" },
    { id: "hoodie", word: "a hoodie" },
    { id: "shirt",  word: "a shirt and tie" } ] },
  topColour: { group: "Colours", values: [
    { id: "red",    word: "red",    c: "#dc4b45" },
    { id: "blue",   word: "blue",   c: "#2f6fd0" },
    { id: "green",  word: "green",  c: "#2f9c5d" },
    { id: "yellow", word: "yellow", c: "#f1c232" },
    { id: "purple", word: "purple", c: "#8b56c9" },
    { id: "orange", word: "orange", c: "#ee8a2b" } ] },
  pattern: { group: "Patterns", values: [
    { id: "plain", word: "plain", w: 2 },
    { id: "striped", word: "striped" },
    { id: "spotted", word: "spotted" } ] }
};
