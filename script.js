let xp = 0
let health = 100
let gold = 50
let currentWeapon = 0
let fighting
let monsterHealth
let inventory = ['batte de baseball']

const button1 = document.querySelector('#button1')
const button2 = document.querySelector('#button2')
const button3 = document.querySelector('#button3')
const text = document.querySelector('#text')
const xpText = document.querySelector('#xpText')
const healthText = document.querySelector('#healthText')
const goldText = document.querySelector('#goldText')
const monsterStats = document.querySelector('#monsterStats')
const monsterName = document.querySelector('#monsterName')
const monsterHealthText = document.querySelector('#monsterHealth')
const weapons = [
  { name: 'batte de baseball', power: 5 },
  { name: 'dague', power: 30 },
  { name: 'marteau', power: 50 },
  { name: 'épée', power: 100 },
]
const monsters = [
  {
    name: 'slime',
    level: 2,
    health: 15,
  },
  {
    name: 'monstre féroce',
    level: 8,
    health: 60,
  },
  {
    name: 'Dragon',
    level: 20,
    health: 300,
  },
]
const locations = [
  {
    name: 'parc',
    'button text': [
      'Aller à la boutique',
      'Aller dans la grotte',
      'Combattre le Dragon',
    ],
    'button functions': [goStore, goCave, fightDragon],
    text: 'Vous êtes dans un parc. Vous voyez une pancarte qui dit "Boutique"',
  },
  {
    name: 'boutique',
    'button text': [
      'Acheter 10 santé (10 euros)',
      'Acheter une arme (30 euros)',
      'Retourner au parc',
    ],
    'button functions': [buyHealth, buyWeapon, goTown],
    text: 'Vous entrez dans la boutique',
  },
  {
    name: 'grotte',
    'button text': [
      'Combattre le slime',
      'Combattre le monstre féroce',
      'Retourner au parc',
    ],
    'button functions': [fightSlime, fightBeast, goTown],
    text: 'Vous entrez dans la grotte. Vous voyez des monstres!',
  },
  {
    name: 'fight',
    'button text': ['Attaque', 'Esquive', 'Fuir'],
    'button functions': [attack, dodge, goTown],
    text: 'Vous combattez un monstre.',
  },
  {
    name: 'tuer le monstre',
    'button text': [
      'Retourner au parc',
      'Retourner au parc',
      'Retourner au parc',
    ],
    'button functions': [goTown, goTown, easterEgg],
    text: "Le monstre crie 'Aaarg!' quand il meurt. Vous gagnez des points d'xp et trouvez de l'argent.",
  },
  {
    name: 'perdu',
    'button text': ['REJOUER?', 'REJOUER?', 'REJOUER?'],
    'button functions': [restart, restart, restart],
    text: 'Vous êtes mort. ☠️',
  },
  {
    name: 'gagné',
    'button text': ['REJOUER?', 'REJOUER?', 'REJOUER?'],
    'button functions': [restart, restart, restart],
    text: 'Vous avez battu le Dragon! VOUS AVEZ GAGNE! 🎉',
  },
  {
    name: 'easter egg',
    'button text': ['2', '8', 'Retourner au parc?'],
    'button functions': [pickTwo, pickEight, goTown],
    text: 'Vous avez trouvé un jeu secret. Choissisez un nombre ci-dessus. Dix nombres sortiront aléatoirement entre 0 et 10. Si vous y trouvez le nombre que vous avez choisis, vous gagnez 20 euros. Sinon, vous perdez 10 Santé.',
  },
]

// initialize buttons
button1.onclick = goStore
button2.onclick = goCave
button3.onclick = fightDragon

function update(location) {
  monsterStats.style.display = 'none'
  button1.innerText = location['button text'][0]
  button2.innerText = location['button text'][1]
  button3.innerText = location['button text'][2]
  button1.onclick = location['button functions'][0]
  button2.onclick = location['button functions'][1]
  button3.onclick = location['button functions'][2]
  text.innerText = location.text
}

function goTown() {
  update(locations[0])
}

function goStore() {
  update(locations[1])
}

function goCave() {
  update(locations[2])
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10
    health += 10
    goldText.innerText = gold
    healthText.innerText = health
  } else {
    text.innerText = "Pas assez d'argent pour acheter de la santé."
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30
      currentWeapon++
      goldText.innerText = gold
      let newWeapon = weapons[currentWeapon].name
      text.innerText = 'Maintenant vous avez un(e) ' + newWeapon + '.'
      inventory.push(newWeapon)
      text.innerText += ' Dans votre inventaire vous avez: ' + inventory
    } else {
      text.innerText = "Pas assez d'argent pour acheter une arme."
    }
  } else {
    text.innerText = "Vous avez déjà l'arme la plus puissante!"
    button2.innerText = 'Vendre une arme pour 15 euros'
    button2.onclick = sellWeapon
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15
    goldText.innerText = gold
    let currentWeapon = inventory.shift()
    text.innerText = 'Vous vendez ' + currentWeapon + '.'
    text.innerText += ' Dans votre inventaire vous avez: ' + inventory
  } else {
    text.innerText = 'Ne vendez pas votre seule arme!'
  }
}

function fightSlime() {
  fighting = 0
  goFight()
}

function fightBeast() {
  fighting = 1
  goFight()
}

function fightDragon() {
  fighting = 2
  goFight()
}

function goFight() {
  update(locations[3])
  monsterHealth = monsters[fighting].health
  monsterStats.style.display = 'block'
  monsterName.innerText = monsters[fighting].name
  monsterHealthText.innerText = monsterHealth
}

function attack() {
  text.innerText = 'Le ' + monsters[fighting].name + ' attaque.'
  text.innerText +=
    " Vous l'attaquez avec votre " + weapons[currentWeapon].name + '.'
  health -= getMonsterAttackValue(monsters[fighting].level)
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1
  } else {
    text.innerText += ' Vous ratez.'
  }
  healthText.innerText = health
  monsterHealthText.innerText = monsterHealth
  if (health <= 0) {
    lose()
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster()
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += ' Votre ' + inventory.pop() + ' casse.'
    currentWeapon--
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp)
  console.log(hit)
  return hit > 0 ? hit : 0
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20
}

function dodge() {
  text.innerText = "Vous esquivez l'attaque du " + monsters[fighting].name
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7)
  xp += monsters[fighting].level
  goldText.innerText = gold
  xpText.innerText = xp
  update(locations[4])
}

function lose() {
  update(locations[5])
}

function winGame() {
  update(locations[6])
}

function restart() {
  xp = 0
  health = 100
  gold = 50
  currentWeapon = 0
  inventory = ['batte de baseball']
  goldText.innerText = gold
  healthText.innerText = health
  xpText.innerText = xp
  goTown()
}

function easterEgg() {
  update(locations[7])
}

function pickTwo() {
  pick(2)
}

function pickEight() {
  pick(8)
}

function pick(guess) {
  const numbers = []
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11))
  }
  text.innerText =
    'Vous choisissez ' + guess + '. Voici les nombres aléatoires:\n'
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + '\n'
  }
  if (numbers.indexOf(guess) !== -1) {
    text.innerText += 'Super! Vous gagnez 20 euros!'
    gold += 20
    goldText.innerText = gold
  } else {
    text.innerText += 'Zut! Vous perdez 10 en santé!'
    health -= 10
    healthText.innerText = health
    if (health <= 0) {
      lose()
    }
  }
}
