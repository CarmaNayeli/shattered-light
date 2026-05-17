import type { ArchetypeKey, GemType, StatKey, Stats, WeaponTag } from '../types/character'

// ── Archetype definitions ────────────────────────────────────────────────────

export interface ArchetypeDef {
  label: string
  diamond: string
  tagline: string
  ceilings: Stats
  affiliation: string
  affiliationDesc: string
  startingMove: string
  startingMoveDesc: string
  shadow: string
  archetypeQuestions: string[]
}

export const ARCHETYPES: Record<ArchetypeKey, ArchetypeDef> = {
  leader: {
    label: 'Leader',
    diamond: 'White Diamond',
    tagline: '"Every gem has a purpose. Including you."',
    ceilings: { form: 3, clarity: 4, resonance: 2, radiance: 3, resolve: 4 },
    affiliation: 'The Architecture',
    affiliationDesc: 'Organizational knowledge — chain of command, patrol schedules, resource networks. Invaluable for planning; terrifying to enemies who underestimate how well you understand their systems.',
    startingMove: 'Hold the Line',
    startingMoveDesc: 'Once per session declare a course of action. Every gem who follows adds one bonus die to their first roll in that action. Gems who don\'t follow add nothing — and you know who didn\'t.',
    shadow: 'Resonance cap lifts when someone else is right without you framing it as your decision.',
    archetypeQuestions: [
      'What order did you give that you\'re still second-guessing?',
      'What would it mean to you if the rebellion won but you weren\'t the one who led it there?',
    ],
  },
  soldier: {
    label: 'Soldier',
    diamond: 'Yellow Diamond',
    tagline: '"Hesitation is the only failure."',
    ceilings: { form: 5, clarity: 3, resonance: 2, radiance: 2, resolve: 4 },
    affiliation: 'The Front',
    affiliationDesc: 'Contacts across Homeworld\'s military — current soldiers, former soldiers, gems quietly asking questions they\'re not supposed to ask. Access is fragile and GM-tracked.',
    startingMove: 'First Strike',
    startingMoveDesc: 'When you act before anyone else in a scene — before a plan is formed — roll Form with an extra die. Clean success sets the terms of the conflict. A miss commits everyone before they were ready.',
    shadow: 'Radiance cap lifts when you do something purely expressive with no tactical justification — and it costs you something, even something small.',
    archetypeQuestions: [
      'What order did you carry out that you\'re still carrying?',
      'What does your body know how to do that your mind has decided it won\'t?',
    ],
  },
  scholar: {
    label: 'Scholar',
    diamond: 'Blue Diamond',
    tagline: '"To understand is to preserve."',
    ceilings: { form: 2, clarity: 5, resonance: 3, radiance: 3, resolve: 3 },
    affiliation: 'The Archive',
    affiliationDesc: 'Access to gem history, corrupted gem taxonomy, pre-war records, planetary surveys. Once per session ask the GM one question about the world\'s history or a gem\'s origins — they must answer honestly.',
    startingMove: 'Read the Room',
    startingMoveDesc: 'When you enter a new scene, ask the GM one free question about what\'s really happening beneath the surface — an emotional current, a hidden agenda, a structural weakness. No roll required.',
    shadow: 'Resolve cap lifts when the Scholar chooses to fight for something rather than preserve it. Active rather than archival. The choice has to hurt a little.',
    archetypeQuestions: [
      'What do you know that you wish you didn\'t?',
      'What have you been studying that has nothing to do with the rebellion and everything to do with what you\'re afraid of?',
    ],
  },
  diplomat: {
    label: 'Diplomat',
    diamond: 'Pink Diamond',
    tagline: '"But what do they want?"',
    ceilings: { form: 2, clarity: 3, resonance: 5, radiance: 3, resolve: 3 },
    affiliation: 'The Network',
    affiliationDesc: 'Contacts across factions — gems who owe you, trust you, or don\'t know you\'ve switched sides. Once per session invoke a contact for information, access, or a favor.',
    startingMove: 'Open Channel',
    startingMoveDesc: 'When you attempt to de-escalate through conversation rather than force, roll Resonance with an extra die. On a Resonance result, the enemy tells you something true about themselves or their orders.',
    shadow: 'NPCs may clock the resemblance between your instincts and Pink Diamond\'s. That\'s not a penalty — it\'s a story.',
    archetypeQuestions: [
      'When did you last say what you actually meant without calculating the impact first?',
      'What do you understand about Pink Diamond that you\'ve never told the others?',
    ],
  },
  rebel: {
    label: 'Rebel',
    diamond: 'No Diamond',
    tagline: '"I\'m figuring it out."',
    ceilings: { form: 4, clarity: 4, resonance: 4, radiance: 4, resolve: 4 },
    affiliation: 'None — Open Question',
    affiliationDesc: 'No network. Instead you have an open question on your sheet — something you don\'t know about yourself yet. The GM holds the answer. It surfaces in play.',
    startingMove: 'Improvise',
    startingMoveDesc: 'Once per session, when you do something no trained gem of any court would try, roll Radiance instead of whatever stat would normally apply. If it works, it surprises even you.',
    shadow: 'No stat reaches 5 at creation. All ceilings to 5 require the full arc of play to reach — because every point has to be entirely self-built.',
    archetypeQuestions: [
      'The open question on your sheet — write it here in full. What don\'t you know about yourself yet?',
      'Where did you sleep the first night after you left? Describe it.',
      'Who taught you the first thing you learned that Homeworld didn\'t want you to know?',
    ],
  },
}

