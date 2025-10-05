const adjectives = [  
    "Happy", "Skinny", "Cool", "Brave", "Sleepy", "Clever", "Lazy", "Cheerful", "Sneaky", "Curious", "Jolly", "Shy", "Fierce", "Gentle", "Mischievous", "Proud", "Calm", "Energetic", "Friendly", "Silly", "Witty", "Bold", "Grumpy", "Kind", "Courageous", "Playful", "Lively", "Quiet", "Smart", "Adventurous", "Funny", "Serious", "Thoughtful", "Daring", "Sweet", "Brilliant", "Charming", "Happy-go-lucky", "Patient", "Loyal", "Optimistic", "Pensive", "Ambitious", "Cheeky", "Diligent", "Curious-minded", "Radiant", "Gentle-hearted", "Funky", "Shimmering", "Heroic", "Inventive", "Mellow", "Bubbly", "Majestic", "Observant", "Resourceful", "Tricky", "Warm", "Vivacious", "Energetic-hearted", "Zealous", "Friendly-faced", "Nimble", "Polite", "Rascally", "Sensitive", "Tough", "Wise", "Affectionate", "Bold-hearted", "Caring", "Dazzling", "Fearless", "Humble", "Inspirational", "Joyful", "Kind-hearted", "Lovable", "Mysterious", "Naughty", "Outstanding", "Playful-minded", "Quiet-hearted", "Respectful", "Sassy", "Tender", "Upbeat", "Vibrant", "Whimsical", "Youthful", "Zany", "Curious-eyed", "Delightful", "Eager",    

    "Golden", "Silver", "Crimson", "Azure", "Emerald", "Ruby", "Sapphire", "Violet", "Amber", "Coral", "Ivory", "Jade", "Pearl", "Turquoise", "Bronze", "Copper", "Platinum", "Rose", "Lavender", "Mint", "Scarlet", "Indigo", "Burgundy", "Teal", "Magenta", "Chartreuse", "Maroon", "Navy", "Olive", "Plum",    

    "Stormy", "Sunny", "Misty", "Frosty", "Breezy", "Cloudy", "Starry", "Moonlit", "Dewy", "Snowy", "Rainy", "Foggy", "Windy", "Lightning", "Thunder", "Icy", "Blazing", "Scorching", "Chilly", "Tropical", "Arctic", "Desert", "Forest", "Mountain", "Ocean", "River", "Meadow", "Prairie", "Valley", "Canyon",    
    
    "Silky", "Fluffy", "Smooth", "Rough", "Velvet", "Crystal", "Metallic", "Glassy", "Wooden", "Stone", "Marble", "Diamond", "Feathery", "Fuzzy", "Spiky", "Bumpy", "Sleek", "Glossy", "Matte", "Textured", "Polished", "Rustic", "Vintage", "Modern", "Classic", "Antique", "Shiny", "Sparkly", "Glittery", "Lustrous",    
    
    "Tiny", "Giant", "Massive", "Miniature", "Colossal", "Petite", "Enormous", "Compact", "Expansive", "Narrow", "Wide", "Tall", "Short", "Long", "Round", "Square", "Triangular", "Oval", "Rectangular", "Curved", "Straight", "Twisted", "Spiral", "Angular", "Smooth-edged", "Sharp-edged", "Pointed", "Blunt", "Tapered", "Broad",    

    "Artistic", "Athletic", "Academic", "Rebellious", "Sophisticated", "Rustic", "Urban", "Wild", "Tame", "Domestic", "Exotic", "Royal", "Noble", "Common", "Rare", "Unique", "Special", "Ordinary", "Extraordinary", "Magical", "Mystical", "Legendary", "Mythical", "Ancient", "Timeless", "Eternal", "Temporary", "Fleeting", "Permanent", "Enduring",    
    
    "Ecstatic", "Melancholy", "Serene", "Anxious", "Confident", "Nervous", "Relaxed", "Excited", "Peaceful", "Restless", "Content", "Worried", "Hopeful", "Doubtful", "Certain", "Confused", "Clear-minded", "Dreamy", "Alert", "Drowsy", "Focused", "Distracted", "Motivated", "Inspired", "Creative", "Logical", "Emotional", "Rational", "Impulsive", "Calculated",    

    "Enchanted", "Spellbound", "Bewitched", "Cursed", "Blessed", "Sacred", "Divine", "Celestial", "Angelic", "Demonic", "Ghostly", "Spectral", "Phantom", "Shadow", "Light", "Dark", "Bright", "Dim", "Glowing", "Radiant", "Luminous", "Brilliant", "Dull", "Vivid", "Faded", "Fresh", "Stale", "New", "Old", "Aged",    
    
    "Swift", "Slow", "Fast", "Quick", "Rapid", "Speedy", "Sluggish", "Zippy", "Lightning-fast", "Snail-paced", "Rushing", "Crawling", "Flying", "Soaring", "Gliding", "Dancing", "Prancing", "Strutting", "Marching", "Tiptoeing", "Stomping", "Skipping", "Hopping", "Leaping", "Bouncing", "Rolling", "Sliding", "Slipping", "Gripping", "Clinging",

    "Cerulean", "Periwinkle", "Charcoal", "Ochre", "Saffron", "Turquoise-tinged", "Emerald-green", "Ruby-red", "Sunset", "Ocean-blue",

    "Drizzly", "Thunderous", "Lightning-struck", "Hazy", "Overcast", "Gale", "Tempestuous", "Wind-swept", "Blustery", "Snow-capped",

    "Crinkled", "Rough-hewn", "Polished-smooth", "Velvety-soft", "Grainy", "Iridescent", "Waxy", "Pebbled", "Fibrous", "Lacy",

    "Microscopic", "Towering", "Bulky", "Slim", "Voluminous", "Pint-sized", "Vast", "Minuscule", "Elongated", "Spherical",

    "Reckless", "Philosophical", "Charismatic", "Stoic", "Gregarious", "Introverted", "Ambivalent", "Tenacious", "Methodical", "Eccentric",

    "Blissful", "Grieving", "Eclectic", "Tense", "Melancholic", "Overjoyed", "Moody", "Pensive", "Jubilant", "Restive",

    "Mystical", "Alchemical", "Occult", "Arcane", "Runic", "Fabled", "Otherworldly", "Sorcerous", "Haunted", "Wizardly",

    "Galloping", "Bounding", "Careening", "Whirling", "Darting", "Skimming", "Spinning", "Twirling", "Hovering", "Sliding-smoothly"

];

