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
  shadowGate: StatKey | 'all' | null  // which stat(s) can't advance past ceiling until shadow complete
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
    shadowGate: 'resonance',
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
    shadowGate: 'radiance',
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
    shadowGate: 'resolve',
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
    shadowGate: null,
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
    shadowGate: 'all',
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
  advanced?: boolean  // [Advanced] tier — double XP cost, story justification expected
}

export interface GemTypeDef {
  label: string
  court: Court
  recommendedArchetypes: ArchetypeKey[]
  rebelNote?: string   // e.g. "Rebel requires GM approval"
  weapons: WeaponOption[]
  corePower: PowerDef
  developedPowers: [PowerDef, PowerDef]
  advancedPowers: PowerDef[]
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
    advancedPowers: [
      { name: 'Resonant Command', desc: 'Your Diamond resonance extends to written orders and recordings. A directive issued in writing carries the same compulsive weight as a spoken one. Gems who read it must spend Resolve to consciously set it aside.' },
      { name: 'Light Prison', desc: 'Construct a hard-light containment shell around a target — complete, near-invisible, unbreakable from within without significant effort. Requires sustained concentration and a Form roll each exchange to maintain. It doesn\'t harm. It holds completely.' },
      { name: 'Shatter Potential', desc: 'You evaluate a gem and know, with precise clarity, exactly what it would take to shatter them. The GM tells you privately. You carry this. You have never used it. The question of whether you could is a story that hasn\'t ended.', advanced: true },
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
    advancedPowers: [
      { name: 'Counter-Assessment', desc: 'When another gem attempts to evaluate, read, or manipulate you, you immediately recognize the attempt and can redirect it. Roll Clarity; on a success you surface something true about them instead.' },
      { name: 'Override Classification', desc: 'Formally reclassify a gem\'s type in Homeworld\'s records — removing their function-based restrictions or adding new ones. The paperwork is real. It lasts until someone checks thoroughly.' },
      { name: 'Reassess the System', desc: 'Once per session turn your Assessment ability on an institution, faction, or mission. The GM gives you its approximate strengths, its suppressed weaknesses, and one thing it\'s afraid of.', advanced: true },
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
    advancedPowers: [
      { name: 'Living Record', desc: 'Transcribe events in real-time with perfect fidelity. Once per session produce a document so accurate it functions as legal or testimonial proof of what occurred.' },
      { name: 'Archive Access', desc: 'Pull complete historical records on any location, event, or gem you\'ve previously encountered. Once per scene, detailed enough to provide a tactical or social advantage before the situation develops.' },
      { name: 'Memory Theft', desc: 'With physical contact and a contested Clarity roll, extract a specific memory from a gem\'s experience and record it externally. The gem still has the memory. So do you. The copy is exact.', advanced: true },
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
    advancedPowers: [
      { name: 'Elastic Anchor', desc: 'Extend a limb to bind two things together — yourself and a target, two allies, a door and its frame — and hold them as long as you maintain it. Requires a Form roll to break from outside.' },
      { name: 'Rejection Pulse', desc: 'A sudden violent uncoiling of compressed form that throws everything in close range away from you simultaneously. No aiming. No targeting. You are the center and everything else is the edge.' },
      { name: 'Recorded Self', desc: 'Access a version of your form from before — before whatever happened. It lasts one scene. Your stats run as they were then, for better or worse. The GM determines what "before" means for your gem.', advanced: true },
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
    advancedPowers: [
      { name: 'Phase Transfer', desc: 'While phased, carry one willing gem partially through a solid barrier with you. They emerge disoriented — their first roll in the new location is made with one fewer die. You emerge normally.' },
      { name: 'Eclipse', desc: 'Phase an area of light itself, plunging a specific zone into complete and immediate darkness. You cannot phase yourself while maintaining it. Lasts until you release it or something disrupts your concentration.' },
      { name: 'Reflective Field', desc: 'Your phase ability extends to creating a partial mirror around yourself for one exchange — attacks pass through and emerge from a different angle entirely. You choose where. Requires a Clarity roll to place correctly.', advanced: true },
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
    advancedPowers: [
      { name: 'Fault Map', desc: 'After a scene of observation, produce a complete internal diagram of a structure, system, or gem\'s capabilities — every stress point, every load-bearing element, every place where pressure would produce collapse.' },
      { name: 'Prismatic Barrier', desc: 'Refract incoming light-based and energy attacks into harmless spectrum, effectively shielding against any power that operates through radiant means. Physical attacks are unaffected. Everyone in the scene knows what you\'re doing.' },
      { name: 'Resonant Cascade', desc: 'Identify a frequency that destabilizes an entire class of construct simultaneously — not one thing, everything of that type in range. Once per conflict. The effect is brief but total.', advanced: true },
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
    advancedPowers: [
      { name: 'Amber Shell', desc: 'Coat yourself or an adjacent ally in a partial amber construct — not full containment, but substantial armor. The next significant hit against that gem is reduced narratively: it lands, but without the full mechanical consequence.' },
      { name: 'Chain Containment', desc: 'Link two separate containment fields, making both harder to escape. What weakens one weakens the other. Breaking free of either requires overcoming both simultaneously.' },
      { name: 'Systematic Containment', desc: 'Expand your field to cover an entire space rather than a single target — holding everyone inside without distinguishing ally from enemy. You are also held. This is a last resort. It functions as one.', advanced: true },
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
    advancedPowers: [
      { name: 'War Cry', desc: 'A focused burst of aggressive presence that forces every gem in the scene to recalculate their threat assessment. Enemies must make Resolve rolls or redirect their attention toward you, regardless of what else was happening.' },
      { name: 'Quartz Endurance', desc: 'Take damage that would poof another gem and stay present, form cracking, at the cost of immediate Form damage instead. You don\'t resist the hit. You absorb it. The difference matters.' },
      { name: 'Corrupted Glimpse', desc: 'You\'ve been close enough to corruption to understand it from the inside. Once per session describe what it felt like — the loss of self, the static — and force a Harmony check on any fusion currently in the scene.', advanced: true },
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
    advancedPowers: [
      { name: 'Controlled Burn', desc: 'Sustained focused heat output through direct contact. Melt through barriers, weld things shut, or assist in closing gem cracks. Requires concentration. You cannot fight while maintaining it.' },
      { name: 'Heat Shield', desc: 'Project your heat outward as a defensive shell. Incoming physical attacks are significantly reduced; the attacker is burned on contact. You cannot attack while maintaining the shield.' },
      { name: 'Shared Heat', desc: 'Extend your heat to an ally as a stabilizing temperature that counteracts conditions (ice, paralysis, shock) that would otherwise impair them. Costs you the same Form you would spend using heat offensively.', advanced: true },
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
    advancedPowers: [
      { name: 'Form Copy', desc: 'Hold a copied appearance with sufficient precision to pass biometric gem authentication — not just visual, but the subtle light signature other gems read instinctively. It drops the moment you use any power.' },
      { name: 'Clustered Form', desc: 'Partially fragment your presence into two simultaneous locations — not independent selves, but enough physical presence in two places at once to act from both. Costs significant Form to maintain.' },
      { name: 'Combat Forms', desc: 'Your shapeshifting extends to mid-combat form changes for tactical advantage — targeted alteration, extra reach, additional limbs, density shifts. Each change costs one Form die worth of concentration.', advanced: true },
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
    advancedPowers: [
      { name: 'Rapid Construction', desc: 'Build a functional structure or tool in one scene rather than over extended time. It\'s temporary — it won\'t hold beyond the session — but it holds now, and right now is what matters.' },
      { name: 'Alloy', desc: 'Temporarily combine two gems\' summoned weapons into a single construct they wield together. Both players must agree. The combined weapon carries both weapons\' tags. It lasts one scene, then separates.' },
      { name: 'Disassemble', desc: 'Take apart any gem construct — weapon, prison, architectural element — by identifying its structural logic and reversing it. Faster than simply hitting it. Works on anything built, not on living gems.', advanced: true },
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
    advancedPowers: [
      { name: 'Suppress', desc: 'Your authority aura focused precisely on a single gem causes them to lose clean access to one stat for the rest of the scene. Their rolls using it are made at disadvantage. They know exactly what you did and why.' },
      { name: 'Court Memory', desc: 'Invoke the precise institutional logic of Homeworld compliance protocols in a way that creates hesitation even in unconditioned gems — they have to consciously choose to override something built into most of them very early.' },
      { name: 'Sustained Aura', desc: 'Your passive authority field intensifies. For one scene, the Resolve roll to defy your direct instructions becomes mandatory for all gems present, not just Homeworld-conditioned ones.', advanced: true },
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
    advancedPowers: [
      { name: 'Vanishing Act', desc: 'Conceal one other gem within your shadow presence — they gain your Concealed quality for a scene. They must remain within arm\'s reach. If they act, it breaks.' },
      { name: 'Dark Resonance', desc: 'In complete darkness perceive the emotional state of every gem within range with the precision of a Clarity 5 read — not mind-reading, but emotionally exact. Any light source breaks it entirely.' },
      { name: 'Shadow Step', desc: 'Move from one area of deep shadow to another within a scene boundary without crossing the intervening space. No roll for the movement itself. Detection at the destination still applies normally.', advanced: true },
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
    advancedPowers: [
      { name: 'Strategic Withdrawal', desc: 'Organize a retreat that costs the enemy. Even as your group leaves, you ensure they lose something in the process — a position, a resource, a piece of intelligence. A miss is still a controlled loss.' },
      { name: 'Chain of Command', desc: 'Formally designate another gem as your second for a session. They gain access to your Starting Move once before the session ends — the directive and the bonus die.' },
      { name: 'Anticipate', desc: 'Once per conflict, retroactively declare that your gem was somewhere else when an action happened — you saw it coming. The GM determines whether the position is plausible.', advanced: true },
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
    advancedPowers: [
      { name: 'Probability Collapse', desc: 'Identify the exact action that will make a specific outcome impossible — closing a door before it opens. You don\'t know everything that follows. You know that one door closes. Once per session. The certainty is total. So is the cost of having it.' },
      { name: 'Frozen Moment', desc: 'Encase a specific object, document, or location in ice that cannot be touched, moved, altered, or destroyed until you release it. Not a weapon — preservation. It can hold something safe for a very long time.' },
      { name: 'Vision Share', desc: 'Show another gem a specific moment from your future vision in enough detail that they experience it as you did — emotionally, not just informationally. What they do with it remains entirely their choice. You cannot revise what you show.', advanced: true },
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
    advancedPowers: [
      { name: 'Tidal Force', desc: 'Your hydrokinesis extends to weather-scale water manipulation — calling rain, generating fog, draining moisture from an area. At high Harmony the effects are precise. At low Harmony they\'re not.' },
      { name: 'Water Memory', desc: 'Water you\'ve controlled retains an imprint you can read after the fact — where it\'s been, what it\'s touched, what passed through it. The GM determines how far back the memory goes.' },
      { name: 'Absolute Tide', desc: 'Call all available water in range simultaneously and hold it. Not a weapon — a statement. The scale depends on Form and current Harmony. This is never subtle. Everyone in the scene understands what\'s happening.', advanced: true },
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
    advancedPowers: [
      { name: 'Fast Strike', desc: 'Your flight speed applied to a single attack — you arrive from angles that don\'t exist until you\'re already there. The attack carries both Finesse and Reach simultaneously. Once per conflict.' },
      { name: 'Containment Circuit', desc: 'Rather than targeting a gem with your retrieval construct, you orbit them — the construct creating a perimeter. They can\'t leave the orbit without triggering it. You have to keep moving.' },
      { name: 'Swarm Retrieval', desc: 'Your construct replicates into multiple simultaneous capture attempts on different targets. Each is weaker than a single focused construct. Roll once; the GM distributes partial results across targets.', advanced: true },
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
    advancedPowers: [
      { name: 'Precedent', desc: 'Find a historical or legal case that technically applies to the current situation and makes your position defensible. Works retroactively if you haven\'t left the scene.' },
      { name: 'Formal Objection', desc: 'Halt an action in progress by invoking procedural authority loudly and precisely. Even gems who don\'t recognize Homeworld law hesitate. Buys one exchange of time. Works once per scene before gems stop responding to it.' },
      { name: 'Case Closed', desc: 'Construct an argument so complete that the opposition loses access to their primary objection for the rest of the scene. Not silence — they can still speak. They just can\'t use that argument anymore.', advanced: true },
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
    advancedPowers: [
      { name: 'Persistent Illusion', desc: 'Your illusions hold without active concentration — you set them running and they maintain until physically disturbed. Less detailed than sustained ones, but you\'re free to act elsewhere while they run.' },
      { name: 'Refraction Shield', desc: 'Bend incoming light-based and energy attacks around yourself, redirecting rather than blocking. Works only on radiant attacks, not physical ones. The redirected energy goes somewhere — you choose where.' },
      { name: 'Total Environment', desc: 'Construct a complete illusory environment over an existing space — not one false object but everything. Gems inside experience it as real. Requires full concentration. Breaks immediately if you\'re hit.', advanced: true },
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
    advancedPowers: [
      { name: 'Spectrum Blindness', desc: 'Suppress your trichroic vision and present as gem-blind across all three spectra in ways other gems can detect and verify. Useful for infiltration — a gem with full sight choosing not to use it makes others deeply uncomfortable.' },
      { name: 'Thermal Mapping', desc: 'Your infrared vision allows complete environmental mapping of a space — hidden gems, recent movement, heat trails, occupied rooms behind walls. Thorough mapping takes a full scene. Quick mapping tells you one specific thing.' },
      { name: 'Spectral Analysis', desc: 'Your ultraviolet vision extends to reading the residual signature of gem powers used in a location — what was used, approximately when, and what gem type produced it. Works up to a week back in a closed environment.', advanced: true },
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
    advancedPowers: [
      { name: 'Warp Calculation', desc: 'From a fixed position identify every warp pad within a planetary system, whether each is active or dormant, and whether any are guarded or compromised. Takes a scene of focused attention.' },
      { name: 'Spatial Presence', desc: 'Your navigation awareness extends to tactical positioning — you always know where every gem in a conflict is, even those you can\'t see, as long as you\'ve had a moment to orient in the space.' },
      { name: 'Warp Intercept', desc: 'Calculate where a gem went if you reach the pad they used before the signature dissipates. On a clean Clarity roll the GM tells you the destination precisely. On a partial, approximate. On a miss, you know they went somewhere but not where.', advanced: true },
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
    advancedPowers: [
      { name: 'Deep Heal', desc: 'Extended contact healing that partially addresses a cracked gem\'s underlying fracture — working at the structural level. Requires an entire scene and costs significant Form. The GM determines how much of the crack is addressed.' },
      { name: 'Shared Stability', desc: 'Transfer a portion of your own Form stability to another gem as a buffer. They absorb incoming Form damage; you feel the same cost simultaneously. Entirely voluntary. Cannot be used on yourself.' },
      { name: 'Heal the Past', desc: 'A single use per campaign: you repair a cracked gem enough to restore one stat point lost to the crack. The time, the scene, and the cost are significant. It is not reversible.', advanced: true },
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
    advancedPowers: [
      { name: 'Commandeer', desc: 'Formally requisition a resource — ship, equipment, location, vehicle — with enough apparent Homeworld authority that current holders hand it over. Works once before the paperwork catches up.' },
      { name: 'Shipping Manifest', desc: 'Place gems or objects into Homeworld\'s shipping network, routed to destinations you specify, under cover of routine logistics. Getting them out at the destination is a separate problem you haven\'t solved yet.' },
      { name: 'Full Authorization', desc: 'Once per campaign invoke a Homeworld authorization so complete and precisely constructed that it passes thorough investigation. Not indefinitely — the lie has a lifespan — but it holds for long enough.', advanced: true },
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
    advancedPowers: [
      { name: 'Recall', desc: 'Reverse a previous assignment or reassignment — yours or another gem\'s. Complicated. Takes time. Creates a paper trail that someone will eventually follow.' },
      { name: 'Welfare Assessment', desc: 'Initiate a formal welfare review that makes it bureaucratically necessary for other gems to treat the subject with specific care for a defined period. Interrupting a welfare review has paperwork consequences.' },
      { name: 'Restructure', desc: 'Redesign the formal assignment structure of a small team or unit — their roles, their reporting relationships, their recorded functions. The changes are real in Homeworld\'s systems until someone senior enough notices.', advanced: true },
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
    advancedPowers: [
      { name: 'Emotional Anchor', desc: 'Provide a gem in crisis with a stable focal point — your own emotional state, steady and legible. They can treat your Resolve as a supplementary stat for a scene, adding it to their rolls where emotional steadiness matters.' },
      { name: 'Read the Room (Expanded)', desc: 'Read the emotional architecture of a gathering rather than an individual — what\'s suppressed collectively, what\'s close to the surface, what everyone is performing versus what\'s underneath. Not individuals. The field.' },
      { name: 'Dissipate', desc: 'Identify the specific emotional state driving a situation — the fear, the grief, the anger — and create enough space around it that it loses its grip on the scene. Not resolved. Set down for now.', advanced: true },
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
    advancedPowers: [
      { name: 'Spectrum Split', desc: 'Simultaneously present as two different gem types to different observers in the same scene. Requires active concentration and a Radiance roll; if it slips, both readings collapse and everyone in the scene knows something was wrong.' },
      { name: 'Register Shift', desc: 'Abruptly change your social presentation mid-interaction — the gem you\'re speaking with must reorient completely. Whatever authority or familiarity they were operating from has to be rebuilt. Their next social action is made with one fewer die.' },
      { name: 'Full Spectrum', desc: 'Your presentation becomes genuinely unreadable — no gem type reads clearly, no court affiliation registers, no caste signal lands consistently. You are whoever the scene needs. Lasts one scene. Requires a Radiance roll under direct scrutiny.', advanced: true },
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
    advancedPowers: [
      { name: 'Historical Precedent (Extended)', desc: 'Invoke a law, tradition, or agreement that predates current Diamond authority and technically supersedes current policy. You know before you use it whether it will hold. The GM determines how much weight it carries in this specific context.' },
      { name: 'Witnessed', desc: 'Share something you personally observed from before current Homeworld history — something that predates most living gems\' experience of the empire. Gems who hear it must roll Resolve to dismiss what it implies. You have carried this for a very long time.' },
      { name: 'Survivor\'s Knowledge', desc: 'Once per session declare you\'ve personally encountered a situation structurally identical to this one before and ask the GM what happened the last time — what worked, what failed, and what the cost was.', advanced: true },
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
    advancedPowers: [
      { name: 'Perfect Record', desc: 'Project a holographic reconstruction of any event you personally witnessed with enough precision and detail to serve as evidence, testimony, or analytical material. You cannot fabricate. The record is exactly what happened.' },
      { name: 'Training Sequence', desc: 'Compress the teaching of a physical or technical skill into one scene of focused instruction. The student gains temporary competence — a single bonus die, once — rather than permanent absorption.' },
      { name: 'Complete Archive', desc: 'Once per campaign produce a holographic record of something that happened before you were assigned to anyone — from your earliest formation. The GM determines what you witnessed before your memory was considered relevant to anyone.', advanced: true },
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
    advancedPowers: [
      { name: 'Remote Operation', desc: 'Operate Homeworld technology at a distance through ferrokinesis — no physical contact required. Range is limited; precision decreases with distance. Non-Homeworld technology at range requires a Clarity roll.' },
      { name: 'Improvised Weapon', desc: 'Construct a functional weapon from available materials in the environment. Choose two tags. It works for one conflict, then falls apart. The GM may rule certain materials unavailable.' },
      { name: 'System Override', desc: 'Connect to a Homeworld system and take complete control — not just reading it, but rewriting its current operational state. Lasts until someone with appropriate authorization manually reverts it. Requires physical contact and a full scene.', advanced: true },
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
    advancedPowers: [
      { name: 'Immovable', desc: 'Once per conflict you simply refuse to move. No roll — you are where you are and you stay there. Anything that would physically relocate you fails. You feel the attempt completely. It doesn\'t work.' },
      { name: 'Patient Read', desc: 'Given one scene of observation, gain a complete Clarity read on a gem\'s motivations without rolling and without them knowing. Your long practice of observing from positions of low power makes this safe where it wouldn\'t be for others.' },
      { name: 'Institutional Memory', desc: 'Once per session name a social dynamic, power structure, or interpersonal pattern and the GM confirms whether you\'ve seen it before — and what happened.', advanced: true },
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
    advancedPowers: [
      { name: 'Role Shift', desc: 'Adopt a functional role completely for a scene, temporarily accessing the instincts that go with it: Scholar gains Read the Room, Soldier gains First Strike, Diplomat gains Open Channel, Leader gains Hold the Line. Once per session.' },
      { name: 'Versatile Cover', desc: 'Your comfort across roles makes you genuinely difficult to classify. Gems attempting to assess, read, or evaluate you find their results ambiguous. This doesn\'t prevent reads — it complicates them.' },
      { name: 'Institutional Fit', desc: 'Step into any organizational structure and appear to belong within three exchanges. You don\'t have the authorization of the role. You have the bearing, vocabulary, and behavioral signature of someone who does.', advanced: true },
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