// ── Gem type definitions ─────────────────────────────────────────────────────

export type Court = 'white' | 'yellow' | 'blue' | 'pink' | 'cross'

export interface WeaponOption {
  name: string
  tags: WeaponTag[]
}

export interface PowerDef {
  name: string
  desc: string
}

export interface GemTypeDef {
  label: string
  court: Court
  recommendedArchetypes: ArchetypeKey[]
  rebelNote?: string   // e.g. "Rebel requires GM approval"
  weapons: WeaponOption[]
  corePower: PowerDef
  developedPowers: [PowerDef, PowerDef]
}

export const GEM_TYPES: Record<GemType, GemTypeDef> = {
  // ── White Diamond's Court ─────────────────────────────────────────────────
  diamond: {
    label: 'Diamond',
    court: 'white',
    recommendedArchetypes: ['leader'],
    rebelNote: 'Rebel requires explicit GM and full table approval.',
    weapons: [
      { name: 'Hard light constructs', tags: ['area', 'heavy'] },
      { name: 'Hard light blade', tags: ['reach', 'piercing'] },
      { name: 'Unarmed', tags: ['heavy'] },
    ],
    corePower: {
      name: 'Diamond Resonance',
      desc: 'Your voice carries authority at a frequency other gems feel physically. You can issue a command that bypasses conscious resistance — not mind control, but a compulsion that costs Resolve to ignore.',
    },
    developedPowers: [
      { name: 'Corruption Wave (controlled)', desc: 'A focused burst that overwhelms a gem\'s form temporarily without corrupting — destabilizing rather than harming.' },
      { name: 'Light Manifestation', desc: 'Create fully realized constructs of hard light — structures, illusions, environments. Limited by your Radiance.' },
    ],
  },
  goshenite: {
    label: 'Goshenite',
    court: 'white',
    recommendedArchetypes: ['leader'],
    rebelNote: 'Rebel requires GM approval.',
    weapons: [
      { name: 'Measurement rod', tags: ['reach', 'finesse'] },
      { name: 'Twin blades', tags: ['paired', 'finesse'] },
      { name: 'Crystalline whip', tags: ['reach', 'binding'] },
    ],
    corePower: {
      name: 'Assessment',
      desc: 'Evaluate any gem\'s approximate stat spread at a glance with a Clarity roll. Cannot assess fusions — they read as something genuinely new.',
    },
    developedPowers: [
      { name: 'Devalue', desc: 'Identify and name a gem\'s conditioned weakness. They roll their next action against it with one fewer die.' },
      { name: 'Reassign', desc: 'Issue bureaucratically-framed commands that Homeworld-conditioned gems find difficult to parse as hostile.' },
    ],
  },
  howlite: {
    label: 'Howlite',
    court: 'white',
    recommendedArchetypes: ['leader', 'scholar'],
    weapons: [
      { name: 'Stone tablet', tags: ['heavy', 'area'] },
      { name: 'Crystalline stylus', tags: ['finesse', 'piercing'] },
      { name: 'Staff', tags: ['reach', 'heavy'] },
    ],
    corePower: {
      name: 'Institutional Memory',
      desc: 'Perfect recall of everything you\'ve ever recorded. Once per scene ask the GM one question about Homeworld\'s history, structures, or procedures.',
    },
    developedPowers: [
      { name: 'Rewrite', desc: 'Alter documents and data constructs with a touch. Forgeries are essentially undetectable to anyone who doesn\'t already know the truth.' },
      { name: 'Erase', desc: 'Suppress a specific memory from a willing or incapacitated gem — not permanently, but long enough to matter. Unwilling targets require a contested Clarity roll.' },
    ],
  },
  spinel: {
    label: 'Spinel',
    court: 'white',
    recommendedArchetypes: ['leader', 'diplomat'],
    weapons: [
      { name: 'Rejuvenator', tags: ['finesse', 'reach'] },
      { name: 'Elastic limbs', tags: ['reach', 'paired'] },
      { name: 'Yo-yo', tags: ['reach', 'binding'] },
    ],
    corePower: {
      name: 'Elasticity',
      desc: 'Your form is more malleable than other gems. Stretch, compress, and reshape beyond normal shapeshifting — changing geometry, not just appearance. Fit through impossible spaces, absorb impacts.',
    },
    developedPowers: [
      { name: 'Reset Touch', desc: 'A controlled application of rejuvenator energy through contact. Temporarily suppress a gem\'s most recently developed capability. It returns, but not immediately.' },
      { name: 'Transformation', desc: 'Full form changes — appearance, voice, apparent gem type. Maintaining a transformation requires concentration and a Radiance roll for anything longer than a scene.' },
    ],
  },
  moonstone: {
    label: 'Moonstone',
    court: 'white',
    recommendedArchetypes: ['leader', 'diplomat'],
    weapons: [
      { name: 'Dual blades', tags: ['paired', 'finesse'] },
      { name: 'Moonbeam lance', tags: ['reach', 'piercing'] },
      { name: 'Reflective shield', tags: ['area'] },
    ],
    corePower: {
      name: 'Phase Shift',
      desc: 'Become partially incorporeal — not invisible, but difficult to physically interact with. Attacks pass through at reduced effect. Cannot attack while phased. Can move through thin barriers.',
    },
    developedPowers: [
      { name: 'Reflection', desc: 'Redirect a gem power attack back toward its source. Requires a Clarity roll and precise timing.' },
      { name: 'Lunar Pull', desc: 'A subtle gravitational influence making gems near you slightly more inclined toward honesty and calm. Detectable by gems with strong Clarity.' },
    ],
  },
  selenite: {
    label: 'Selenite',
    court: 'white',
    recommendedArchetypes: ['leader', 'scholar'],
    weapons: [
      { name: 'Crystal blade', tags: ['finesse', 'piercing'] },
      { name: 'Light staff', tags: ['reach', 'area'] },
      { name: 'Unarmed', tags: ['finesse'] },
    ],
    corePower: {
      name: 'Structural Clarity',
      desc: 'Perceive the underlying architecture of situations, systems, and gems — load-bearing elements, stress fractures, points of maximum vulnerability. Once per scene identify the single most vulnerable point.',
    },
    developedPowers: [
      { name: 'Light Amplification', desc: 'Gather and focus ambient light into a damaging beam. Diminished in darkness; more dangerous in bright conditions.' },
      { name: 'Resonant Frequency', desc: 'Identify and produce the specific frequency that destabilizes a particular gem construct or structure — built things, not living gems.' },
    ],
  },

  // ── Yellow Diamond's Court ────────────────────────────────────────────────
  topaz: {
    label: 'Topaz',
    court: 'yellow',
    recommendedArchetypes: ['soldier'],
    rebelNote: 'Rebel requires GM approval.',
    weapons: [
      { name: 'Mace', tags: ['heavy', 'binding'] },
      { name: 'Amber construct', tags: ['binding', 'area'] },
      { name: 'Twin maces', tags: ['paired', 'heavy'] },
    ],
    corePower: {
      name: 'Containment Field',
      desc: 'Generate a hardened energy construct around a target that immobilizes completely. Requires physical contact to initiate and a Form roll to maintain. The field doesn\'t harm — it holds.',
    },
    developedPowers: [
      { name: 'Fusion Pressure', desc: 'When fused (or with GM approval), extend the containment field to cover a much larger area.' },
      { name: 'Amber Seal', desc: 'A permanent-grade containment nearly impossible to break from within. Rarely used. Has obvious ethical implications.' },
    ],
  },
  jasper: {
    label: 'Jasper',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'rebel'],
    weapons: [
      { name: 'Crash helmet', tags: ['heavy', 'area'] },
      { name: 'War hammer', tags: ['heavy', 'reach'] },
      { name: 'Bare hands', tags: ['heavy'] },
    ],
    corePower: {
      name: 'Perfect Quartz',
      desc: 'Your form is exceptionally resilient. Once per conflict ignore the mechanical effects of a single significant hit — taking it narratively but suffering no Harmony loss or stat penalties.',
    },
    developedPowers: [
      { name: 'Charge', desc: 'Lower your head and close distance at full force, crashing through anything in the way. Clean success knocks the target back and disadvantages their next roll.' },
      { name: 'Relentless', desc: 'Once per conflict, when you are poofed, return to the scene at Form 1 rather than sitting out. You don\'t resist the poof — you simply refuse to stay down.' },
    ],
  },
  ruby: {
    label: 'Ruby',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'rebel'],
    weapons: [
      { name: 'Gauntlet', tags: ['heavy', 'finesse'] },
      { name: 'Short sword', tags: ['finesse', 'paired'] },
      { name: 'Combat shield', tags: ['binding', 'heavy'] },
    ],
    corePower: {
      name: 'Heat',
      desc: 'Generate intense heat from your gem — superheated strikes, close-range fire projection, melting through barriers. Sustained output requires concentration.',
    },
    developedPowers: [
      { name: 'Thermal Vision', desc: 'Perceive heat signatures — tracking, detecting hidden gems, reading emotional states. Works in darkness.' },
      { name: 'Rage Ignition', desc: 'When Resolve drops below 2, your heat output doubles automatically. You don\'t control this. More dangerous; significantly harder to reason with.' },
    ],
  },
  amethyst: {
    label: 'Amethyst',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'rebel'],
    weapons: [
      { name: 'Whip', tags: ['reach', 'binding'] },
      { name: 'Flail', tags: ['heavy', 'reach'] },
      { name: 'Dagger', tags: ['concealed', 'finesse'] },
    ],
    corePower: {
      name: 'Shapeshifting',
      desc: 'Your shapeshifting is more fluid and faster than other gems. Change form mid-combat, hold a shape longer under pressure, and copy appearances with precision.',
    },
    developedPowers: [
      { name: 'Size Manipulation', desc: 'Grow significantly larger (adds Heavy to attacks) or compress significantly smaller (adds Concealed to your presence entirely).' },
      { name: 'Spin Dash', desc: 'Compress your form and launch as a spinning projectile. Devastating on impact, difficult to steer. You are the area.' },
    ],
  },
  bismuth: {
    label: 'Bismuth',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'leader'],
    weapons: [
      { name: 'Shifting weapon', tags: ['heavy'] },
      { name: 'War hammer', tags: ['heavy', 'area'] },
      { name: 'Breaking Point', tags: ['piercing', 'heavy'] },
    ],
    corePower: {
      name: 'Constructs',
      desc: 'Shape gem-metal and hard light into structures, weapons, and tools on the fly. In combat: barriers, traps, improvised weapons for allies. Outside combat: nearly limitless given time and materials.',
    },
    developedPowers: [
      { name: 'Forge', desc: 'Permanently upgrade another gem\'s summoned weapon — adding a tag or enhancing an existing one. Requires time and focused work. Lasts until the weapon is re-summoned from scratch.' },
      { name: 'Deconstruct', desc: 'Break down gem constructs by identifying their resonant frequency. Faster and more precise than simply hitting them.' },
    ],
  },
  agate: {
    label: 'Agate',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'leader'],
    weapons: [
      { name: 'Whip', tags: ['reach', 'binding'] },
      { name: 'Baton', tags: ['finesse', 'heavy'] },
      { name: 'Energy lash', tags: ['reach', 'area'] },
    ],
    corePower: {
      name: 'Aura of Authority',
      desc: 'Your presence carries weight other gems feel as pressure. Gems conditioned to Homeworld hierarchy find your direct instructions difficult to casually ignore.',
    },
    developedPowers: [
      { name: 'Terrify', desc: 'A focused blast of your authority aura that temporarily overwhelms a single target\'s ability to access their Form or Resolve. One exchange.' },
      { name: 'Rally', desc: 'The same aura turned toward allies. Once per conflict restore one Harmony to a fusion or give an ally a reroll on a failed Resolve check.' },
    ],
  },
  onyx: {
    label: 'Onyx',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'rebel'],
    weapons: [
      { name: 'Twin daggers', tags: ['paired', 'concealed'] },
      { name: 'Garrote construct', tags: ['binding', 'concealed'] },
      { name: 'Short blade', tags: ['finesse', 'concealed'] },
    ],
    corePower: {
      name: 'Shadow Form',
      desc: 'Nearly invisible in low-light conditions. In full darkness completely undetectable by sight. Bright light suppresses this entirely.',
    },
    developedPowers: [
      { name: 'Dark Construct', desc: 'Create objects from solidified shadow — barriers, decoys, crude tools. Fully physical until light touches them.' },
      { name: 'Null Presence', desc: 'Beyond visual concealment, suppress your gem\'s signature — other gems cannot sense your presence, power, or emotional state.' },
    ],
  },
  hessonite: {
    label: 'Hessonite',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'leader'],
    weapons: [
      { name: 'Command baton', tags: ['heavy', 'binding'] },
      { name: 'War hammer', tags: ['heavy', 'area'] },
      { name: 'Dual short swords', tags: ['paired', 'finesse'] },
    ],
    corePower: {
      name: 'Command Presence',
      desc: 'Your voice in conflict carries tactical authority. Once per conflict issue a tactical directive that gives every ally who follows it a bonus die on their next roll.',
    },
    developedPowers: [
      { name: 'Read the Field', desc: 'At the start of any conflict ask the GM two tactical questions — enemy numbers, positions, capabilities, objectives. True as of that moment.' },
      { name: 'Rally Point', desc: 'Designate a position as a rally point. Allies who reach it recover one point of Form damage and gain a bonus die on their next Resolve roll.' },
    ],
  },

  // ── Blue Diamond's Court ──────────────────────────────────────────────────
  sapphire: {
    label: 'Sapphire',
    court: 'blue',
    recommendedArchetypes: ['scholar', 'diplomat'],
    weapons: [
      { name: 'Ice constructs', tags: ['area', 'binding'] },
      { name: 'Elegant blade', tags: ['finesse', 'reach'] },
      { name: 'Unarmed', tags: ['finesse'] },
    ],
    corePower: {
      name: 'Future Vision',
      desc: 'Once per conflict declare you knew something was coming — a trap, an ambush, a lie — even if you didn\'t say so at the time. Outside combat attempt deliberate visions with a Clarity roll.',
    },
    developedPowers: [
      { name: 'Shared Vision', desc: 'Show another gem a future you\'ve seen — through touch, eye contact, or description. What they do with it is their choice.' },
      { name: 'Ice Mastery', desc: 'Control over cold extends beyond weapon summoning — freeze liquids, lower temperatures, create barriers, encase targets.' },
    ],
  },
  lapis: {
    label: 'Lapis Lazuli',
    court: 'blue',
    recommendedArchetypes: ['scholar', 'rebel'],
    weapons: [
      { name: 'Water constructs', tags: ['area', 'reach'] },
      { name: 'Hydrokinetic lash', tags: ['reach', 'binding'] },
      { name: 'Mirror trap', tags: ['binding', 'area'] },
    ],
    corePower: {
      name: 'Hydrokinesis',
      desc: 'Control water — any water, in any form, within sight. Scale scales with Form and emotional state. At full strength you can move oceans. At low Harmony your control becomes erratic.',
    },
    developedPowers: [
      { name: 'Wings', desc: 'Hard water wings allow flight. Airborne, your hydrokinesis range extends significantly.' },
      { name: 'Mirror Prison', desc: 'Trap a gem in a reflective water construct — not just restrained but isolated, cut off from outside contact. You know this from experience.' },
    ],
  },
  aquamarine: {
    label: 'Aquamarine',
    court: 'blue',
    recommendedArchetypes: ['scholar', 'soldier'],
    weapons: [
      { name: 'Wand', tags: ['reach', 'binding'] },
      { name: 'Small blade', tags: ['finesse', 'concealed'] },
      { name: 'Tether construct', tags: ['binding', 'reach'] },
    ],
    corePower: {
      name: 'Flight',
      desc: 'You fly naturally and with precision — not wings, self-propelled. Small size and flight make you genuinely difficult to catch. Hover indefinitely, move at significant speed.',
    },
    developedPowers: [
      { name: 'Retrieval Construct', desc: 'An enhanced wand function — fires a capturing construct that pursues a target before dissipating.' },
      { name: 'Sonic Attack', desc: 'At close range a high-frequency burst that disrupts a gem\'s ability to maintain their form. Doesn\'t poof — destabilizes. Makes their next roll significantly harder.' },
    ],
  },
  zircon: {
    label: 'Zircon',
    court: 'blue',
    recommendedArchetypes: ['scholar', 'diplomat'],
    weapons: [
      { name: 'Briefcase construct', tags: ['binding', 'heavy'] },
      { name: 'Rapier', tags: ['finesse', 'reach'] },
      { name: 'Document blade', tags: ['finesse', 'concealed'] },
    ],
    corePower: {
      name: 'Legal Mind',
      desc: 'Construct an airtight argument under any circumstances. Once per scene reframe a situation in a way that changes what options are available. Doesn\'t create facts — changes how they\'re understood.',
    },
    developedPowers: [
      { name: 'Expose Contradiction', desc: 'Identify and name the logical flaw in an opponent\'s position with enough precision that they lose access to that argument for the rest of the scene.' },
      { name: 'Reasonable Doubt', desc: 'Introduce enough uncertainty about an established fact that it can no longer be used against you or your allies in the current situation.' },
    ],
  },
  labradorite: {
    label: 'Labradorite',
    court: 'blue',
    recommendedArchetypes: ['scholar', 'rebel'],
    weapons: [
      { name: 'Light refraction', tags: ['area', 'concealed'] },
      { name: 'Staff', tags: ['reach', 'heavy'] },
      { name: 'Crystal shards', tags: ['area', 'finesse'] },
    ],
    corePower: {
      name: 'Labradorescence',
      desc: 'Refract and manipulate light — bending it for concealment, focusing it into blinding flashes, creating visual phenomena indistinguishable from reality. Sustained illusions require concentration.',
    },
    developedPowers: [
      { name: 'Deep Field Vision', desc: 'Perceive things at extreme distances and detect phenomena other gems can\'t register — warp signatures, corruption traces, gem power residue.' },
      { name: 'Spectral Form', desc: 'Make yourself appear to be somewhere you aren\'t — a full visual duplicate, in place, doing something plausible, while you\'re elsewhere. Lasts until something tries to touch it.' },
    ],
  },
  iolite: {
    label: 'Iolite',
    court: 'blue',
    recommendedArchetypes: ['scholar', 'leader'],
    weapons: [
      { name: 'Trichroic blade', tags: ['finesse', 'piercing'] },
      { name: 'Twin batons', tags: ['paired', 'heavy'] },
      { name: 'Analysis construct', tags: ['area', 'finesse'] },
    ],
    corePower: {
      name: 'Trichroism',
      desc: 'Your perception covers three visual spectra simultaneously — visible, near-infrared, and ultraviolet. Hidden writing, concealed gems, invisible constructs, and emotional heat signatures are all visible.',
    },
    developedPowers: [
      { name: 'Structural Analysis', desc: 'Look at any system and identify both its function and its failure points. Slower than Selenite\'s clarity but precise enough for detailed planning.' },
      { name: 'Directional Sense', desc: 'Always know your exact position relative to any point you\'ve been. Cannot be lost. Build a complete spatial map as you move through unfamiliar locations.' },
    ],
  },
  nephrite: {
    label: 'Nephrite',
    court: 'blue',
    recommendedArchetypes: ['scholar', 'soldier'],
    weapons: [
      { name: 'Combat staff', tags: ['reach', 'heavy'] },
      { name: 'Energy blade', tags: ['finesse', 'reach'] },
      { name: 'Throwing constructs', tags: ['area', 'reach'] },
    ],
    corePower: {
      name: 'Navigation',
      desc: 'Always know exactly where you are in space — planetary coordinates, stellar position, warp coordinates. Calculate routes with precision and detect warp instability before it becomes dangerous.',
    },
    developedPowers: [
      { name: 'Warp Detection', desc: 'Sense active warp pads and signatures within a significant radius. Know when someone has recently warped and where they went if you reach the pad quickly enough.' },
      { name: 'Aerial Form', desc: 'Take a partial flight form. Faster than walking, useful for reconnaissance, uncomfortable to maintain long.' },
    ],
  },

  // ── Pink Diamond's Court ──────────────────────────────────────────────────
  roseQuartz: {
    label: 'Rose Quartz',
    court: 'pink',
    recommendedArchetypes: ['diplomat', 'soldier'],
    weapons: [
      { name: 'Shield', tags: ['area', 'heavy'] },
      { name: 'Sword', tags: ['reach', 'finesse'] },
      { name: 'Unarmed', tags: ['heavy'] },
    ],
    corePower: {
      name: 'Healing',
      desc: 'Heal physical damage to gem forms — closing cracks, restoring poofed gems more quickly, partially repairing cracked gems. Requires physical contact and costs you Form temporarily.',
    },
    developedPowers: [
      { name: 'Healing Tears', desc: 'Your healing extends to emotional damage — not erasing it, but making it survivable. A gem in crisis can function through something that would otherwise incapacitate them.' },
      { name: 'Protective Bubble', desc: 'Generate a hard-light shield around another gem or group. While maintaining it you can\'t attack.' },
    ],
  },
  emerald: {
    label: 'Emerald',
    court: 'pink',
    recommendedArchetypes: ['diplomat', 'leader'],
    weapons: [
      { name: 'Command whip', tags: ['reach', 'binding'] },
      { name: 'Emerald blade', tags: ['finesse', 'piercing'] },
      { name: 'Ship-based weapons', tags: ['area', 'heavy'] },
    ],
    corePower: {
      name: 'Command Authority',
      desc: 'Access to Homeworld shipping and transport networks — authorization codes, routing, docking clearances. Once per session invoke a legitimate-sounding Homeworld authorization to get through a bureaucratic obstacle.',
    },
    developedPowers: [
      { name: 'Status Projection', desc: 'Make any gem you\'re with appear to be higher status than they are. Works until someone checks the records or a genuinely high-status gem looks closely.' },
      { name: 'Void the Authorization', desc: 'Revoke someone else\'s clearances, freeze their access, or flag their authorization as compromised.' },
    ],
  },
  morganite: {
    label: 'Morganite',
    court: 'pink',
    recommendedArchetypes: ['diplomat', 'leader'],
    weapons: [
      { name: 'Whip', tags: ['reach', 'binding'] },
      { name: 'Elegant baton', tags: ['finesse', 'heavy'] },
      { name: 'Dismissal construct', tags: ['binding', 'area'] },
    ],
    corePower: {
      name: 'Oversight',
      desc: 'Know the official status, assignment, and recorded history of any gem you\'ve interacted with through Homeworld\'s systems. Know when a gem\'s actual behavior deviates from their recorded function.',
    },
    developedPowers: [
      { name: 'Reassignment Order', desc: 'Issue a reassignment that Homeworld-conditioned gems feel compelled to follow — bureaucratic compulsion that feels like paperwork rather than an order.' },
      { name: 'Cover Story', desc: 'Construct a complete false record for a gem or group — fake assignment, fake history, fake authorization. Holds up to casual scrutiny.' },
    ],
  },
  kunzite: {
    label: 'Kunzite',
    court: 'pink',
    recommendedArchetypes: ['diplomat', 'scholar'],
    weapons: [
      { name: 'Dual fans', tags: ['paired', 'finesse'] },
      { name: 'Elegant blade', tags: ['finesse', 'concealed'] },
      { name: 'Emotional construct', tags: ['area', 'binding'] },
    ],
    corePower: {
      name: 'Emotional Fluency',
      desc: 'Read emotional states with precision through observation. Always know the general emotional state of any gem you\'re in direct conversation with, and can identify when they\'re suppressing something significant.',
    },
    developedPowers: [
      { name: 'Mirror Affect', desc: 'Reflect a gem\'s emotional state back at them with amplified clarity — making them feel what they\'re actually feeling more intensely. Can be overwhelming if used without care.' },
      { name: 'Neutral Ground', desc: 'Establish a conversational space in which neither party feels threatened enough to escalate. Lasts as long as both parties find it useful and you maintain it actively.' },
    ],
  },
  tourmaline: {
    label: 'Tourmaline',
    court: 'pink',
    recommendedArchetypes: ['diplomat', 'rebel'],
    weapons: [
      { name: 'Color-shifting blade', tags: ['finesse', 'concealed'] },
      { name: 'Multi-spectrum construct', tags: ['area', 'finesse'] },
      { name: 'Twin weapons', tags: ['paired', 'finesse'] },
    ],
    corePower: {
      name: 'Spectrum Shift',
      desc: 'Alter your own coloring, apparent gem type, and surface presentation at will — more comprehensive than shapeshifting, specifically covering the social signals other gems use to place you in the hierarchy.',
    },
    developedPowers: [
      { name: 'Broad Reception', desc: 'Communicate meaningfully with gems from any court without triggering instinctive wariness. You read as belonging wherever you are, at least initially.' },
      { name: 'Frequency Match', desc: 'Identify the specific social register a gem is operating on — what they need to hear, what authority they\'re conditioned to respect — and match it precisely.' },
    ],
  },
  turquoise: {
    label: 'Turquoise',
    court: 'pink',
    recommendedArchetypes: ['diplomat', 'scholar'],
    weapons: [
      { name: 'Ancient blade', tags: ['finesse', 'heavy'] },
      { name: 'Protective construct', tags: ['area', 'binding'] },
      { name: 'Staff', tags: ['reach', 'heavy'] },
    ],
    corePower: {
      name: 'Ancient Knowing',
      desc: 'You have existed through multiple eras of Homeworld\'s history. Once per session identify a precedent, loophole, or historical exception that technically applies — something that predates current law and hasn\'t been formally rescinded.',
    },
    developedPowers: [
      { name: 'Cultural Memory', desc: 'Know histories that predate current Homeworld records. The GM tells you one true suppressed historical fact per session.' },
      { name: 'Weathered Form', desc: 'Your long existence has made your physical form exceptionally stable. Once per conflict re-enter a scene after being poofed without the usual recovery time.' },
    ],
  },

  // ── Cross-Court Gems ──────────────────────────────────────────────────────
  pearl: {
    label: 'Pearl',
    court: 'cross',
    recommendedArchetypes: ['leader', 'scholar', 'diplomat', 'rebel'],
    weapons: [
      { name: 'Spear', tags: ['reach', 'finesse'] },
      { name: 'Sword', tags: ['finesse', 'paired'] },
      { name: 'Holographic constructs', tags: ['area', 'concealed'] },
    ],
    corePower: {
      name: 'Holographic Projection',
      desc: 'Project detailed holograms from your gem — recordings, maps, schematics, visual information. Purely visual, no physical presence. Project decoys of yourself or others. Resolution limited only by Clarity.',
    },
    developedPowers: [
      { name: 'Subspace Storage', desc: 'Store objects inside your gem — physically, not as projections. Limited but significant capacity. Completely undetectable. Retrieved instantly.' },
      { name: 'Skill Absorption', desc: 'Learn physical and technical skills by observing them once, retaining them permanently. This gives knowledge, not stats — but it\'s often enough.' },
    ],
  },
  peridot: {
    label: 'Peridot',
    court: 'cross',
    recommendedArchetypes: ['scholar', 'soldier'],
    weapons: [
      { name: 'Limb enhancers', tags: ['reach', 'heavy'] },
      { name: 'Ferrokinetic constructs', tags: ['area', 'reach'] },
      { name: 'Tech blade', tags: ['finesse', 'reach'] },
    ],
    corePower: {
      name: 'Ferrokinesis',
      desc: 'Control metal and metal-adjacent materials at range with technical precision. Manipulate Homeworld technology, disassemble constructs, retrieve objects, and fight without closing distance.',
    },
    developedPowers: [
      { name: 'Technology Interface', desc: 'Connect directly with Homeworld technology through touch — reading, operating, and reprogramming systems. Non-Homeworld technology requires more effort and a Clarity roll.' },
      { name: 'Tactical Analysis', desc: 'Your engineering mind extends to conflict. Once per conflict the GM tells you one true thing about the most effective path through the current situation.' },
    ],
  },
  jade: {
    label: 'Jade',
    court: 'cross',
    recommendedArchetypes: ['diplomat', 'scholar'],
    weapons: [
      { name: 'Twin short swords', tags: ['paired', 'finesse'] },
      { name: 'Jade construct', tags: ['heavy', 'binding'] },
      { name: 'Staff', tags: ['reach', 'heavy'] },
    ],
    corePower: {
      name: 'Durability',
      desc: 'Your physical form is exceptionally dense and stable. Once per conflict when you would be poofed, remain present at Form 1 — barely holding together but still in the fight.',
    },
    developedPowers: [
      { name: 'Grounding Presence', desc: 'Allies in your immediate vicinity gain a bonus die on Resolve rolls to resist being poofed or destabilized while you\'re standing.' },
      { name: 'Jade Sense', desc: 'Your long experience reading situations gives you acute awareness of deception. You can always tell when a gem is performing rather than being genuine — not the truth, just that it isn\'t.' },
    ],
  },
  citrine: {
    label: 'Citrine',
    court: 'cross',
    recommendedArchetypes: ['soldier', 'diplomat'],
    weapons: [
      { name: 'Energy sword', tags: ['finesse', 'reach'] },
      { name: 'War hammer', tags: ['heavy', 'area'] },
      { name: 'Dual blades', tags: ['paired', 'finesse'] },
    ],
    corePower: {
      name: 'Adaptability',
      desc: 'Once per conflict switch which stat you\'re rolling for a physical action — using Clarity instead of Form for a precise strike, Resolve instead of Form to push through on willpower.',
    },
    developedPowers: [
      { name: 'Read the Assignment', desc: 'Once per session the GM tells you what this scene most needs from the party.' },
      { name: 'Warm Presence', desc: 'Gems who have just met you treat you as though they\'ve known you slightly longer than they have. Especially useful in infiltration and first contact situations.' },
    ],
  },
}