const animals = [  
    "Panda", "Tiger", "Fox", "Otter", "Elephant", "Lion", "Rabbit", "Wolf", "Bear", "Koala", "Giraffe", "Monkey", "Hedgehog", "Dolphin", "Eagle", "Penguin", "Squirrel", "Kangaroo", "Leopard", "Owl", "Raccoon", "Deer", "Seal", "Badger", "Cheetah", "Camel", "Buffalo", "Hawk", "Horse", "Alligator", "Moose", "Foxhound", "Falcon", "Goat", "Sheep", "Otterhound", "Shark", "Whale", "Octopus", "Crab", "Lynx", "Panther", "Elephant Seal", "Jaguar", "Frog", "Cobra", "Toucan", "Swan", "Parrot", "Rabbitfish", "Chameleon", "Beaver", "Mole", "Porcupine", "Walrus", "Armadillo", "Ocelot", "Tapir", "Caribou", "Antelope", "Tortoise", "Iguana", "Pelican", "Albatross", "Stingray", "Orangutan", "Sea Lion", "Mandrill", "Buffalo Fish", "Coyote", "Bison", "Wombat", "Macaw", "Kingfisher", "Hummingbird", "Platypus", "Marmoset", "Salamander", "Gecko", "Marlin", "Swordfish", "Pufferfish", "Seahorse", "Llama", "Yak", "Kudu", "Caracal", "Serval", "Nilgai", "Capybara", "Tamarin", "Quokka", "Vulture", "Ibex", "Pangolin", "Aardvark", "Cassowary", "Okapi", "Muskox", "Hyena",    

    "Aardwolf", "Addax", "Alpaca", "Anteater", "Baboon", "Bandicoot", "Bat", "Binturong", "Boar", "Bobcat", "Bongo", "Bushbaby", "Capuchin", "Catamount", "Chamois", "Chimp", "Chinchilla", "Civet", "Coati", "Colugo", "Dingo", "Dromedary", "Duiker", "Echidna", "Eland", "Ferret", "Fossa", "Galago", "Gazelle", "Genet", "Gibbon", "Gnu", "Groundhog", "Guanaco", "Guinea Pig", "Hamster", "Hare", "Hartebeest", "Hippo", "Hog", "Impala", "Jackal", "Jerboa", "Kinkajou", "Klipspringer", "Lemur", "Loris", "Macaque", "Margay", "Marmot", "Meerkat", "Mongoose", "Muntjac", "Nyala", "Opossum", "Oryx", "Peccary", "Pika", "Prairie Dog", "Pronghorn", "Quoll", "Raccoon Dog", "Ram", "Rat", "Rhinoceros", "Sable", "Saiga", "Shrew", "Siamang", "Skunk", "Sloth", "Springbok", "Stoat", "Suni", "Tahr", "Takin", "Tenrec", "Thylacine", "Uakari", "Vicuna", "Vole", "Wallaby", "Warthog", "Waterbuck", "Weasel", "Wildebeest", "Wolverine", "Woodchuck", "Zebra",    

    "Avocet", "Blackbird", "Bluebird", "Booby", "Bustard", "Canary", "Cardinal", "Chickadee", "Cockatoo", "Condor", "Cormorant", "Crane", "Crow", "Cuckoo", "Dove", "Duck", "Egret", "Emu", "Finch", "Flamingo", "Flycatcher", "Gannet", "Goose", "Grouse", "Gull", "Harrier", "Heron", "Hornbill", "Jay", "Kestrel", "Lark", "Magpie", "Martin", "Mockingbird", "Nightjar", "Nuthatch", "Oriole", "Osprey", "Ostrich", "Peacock", "Pheasant", "Pigeon", "Plover", "Ptarmigan", "Puffin", "Quail", "Raven", "Robin", "Sandpiper", "Sparrow", "Starling", "Stork", "Swallow", "Swift", "Tern", "Thrush", "Tit", "Turkey", "Warbler", "Woodpecker", "Wren",    
    
    "Angelfish", "Barracuda", "Bass", "Beluga", "Blowfish", "Catfish", "Clownfish", "Cod", "Eel", "Flounder", "Grouper", "Haddock", "Halibut", "Hammerhead", "Jellyfish", "Lobster", "Mackerel", "Manta Ray", "Moray", "Narwhal", "Piranha", "Ray", "Salmon", "Sardine", "Scallop", "Shrimp", "Snapper", "Sole", "Squid", "Starfish", "Swordfish", "Trout", "Tuna", "Urchin", "Wrasse",    

    "Adder", "Agama", "Anaconda", "Anole", "Basilisk", "Boa", "Cobra", "Copperhead", "Cottonmouth", "Crocodile", "Diamondback", "Gecko", "Gila Monster", "Iguana", "Komodo", "Lizard", "Mamba", "Monitor", "Python", "Rattlesnake", "Skink", "Slider", "Snake", "Taipan", "Tuatara", "Turtle", "Viper", "Newt", "Toad", "Tree Frog", "Bullfrog", "Poison Dart Frog",    

    "Ant", "Bee", "Beetle", "Butterfly", "Caterpillar", "Cricket", "Dragonfly", "Firefly", "Grasshopper", "Ladybug", "Mantis", "Moth", "Scorpion", "Spider", "Tarantula", "Wasp",    

    "Dragon", "Phoenix", "Unicorn", "Griffin", "Pegasus", "Kraken", "Basilisk", "Chimera", "Hydra", "Sphinx", "Minotaur", "Centaur", "Hippogriff",

    "Quagga", "Tarsier", "Binturong", "Markhor", "Pangasius", "Goral", "Serval Cat", "Wallaroo", "Nilgiri Langur", "Fishing Cat",

    "Sunbird", "Kinglet", "Redstart", "Bittern", "Heronlet", "Snowy Owl", "Vulturine", "Whimbrel", "Horned Lark", "Ibis",

    "Anglerfish", "Cuttlefish", "Lionfish", "Blue-ringed Octopus", "Sea Cucumber", "Nudibranch", "Mantis Shrimp", "Comb Jelly", "Pipefish", "Clam",

    "Glass Frog", "Flying Dragon", "Tentacled Snake", "Horned Lizard", "Mudskipper", "Tree Monitor", "Water Dragon", "Caecilian", "Newtling", "Giant Toad",

    "Stick Insect", "Cicada", "Katydid", "Weevil", "Fire Ant", "Hercules Beetle", "Atlas Moth", "Tarantula Hawk", "Orb Weaver", "Praying Mantis",

    "Kirins", "Wendigo", "Naga", "Fenrir", "Thunderbird", "Selkie", "Charybdis", "Leviathan", "Golem", "Bunyip"

];

const generateRandomName = ()=> {

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
//   const number = Math.floor(Math.random() * 1000);
  return `${adj} ${animal}`;

}

export {generateRandomName};