// ── Lookup helpers ────────────────────────────────────────────────────────────

export function getArchetype(key: ArchetypeKey): ArchetypeDef {
  return ARCHETYPES[key]
}

export function getGemType(key: GemType): GemTypeDef {
  return GEM_TYPES[key]
}

export const STAT_KEYS: StatKey[] = ['form', 'clarity', 'resonance', 'radiance', 'resolve']
export const STAT_NAMES: Record<StatKey, string> = {
  form:      'Form',
  clarity:   'Clarity',
  resonance: 'Resonance',
  radiance:  'Radiance',
  resolve:   'Resolve',
}
export const STAT_DESCS: Record<StatKey, string> = {
  form:      'Physical presence and capability. Weapon summoning, combat, endurance.',
  clarity:   'Perception, insight, reading situations and people. Gem-sense.',
  resonance: 'Capacity for genuine connection. Persuasion, empathy, emotional honesty.',
  radiance:  'Expression of self. Unique power, shapeshifting, breaking your assigned role.',
  resolve:   'Willpower and self-possession. Resisting Diamond influence. Stronger with allies.',
}

export const WEAPON_TAG_LABELS: Record<string, string> = {
  reach:     'Reach',
  concealed: 'Concealed',
  binding:   'Binding',
  area:      'Area',
  piercing:  'Piercing',
  paired:    'Paired',
  heavy:     'Heavy',
  finesse:   'Finesse',
}

export const COURTS: Record<Court, string> = {
  white:  "White Diamond's Court",
  yellow: "Yellow Diamond's Court",
  blue:   "Blue Diamond's Court",
  pink:   "Pink Diamond's Court",
  cross:  'Cross-Court',
}

export const GEM_TYPE_KEYS = Object.keys(GEM_TYPES) as GemType[]

export function getGemTypesForArchetype(archetype: ArchetypeKey): GemType[] {
  return GEM_TYPE_KEYS.filter(k => GEM_TYPES[k].recommendedArchetypes.includes(archetype))
}

export const BACKSTORY_QUESTIONS = [
  { key: 'madeFor',           label: 'What were you made to do, and when did you first notice the gap between that and what you actually are?' },
  { key: 'rebellionBelief',   label: 'What do you believe about the rebellion that you haven\'t said out loud yet?' },
  { key: 'importantGem',      label: 'Name one gem — not a PC — who mattered to you before this. Where are they now?' },
  { key: 'formTells',         label: 'What does your gem\'s physical form tell other gems about you that you wish it didn\'t?' },
  { key: 'wouldLeave',        label: 'What would make you leave the rebellion?' },
  { key: 'wants',             label: 'What do you want that has nothing to do with the war?' },
  { key: 'bravest',           label: 'What\'s the bravest thing you\'ve ever done, and did anyone see it?' },
]

// ── NPC template ──────────────────────────────────────────────────────────────

export interface NPC {
  id: string
  name: string
  gemType: string
  notes: string
  stats: Stats
  weapon: string
  power: string
  threat: string
}

export function defaultNPC(): NPC {
  return {
    id: crypto.randomUUID(),
    name: '',
    gemType: '',
    notes: '',
    stats: { form: 2, clarity: 2, resonance: 2, radiance: 1, resolve: 2 },
    weapon: '',
    power: '',
    threat: '',
  }
}
