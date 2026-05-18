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
    startingMoveDesc: 'When you act before anyone else in a scene — before a plan is formed — roll Form with a bonus die. On a 6, you set the terms of the conflict — you act first and the situation responds to you. On a 4–5, you act first but overcommit — you\'ve moved before the situation was readable, and the GM introduces a complication. On a 1–3, you\'ve committed everyone before they were ready.',
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
    startingMoveDesc: 'When you attempt to de-escalate through conversation rather than force, roll Resonance with a bonus die. On a 6, the confrontation de-escalates — the enemy stands down or pauses long enough for real conversation. On a 4–5, it pauses, but something is still unresolved — they\'re listening, but the situation could reignite. On a 1–3, the attempt to talk makes things worse — the GM makes a move. On a Resonance result, the enemy doesn\'t just stand down — they tell you something true about themselves or their orders.',
    shadow: 'NPCs may clock the resemblance between your instincts and Pink Diamond\'s. Your Clarity can\'t advance past 3 until a gem explicitly confronts you about that resemblance and, instead of explaining it away, you sit with it and articulate honestly what makes your impulse different. That conversation has to cost you something. Once it happens, the ceiling lifts.',
    shadowGate: 'clarity',
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
    startingMoveDesc: 'Once per session, when you do something no trained gem of any court would try, roll Radiance instead of whatever stat would normally apply. On a 6, it works — in a way that surprises even you, and probably everyone else. On a 4–5, it partially works — you get part of what you wanted, but something goes sideways in a way nobody anticipated. On a 1–3, it doesn\'t work, and the GM makes a move that reflects exactly how wrong \'improvised\' can go.',
    shadow: 'A Rebel stat can reach 5 only after the GM\'s answer to the open question has surfaced in play and been integrated into the fiction — not just revealed, but lived with through at least one scene that changes how the gem moves through the world. Once integrated, all ceilings lift simultaneously.',
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
  toHit?: string
  damage?: string
  note?: string  // ‡ marks weapons that use Binding+Heavy for restraint, not injury
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
      { name: 'Hard light constructs', tags: ['area', 'heavy'],  toHit: 'Form', damage: '2' },
      { name: 'Hard light blade',      tags: ['reach', 'piercing'], toHit: 'Form', damage: '1' },
      { name: 'Unarmed',               tags: ['heavy'],          toHit: 'Form', damage: '2' },
    ],
    corePower: {
      name: 'Diamond Resonance',
      desc: 'Your voice carries authority at a frequency other gems feel physically. You can issue a command that bypasses conscious resistance. The target rolls Resolve to defy it. On a 6 they act freely. On a 4–5 they resist but it costs them — hesitation, visible effort, a moment of doubt. On a 1–3 they cannot bring themselves to act against it. Against gems conditioned to Diamond authority this roll is at disadvantage. Against gems who have fully broken from Homeworld, it\'s made with advantage.',
    },
    developedPowers: [
      { name: 'Corruption Wave (controlled)', desc: 'A focused burst that overwhelms a gem\'s form temporarily without corrupting — destabilizing rather than harming. Roll Form. On a 6, the target is destabilized — their Form and Radiance rolls are at disadvantage until the end of the exchange. On a 4–5, they\'re shaken — one roll of their choice this exchange is at disadvantage. On a 1–3, the burst dissipates before it lands.' },
      { name: 'Light Manifestation', desc: 'Create fully realized constructs of hard light — structures, illusions, environments. The complexity, scale, and detail of what you can construct scales with your Radiance rating: Radiance 1 produces crude shapes; Radiance 3 produces convincing structures and spaces; Radiance 5 produces environments indistinguishable from reality to non-Clarity-sensitive gems. Sustained constructs require concentration; losing concentration drops them immediately.' },
    ],
    advancedPowers: [
      { name: 'Resonant Command', desc: 'Your Diamond resonance extends to written orders and recordings. A directive issued in writing carries the same compulsive weight as a spoken one. Gems who read it must roll Resolve to consciously set it aside, using the same 6/4–5/1–3 structure.' },
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
      { name: 'Measurement rod', tags: ['reach', 'finesse'],  toHit: 'Form', damage: '1' },
      { name: 'Twin blades',     tags: ['paired', 'finesse'], toHit: 'Form', damage: '1 each' },
      { name: 'Crystalline whip',tags: ['reach', 'binding'],  toHit: 'Form', damage: '—' },
    ],
    corePower: {
      name: 'Assessment',
      desc: 'Evaluate any gem\'s stat spread with a Clarity roll. On a 6, clear and accurate — the GM gives you the gem\'s highest stat, lowest stat, and one specific vulnerability. On a 4–5, partial read — one of those three, GM\'s choice. On a 1–3, you misread something — the GM gives you one piece of information, but it\'s wrong in a way you don\'t know. Cannot assess fusions — they read as something genuinely new.',
    },
    developedPowers: [
      { name: 'Devalue', desc: 'Identify and name a gem\'s conditioned weakness. They roll their next action against it with one fewer die.' },
      { name: 'Reassign', desc: 'Issue bureaucratically-framed commands that Homeworld-conditioned gems find difficult to parse as hostile.' },
    ],
    advancedPowers: [
      { name: 'Counter-Assessment', desc: 'When another gem attempts to evaluate, read, or manipulate you, you immediately recognize the attempt and can redirect it. Roll Clarity. On a 6, you surface something precise and true about them — they learn nothing about you. On a 4–5, something surfaces about them but something also surfaces about you — you each get one true thing. On a 1–3, the redirect fails; whatever they were trying to learn, you\'ve made it easier.' },
      { name: 'Override Classification', desc: 'Formally reclassify a gem\'s type in Homeworld\'s records — removing their function-based restrictions or adding new ones. The paperwork is real. It lasts until someone checks thoroughly.' },
      { name: 'Reassess the System', desc: 'Once per session turn your Assessment ability on an institution, faction, or mission. The GM gives you its approximate strengths, its suppressed weaknesses, and one thing it\'s afraid of.', advanced: true },
    ],
  },
  howlite: {
    label: 'Howlite',
    court: 'white',
    recommendedArchetypes: ['leader', 'scholar'],
    weapons: [
      { name: 'Stone tablet',      tags: ['heavy', 'area'],      toHit: 'Form', damage: '2' },
      { name: 'Crystalline stylus',tags: ['finesse', 'piercing'], toHit: 'Form', damage: '1' },
      { name: 'Staff',             tags: ['reach', 'heavy'],      toHit: 'Form', damage: '2' },
    ],
    corePower: {
      name: 'Institutional Memory',
      desc: 'Perfect recall of everything you\'ve ever recorded. Once per scene ask the GM one question about Homeworld\'s history, structures, or procedures.',
    },
    developedPowers: [
      { name: 'Rewrite', desc: 'Alter documents and data constructs with a touch. Forgeries are essentially undetectable to anyone who doesn\'t already know the truth.' },
      { name: 'Erase', desc: 'Suppress a specific memory from a willing or incapacitated gem — not permanently, but long enough to matter. For unwilling or active targets, roll Clarity contested against their Resolve. On a 6, the memory is suppressed cleanly — they don\'t know what they\'ve lost. On a 4–5, the suppression takes hold but leaves a gap they can feel — they know something is missing, even if they can\'t name it. On a 1–3, the attempt fails; they\'re aware of the intrusion.' },
    ],
    advancedPowers: [
      { name: 'Living Record', desc: 'Transcribe events in real-time with perfect fidelity. Once per session produce a document so accurate it functions as legal or testimonial proof of what occurred.' },
      { name: 'Archive Access', desc: 'Pull complete historical records on any location, event, or gem you\'ve previously encountered. Once per scene, detailed enough to provide a tactical or social advantage before the situation develops.' },
      { name: 'Memory Theft', desc: 'With physical contact, make a contested Clarity roll to extract a specific memory from a gem\'s experience and record it externally. The gem still has the memory. So do you. On a 6, the extraction is clean — the copy is exact and they remain unaware the theft occurred. On a 4–5, the copy is extracted but the gem feels something — they know a memory was accessed, even if they can\'t identify what or by whom. On a 1–3, the extraction fails; they know exactly what you tried and why.', advanced: true },
    ],
  },
  spinel: {
    label: 'Spinel',
    court: 'white',
    recommendedArchetypes: ['leader', 'diplomat'],
    weapons: [
      { name: 'Rejuvenator',  tags: ['finesse', 'reach'],  toHit: 'Form', damage: '1' },
      { name: 'Elastic limbs',tags: ['reach', 'paired'],   toHit: 'Form', damage: '1 each' },
      { name: 'Yo-yo',        tags: ['reach', 'binding'],  toHit: 'Form', damage: '—' },
    ],
    corePower: {
      name: 'Elasticity',
      desc: 'Your form is more malleable than other gems. Stretch, compress, and reshape beyond normal shapeshifting — changing geometry, not just appearance. Fit through impossible spaces, extend reach. Once per conflict, absorb an impact without marking Form damage — a hit that would mark a box doesn\'t.',
    },
    developedPowers: [
      { name: 'Reset Touch', desc: 'A controlled application of rejuvenator energy through contact. Temporarily suppress a gem\'s most recently developed capability. It returns after one full downtime scene. On unwilling or aware targets, this requires a contested Form roll — you must make and hold contact against their resistance. On a 6, it applies cleanly. On a 4–5, it applies but they know what you did. On a 1–3, the contact breaks before the effect seats.' },
      { name: 'Transformation', desc: 'Full form changes — appearance, voice, apparent gem type. Once per scene while maintaining it, or immediately when a gem attempts to see through it, roll Radiance. On a 6, it holds cleanly for another scene. On a 4–5, it holds but something slips — a tell, a crack in the surface, one gem in the scene notices something is off. On a 1–3, the transformation drops.' },
    ],
    advancedPowers: [
      { name: 'Elastic Anchor', desc: 'Extend a limb to bind two things together — yourself and a target, two allies, a door and its frame — and hold them as long as you maintain it. When anchoring an unwilling target, this requires a contested Form roll to establish and hold the limb. Requires a Form roll to break from outside.' },
      { name: 'Rejection Pulse', desc: 'A sudden violent uncoiling of compressed form that throws everything in close range away from you. Roll Form. On a 6, everything is thrown clear and you choose the order. On a 4–5, most things go — one target of the GM\'s choice holds ground or gets back up immediately. On a 1–3, the uncoil works but destabilizes your own footing — your next roll is at one fewer die.' },
      { name: 'Recorded Self', desc: 'Access a version of your form from a specific earlier moment — the GM determines the moment with your input, drawn from your backstory. All five stats shift to those values for one scene. Form damage boxes are not affected. Powers and your signature move remain as they are now; this is about who you were, not what you could do.', advanced: true },
    ],
  },
  moonstone: {
    label: 'Moonstone',
    court: 'white',
    recommendedArchetypes: ['leader', 'diplomat'],
    weapons: [
      { name: 'Dual blades',      tags: ['paired', 'finesse'],  toHit: 'Form', damage: '1 each' },
      { name: 'Moonbeam lance',   tags: ['reach', 'piercing'],  toHit: 'Form', damage: '1' },
      { name: 'Reflective shield',tags: ['area'],               toHit: 'Form', damage: '—' },
    ],
    corePower: {
      name: 'Phase Shift',
      desc: 'Become partially incorporeal — not invisible, but difficult to physically interact with. Attacks that hit you while phased deal no Form damage — they land narratively but your form doesn\'t register the full impact. You cannot attack while phased. You can move through thin barriers.',
    },
    developedPowers: [
      { name: 'Reflection', desc: 'Redirect a gem power attack back toward its source. Roll Clarity. On a 6, the attack redirects cleanly — it returns to its source at full effect. On a 4–5, it partially redirects — the attack is disrupted and deals no Form damage to you, but doesn\'t fully return; the power dissipates. On a 1–3, the timing is wrong — the attack hits you normally.' },
      { name: 'Lunar Pull', desc: 'Always active while you\'re present and conscious — not a choice, a condition. Gems in the scene make Resonance rolls with a bonus die and Resolve rolls to escalate with one fewer die. Gems with Clarity 3 or higher can detect the field if they\'re looking for it — they feel the influence and can identify its source.' },
    ],
    advancedPowers: [
      { name: 'Phase Transfer', desc: 'While phased, carry one willing gem partially through a solid barrier with you. They emerge disoriented — their first roll in the new location is made with one fewer die. You emerge normally.' },
      { name: 'Eclipse', desc: 'Phase an area of light itself, plunging a specific zone into complete and immediate darkness. You cannot phase yourself while maintaining it. Lasts until you release it or something disrupts your concentration.' },
      { name: 'Reflective Field', desc: 'Your phase ability extends to creating a partial mirror around yourself for one exchange — attacks pass through and emerge from a different angle entirely. Roll Clarity to place it. On a 6, you choose where redirected attacks land. On a 4–5, the mirror holds but the angle is imprecise — the GM chooses where redirected energy goes. On a 1–3, the mirror forms wrong — attacks pass through and hit you normally this exchange.', advanced: true },
    ],
  },
  selenite: {
    label: 'Selenite',
    court: 'white',
    recommendedArchetypes: ['leader', 'scholar'],
    weapons: [
      { name: 'Crystal blade', tags: ['finesse', 'piercing'], toHit: 'Form', damage: '1' },
      { name: 'Light staff',   tags: ['reach', 'area'],       toHit: 'Form', damage: '1' },
      { name: 'Unarmed',       tags: ['finesse'],             toHit: 'Form', damage: '1' },
    ],
    corePower: {
      name: 'Structural Clarity',
      desc: 'Perceive the underlying architecture of situations, systems, and gems — load-bearing elements, stress fractures, points of maximum vulnerability. Once per scene identify the single most vulnerable point.',
    },
    developedPowers: [
      { name: 'Light Amplification', desc: 'Gather and focus ambient light into a damaging beam. Roll Form. On a 6, the beam deals 2 damage. On a 4–5, it deals 1 damage but the targeting is off — the GM picks a complication. On a 1–3, the ambient light isn\'t sufficient or your focus breaks — the beam doesn\'t fire. In bright conditions, a 6 deals 2 damage and the target is also blinded for one exchange — their Clarity-based rolls and any Form attack that requires sight are made at disadvantage. In darkness, rolls are made with one fewer die.' },
      { name: 'Resonant Frequency', desc: 'Identify and produce the specific frequency that destabilizes a gem construct or structure — built things, not living gems. Roll Clarity. On a 6, you identify and produce the exact frequency — the construct destabilizes immediately and begins coming apart. On a 4–5, you find a partial frequency — it weakens significantly but holds for one more exchange before collapsing, and something unexpected shifts in the process. On a 1–3, you can\'t isolate the right frequency in the moment.' },
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
      { name: 'Mace',           tags: ['heavy', 'binding'],  toHit: 'Form', damage: '2' },
      { name: 'Amber construct',tags: ['binding', 'area'],   toHit: 'Form', damage: '—' },
      { name: 'Twin maces',     tags: ['paired', 'heavy'],   toHit: 'Form', damage: '2 each' },
    ],
    corePower: {
      name: 'Containment Field',
      desc: 'Generate a hardened energy construct around a target that immobilizes completely. Requires physical contact to initiate — roll Form to establish the field; on a 6 it seats cleanly, on a 4–5 it holds but something else happens, on a 1–3 the contact fails or is interrupted — the GM makes a move. Once established, maintaining requires a Form roll each exchange; on a 4–5 the target may immediately attempt to break free, on a 1–3 the field is already failing — the target may attempt to break free with advantage. The field doesn\'t harm — it holds.',
    },
    developedPowers: [
      { name: 'Fusion Pressure', desc: 'When fused (or with GM approval), extend the containment field to cover a space roughly the size of a large room rather than a single target — all gems within it are treated as restrained. Initiation still requires physical contact with the space (touching a wall, floor, or fixture within it) and a Form roll. Maintenance uses the same Form roll each exchange. The field cannot distinguish ally from enemy. The casting Topaz(es) are not restrained by their own field.' },
      { name: 'Amber Seal', desc: 'A permanent-grade containment nearly impossible to break from within. Rarely used. Has obvious ethical implications.' },
    ],
    advancedPowers: [
      { name: 'Amber Shell', desc: 'Coat yourself or an adjacent ally in a partial amber construct — not full containment, but substantial armor. The next significant hit against that gem marks one fewer Form damage box than it otherwise would — to a minimum of none. If the hit would have poofed the protected gem without damage (a narratively catastrophic call), the GM may still call the poof, but this is rare.' },
      { name: 'Chain Containment', desc: 'Link two separate containment fields, making both harder to escape. What weakens one weakens the other. Breaking free requires a single Form roll at disadvantage — the linked fields reinforce each other. On a 6, both fields fail at once. On a 4–5, you partially break one — the other holds, but it\'s visibly straining. On a 1–3, neither gives.' },
      { name: 'Systematic Containment', desc: 'Expand your field to cover an entire space rather than a single target — holding everyone inside without distinguishing ally from enemy. Requires a Form roll to establish, using the same structure as the core containment field. The Topaz is held along with everyone else — there is no anchor outside the field. This is a last resort. It functions as one.', advanced: true },
    ],
  },
  jasper: {
    label: 'Jasper',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'rebel'],
    weapons: [
      { name: 'Crash helmet',tags: ['heavy', 'area'],  toHit: 'Form', damage: '2' },
      { name: 'War hammer',  tags: ['heavy', 'reach'], toHit: 'Form', damage: '2' },
      { name: 'Bare hands',  tags: ['heavy'],          toHit: 'Form', damage: '2' },
    ],
    corePower: {
      name: 'Perfect Quartz',
      desc: 'Your form is exceptionally resilient. Once per conflict ignore the mechanical effects of a single significant hit — taking it narratively but suffering no Form damage or other mechanical consequences from it.',
    },
    developedPowers: [
      { name: 'Charge', desc: 'Lower your head and close distance at full force, crashing through anything in the way. Roll Form. On a 6, the target is knocked back and destabilized — their next roll is at disadvantage. On a 4–5, you close the distance but the target holds their footing — you\'re in contact, and something has to happen next. You cannot easily stop or redirect mid-charge.' },
      { name: 'Relentless', desc: 'Once per conflict, when you are poofed, return to the scene at Form 1 for the next exchange, regardless of Form damage boxes. You don\'t resist the poof — you simply refuse to stay down.' },
    ],
    advancedPowers: [
      { name: 'War Cry', desc: 'A focused burst of aggressive presence that forces every gem in the scene to recalculate their threat assessment. Enemies roll Resolve. On a 6, they resist — their attention stays where it was. On a 4–5, they redirect toward you but hold their current action through the end of this exchange before fully committing. On a 1–3, they redirect immediately — whatever they were doing stops, and you are now the problem they have to solve.' },
      { name: 'Quartz Endurance', desc: 'Take damage that would poof another gem and stay present, form cracking, at the cost of marking two Form damage boxes instead. You mark up to two Form damage boxes — if this would fill all four boxes, you mark what remains and still stay present; the intent of the power is to absorb what would otherwise poof you. You don\'t resist the hit. You absorb it. The difference matters.' },
      { name: 'Corrupted Glimpse', desc: 'You\'ve been close enough to corruption to understand it from the inside. Once per session describe what it felt like — the loss of self, the static — and force a Harmony check on any fusion currently in the scene.', advanced: true },
    ],
  },
  ruby: {
    label: 'Ruby',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'rebel'],
    weapons: [
      { name: 'Gauntlet',     tags: ['heavy', 'finesse'],   toHit: 'Form', damage: '2' },
      { name: 'Short sword',  tags: ['finesse', 'paired'],  toHit: 'Form', damage: '1 each' },
      { name: 'Combat shield',tags: ['binding', 'heavy'],   toHit: 'Form', damage: '—', note: '‡' },
    ],
    corePower: {
      name: 'Heat',
      desc: 'Generate intense heat from your gem — superheated strikes, close-range fire projection, melting through barriers. Sustained output requires concentration. While sustaining heat output, your Resolve rolls are made at disadvantage — holding your form steady and holding the heat simultaneously pulls in opposite directions.',
    },
    developedPowers: [
      { name: 'Thermal Vision', desc: 'Perceive heat signatures — tracking, detecting hidden gems, reading emotional states. Works in darkness.' },
      { name: 'Rage Ignition', desc: 'When you have two or more Form damage boxes marked, your heat output doubles automatically. You don\'t control this. More dangerous; significantly harder to reason with.' },
    ],
    advancedPowers: [
      { name: 'Controlled Burn', desc: 'Sustained focused heat output through direct contact. Melt through barriers, weld things shut, or assist in closing gem cracks. A healer working in contact while you maintain Controlled Burn clears one additional Form damage box per scene of healing. Requires concentration. You cannot fight while maintaining it.' },
      { name: 'Heat Shield', desc: 'Project your heat outward as a defensive shell. Incoming physical attacks are reduced — attacks that would mark a Form damage box mark one fewer, to a minimum of none. The attacker takes 1 narrative damage from the heat on contact, which the GM may translate into fictional consequences. You cannot attack while maintaining the shield.' },
      { name: 'Shared Heat', desc: 'Extend your heat to an ally as a stabilizing temperature that counteracts conditions (ice, paralysis, shock) that would otherwise impair them. Marks one Form damage box on you.', advanced: true },
    ],
  },
  amethyst: {
    label: 'Amethyst',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'rebel'],
    weapons: [
      { name: 'Whip',   tags: ['reach', 'binding'],     toHit: 'Form', damage: '1' },
      { name: 'Flail',  tags: ['heavy', 'reach'],       toHit: 'Form', damage: '2' },
      { name: 'Dagger', tags: ['concealed', 'finesse'], toHit: 'Form', damage: '1' },
    ],
    corePower: {
      name: 'Shapeshifting',
      desc: 'Your shapeshifting is more fluid and faster than other gems. Change form mid-combat, hold a shape longer under pressure, and copy appearances with precision.',
    },
    developedPowers: [
      { name: 'Size Manipulation', desc: 'Grow significantly larger (adds Heavy to any attack) or compress significantly smaller. Small form makes your presence difficult to detect — you are treated as Concealed in any situation where visibility would be a factor, and can enter scenes or spaces where a full-sized gem would be noticed.' },
      { name: 'Spin Dash', desc: 'Compress your form and launch as a spinning projectile. Roll Form (Area). On a 6, you tear through everything in your path — full damage to all targets. On a 4–5, you hit your intended target but clip or miss the others. On a 1–3, the trajectory goes wrong — you end up somewhere you didn\'t intend. You cannot stop or redirect mid-dash.' },
    ],
    advancedPowers: [
      { name: 'Form Copy', desc: 'Hold a copied appearance with sufficient precision to pass biometric gem authentication — not just visual, but the subtle light signature other gems read instinctively. It drops the moment you use any power.' },
      { name: 'Clustered Form', desc: 'Partially fragment your presence into two simultaneous locations — not independent selves, but enough physical presence in two places at once to act from both. Maintaining it marks one Form damage box per scene it\'s active.' },
      { name: 'Combat Forms', desc: 'Your shapeshifting extends to mid-combat form changes for tactical advantage — targeted alteration, extra reach, additional limbs, density shifts. Each change marks one Form damage box.', advanced: true },
    ],
  },
  bismuth: {
    label: 'Bismuth',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'leader'],
    weapons: [
      { name: 'Shifting weapon',tags: ['heavy'],           toHit: 'Form', damage: '2' },
      { name: 'War hammer',     tags: ['heavy', 'area'],   toHit: 'Form', damage: '2' },
      { name: 'Breaking Point', tags: ['piercing', 'heavy'],toHit: 'Form', damage: '2' },
    ],
    corePower: {
      name: 'Constructs',
      desc: 'Shape gem-metal and hard light into structures, weapons, and tools on the fly. In combat: barriers, traps, improvised weapons for allies. Outside combat: nearly limitless given time and materials. The Shifting weapon is Heavy by default — choose one additional tag each time it\'s summoned.',
    },
    developedPowers: [
      { name: 'Forge', desc: 'Permanently upgrade another gem\'s summoned weapon — adding a tag or enhancing an existing one. Requires time and focused work. Lasts until the weapon is re-summoned from scratch. Re-summoning from scratch means deliberately dismissing and reforming the weapon with intent to start fresh — not every dismissal. The GM is the judge of whether a re-summon counts.' },
      { name: 'Deconstruct', desc: 'Break down gem constructs by identifying their resonant frequency. Faster and more precise than simply hitting them. Roll Clarity. On a 6, it comes apart immediately. On a 4–5, it begins but doesn\'t finish — weakened, fails next exchange unless maintained. On a 1–3, the frequency eludes you.' },
    ],
    advancedPowers: [
      { name: 'Rapid Construction', desc: 'Build a functional structure or tool in one scene rather than over extended time. It\'s temporary — it won\'t hold beyond the session — but it holds now, and right now is what matters.' },
      { name: 'Alloy', desc: 'Temporarily combine two gems\' summoned weapons into a single construct they wield together. Both players must agree. The combined weapon carries both weapons\' tags. If the combined tags exceed two, the wielders choose which two to keep active for the scene — the others remain latent. It lasts one scene, then separates.' },
      { name: 'Disassemble', desc: 'Take apart any gem construct — weapon, prison, architectural element — by identifying its structural logic and reversing it. Works on anything built, not on living gems. Roll Clarity. On a 6, the construct comes apart completely — structural logic reversed, the thing stops being what it was. On a 4–5, you begin the disassembly — it\'s critically destabilized and will fail at the end of the next exchange unless actively maintained or reinforced. On a 1–3, the structural logic resists you this attempt; try again or try differently.', advanced: true },
    ],
  },
  agate: {
    label: 'Agate',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'leader'],
    weapons: [
      { name: 'Whip',       tags: ['reach', 'binding'], toHit: 'Form', damage: '1' },
      { name: 'Baton',      tags: ['finesse', 'heavy'], toHit: 'Form', damage: '2' },
      { name: 'Energy lash',tags: ['reach', 'area'],    toHit: 'Form', damage: '1' },
    ],
    corePower: {
      name: 'Aura of Authority',
      desc: 'Your presence carries weight other gems feel as pressure. Gems conditioned to Homeworld hierarchy follow your direct instructions automatically — defiance doesn\'t occur to them. Unconditioned gems must roll Resolve to defy you: on a 6 they act freely. On a 4–5 they act, but it costs them something — hesitation, a visible flinch, a moment of doubt the table notices. On a 1–3 they can\'t bring themselves to defy the instruction directly; they may act around it, but not against it. Gems who have fully broken from Homeworld and are actively defiant roll their Resolve with advantage.',
    },
    developedPowers: [
      { name: 'Terrify', desc: 'A focused blast of your authority aura directed at a single target. Their rolls using Form or Resolve this exchange are made at disadvantage. Using Terrify is the Agate\'s action for this exchange.' },
      { name: 'Rally', desc: 'The same aura turned toward allies. Once per conflict you steady a flagging fusion — their next failed Harmony check doesn\'t cost a box. Alternatively, when an ally fails a Resolve roll, you may immediately allow them to roll again and take the new result.' },
    ],
    advancedPowers: [
      { name: 'Suppress', desc: 'Your authority aura focused precisely on a single gem. Roll Resolve contested against their Resolve. On a 6, suppression takes hold — their rolls using one stat of your choice are at disadvantage for the rest of the scene. On a 4–5, it holds but they feel exactly what you did — affected but acting with clear awareness. On a 1–3, they resist. They know exactly what you did and why.' },
      { name: 'Court Memory', desc: 'You invoke the precise institutional logic of Homeworld compliance protocols in a way that unsettles even fully-free gems — those who would normally resist your aura with advantage lose that advantage for this exchange.' },
      { name: 'Sustained Aura', desc: 'Your passive authority field intensifies. For one scene, even conditioned gems must roll Resolve to follow your instructions — no gem is automatically compelled. On a 6, they comply cleanly. On a 4–5, they comply but it costs them — hesitation, visible reluctance, a moment of something Homeworld trained out. On a 1–3, they can\'t bring themselves to follow the instruction; something in them has found a crack.', advanced: true },
    ],
  },
  onyx: {
    label: 'Onyx',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'rebel'],
    weapons: [
      { name: 'Twin daggers',     tags: ['paired', 'concealed'],  toHit: 'Form', damage: '1 each' },
      { name: 'Garrote construct',tags: ['binding', 'concealed'], toHit: 'Form', damage: '—' },
      { name: 'Short blade',      tags: ['finesse', 'concealed'], toHit: 'Form', damage: '1' },
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
      { name: 'Vanishing Act', desc: 'Conceal one other gem within your shadow presence — they gain your Concealed quality for a scene. They must remain within arm\'s reach. If they take any action that would be physically detectable — attacking, using a power, moving significantly — it breaks. They can still speak quietly, observe, and roll mental stats.' },
      { name: 'Dark Resonance', desc: 'In complete darkness perceive the emotional state of every gem within range with the precision of a Clarity 5 read — not mind-reading, but emotionally exact. Any light source breaks it entirely.' },
      { name: 'Shadow Step', desc: 'Move from one area of deep shadow to another within a scene boundary without crossing the intervening space. No roll for the movement itself. Detection at the destination still applies normally.', advanced: true },
    ],
  },
  hessonite: {
    label: 'Hessonite',
    court: 'yellow',
    recommendedArchetypes: ['soldier', 'leader'],
    weapons: [
      { name: 'Command baton',   tags: ['heavy', 'binding'],   toHit: 'Radiance', damage: '2' },
      { name: 'War hammer',      tags: ['heavy', 'area'],      toHit: 'Form',     damage: '2' },
      { name: 'Dual short swords',tags: ['paired', 'finesse'], toHit: 'Form',     damage: '1 each' },
    ],
    corePower: {
      name: 'Command Presence',
      desc: 'Your voice in conflict carries tactical authority. Once per conflict issue a tactical directive that gives every ally who follows it a bonus die on their next roll. Allies with a Bond of 3 or higher with you get the bonus die even on a partial follow.',
    },
    developedPowers: [
      { name: 'Read the Field', desc: 'At the start of any conflict ask the GM two tactical questions — enemy numbers, positions, capabilities, objectives. True as of that moment.' },
      { name: 'Rally Point', desc: 'Designate a position as a rally point. Allies who reach it clear one Form damage box and gain a bonus die on their next Resolve roll.' },
    ],
    advancedPowers: [
      { name: 'Strategic Withdrawal', desc: 'Organize a retreat that costs the enemy. Even as your group leaves, you ensure they lose something in the process — a position, a resource, a piece of intelligence. A miss is still a controlled loss.' },
      { name: 'Chain of Command', desc: 'Formally designate another gem as your second for a session. They gain access to Command Presence once before the session ends — they issue the directive and grant the bonus die as if it were their own.' },
      { name: 'Anticipate', desc: 'Once per conflict, retroactively declare that your gem was somewhere else when an action happened — you saw it coming. The GM determines whether the position is plausible.', advanced: true },
    ],
  },

  // ── Blue Diamond's Court ──────────────────────────────────────────────────
  sapphire: {
    label: 'Sapphire',
    court: 'blue',
    recommendedArchetypes: ['scholar', 'diplomat'],
    weapons: [
      { name: 'Ice constructs',tags: ['area', 'binding'],  toHit: 'Form', damage: '—' },
      { name: 'Elegant blade', tags: ['finesse', 'reach'], toHit: 'Form', damage: '1' },
      { name: 'Unarmed',       tags: ['finesse'],          toHit: 'Form', damage: '1' },
    ],
    corePower: {
      name: 'Future Vision',
      desc: 'Once per conflict declare you knew something was coming — a trap, an ambush, a lie — even if you didn\'t say so at the time. Outside combat, attempt deliberate visions with a Clarity roll. On a 6, clear and specific — the GM tells you one concrete true thing. On a 4–5, real but incomplete — impressions, fragments, emotional truth rather than details. On a 1–3, the vision overwhelms or misleads — the GM determines accuracy.',
    },
    developedPowers: [
      { name: 'Foresight', desc: 'Show another gem a future you\'ve seen — through touch, eye contact, or description. What they do with it is their choice.' },
      { name: 'Ice Mastery', desc: 'Control over cold extends beyond weapon summoning — freeze liquids, lower temperatures, create barriers, encase targets. Roll Form to use offensively. On a 6, targets are encased — treat them as restrained under the unattended restraint rules, difficulty 4. On a 4–5, the ice forms but incompletely — their movement is severely limited and their next roll is made with one fewer die, but they aren\'t fully restrained. On a 1–3, the cold affects the environment but doesn\'t land on the target. Barriers and environmental effects don\'t require a roll — the GM determines what the cold can achieve given available moisture and time.' },
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
      { name: 'Water constructs',  tags: ['area', 'reach'],    toHit: 'Form', damage: '1' },
      { name: 'Hydrokinetic lash', tags: ['reach', 'binding'], toHit: 'Form', damage: '1' },
      { name: 'Mirror trap',       tags: ['binding', 'area'],  toHit: 'Form', damage: '—' },
    ],
    corePower: {
      name: 'Hydrokinesis',
      desc: 'Control water — any water, in any form, within sight. Scale scales with Form and emotional state. At full strength you can move oceans. When your Resolve is 2 or lower, your control becomes erratic. You can extract water from damp air at significant effort.',
    },
    developedPowers: [
      { name: 'Wings', desc: 'Hard water wings allow flight. Airborne, your hydrokinesis range extends significantly.' },
      { name: 'Mirror Prison', desc: 'Trap a gem in a reflective water construct — not just restrained but isolated, cut off from outside contact. Roll Form contested against their Form. On a 6, it seats completely — isolated immediately. On a 4–5, it seats but something slips — one action or exchange of warning before it fully closes. On a 1–3, the construct forms but they evade — GM makes a move. While isolated, the gem cannot communicate with or perceive gems outside the construct — they cannot speak to allies, roll Resonance to reach anyone outside, or benefit from Bond dice. They retain their other mental stats for internal actions. You know this from experience.' },
    ],
    advancedPowers: [
      { name: 'Tidal Force', desc: 'Your hydrokinesis extends to weather-scale water manipulation — calling rain, generating fog, draining moisture from an area. At high Resolve the effects are precise. At low Resolve they\'re not.' },
      { name: 'Water Memory', desc: 'Water you\'ve controlled retains an imprint you can read after the fact — where it\'s been, what it\'s touched, what passed through it. The GM determines how far back the memory goes.' },
      { name: 'Absolute Tide', desc: 'Call all available water in range simultaneously and hold it. Not a weapon — a statement. The scale depends on Form and current Resolve. This is never subtle. Everyone in the scene understands what\'s happening.', advanced: true },
    ],
  },
  aquamarine: {
    label: 'Aquamarine',
    court: 'blue',
    recommendedArchetypes: ['scholar', 'soldier'],
    weapons: [
      { name: 'Wand',             tags: ['reach', 'binding'],   toHit: 'Clarity', damage: '—' },
      { name: 'Small blade',      tags: ['finesse', 'concealed'],toHit: 'Form',    damage: '1' },
      { name: 'Tether construct', tags: ['binding', 'reach'],   toHit: 'Clarity', damage: '—' },
    ],
    corePower: {
      name: 'Flight',
      desc: 'You fly naturally and with precision — not wings, self-propelled. Small size and flight make you genuinely difficult to catch. Hover indefinitely, move at significant speed.',
    },
    developedPowers: [
      { name: 'Retrieval Construct', desc: 'An enhanced wand function — fires a capturing construct that pursues a target before dissipating. Roll Clarity. On a 6, catches cleanly — target is restrained. On a 4–5, catches but doesn\'t seat fully — one fewer die on their next action, but not fully restrained. On a 1–3, misses or the target evades.' },
      { name: 'Sonic Attack', desc: 'At close range a high-frequency burst that disrupts a gem\'s ability to maintain their form. Doesn\'t poof — destabilizes. Makes their next roll at disadvantage.' },
    ],
    advancedPowers: [
      { name: 'Fast Strike', desc: 'Once per conflict, when you make a weapon attack, you may declare it a Fast Strike — your movement grants it both Finesse and Reach simultaneously for this attack, regardless of your weapon\'s normal tags. Use your weapon\'s normal To Hit stat and damage. The attack arrives from an angle that makes it extremely difficult to anticipate.' },
      { name: 'Containment Circuit', desc: 'Rather than targeting a gem with your retrieval construct, you orbit them — the construct creating a perimeter. They can\'t leave the orbit without triggering it. You have to keep moving. If they attempt to leave the orbit, the perimeter collapses inward — roll Clarity as for the Retrieval Construct to determine whether it seats cleanly.' },
      { name: 'Swarm Retrieval', desc: 'Your construct replicates into multiple simultaneous capture attempts on different targets. Roll Clarity once. On a 6, two targets are caught cleanly. On a 4–5, one is caught and the others are disrupted — disadvantage on their next action. On a 1–3, the constructs scatter without catching anything.', advanced: true },
    ],
  },
  zircon: {
    label: 'Zircon',
    court: 'blue',
    recommendedArchetypes: ['scholar', 'diplomat'],
    weapons: [
      { name: 'Briefcase construct',tags: ['binding', 'heavy'],   toHit: 'Resolve', damage: '—', note: '‡' },
      { name: 'Rapier',             tags: ['finesse', 'reach'],   toHit: 'Form',    damage: '1' },
      { name: 'Document blade',     tags: ['finesse', 'concealed'],toHit: 'Form',   damage: '1' },
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
      { name: 'Light refraction',tags: ['area', 'concealed'], toHit: 'Clarity', damage: '1' },
      { name: 'Staff',           tags: ['reach', 'heavy'],    toHit: 'Form',    damage: '2' },
      { name: 'Crystal shards',  tags: ['area', 'finesse'],   toHit: 'Clarity', damage: '1' },
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
      { name: 'Total Environment', desc: 'Construct a complete illusory environment over an existing space — not one false object but everything. Gems inside experience it as real. Requires full concentration. Breaks immediately if you take a hit that would mark a Form damage box, or if you\'re targeted by any power that lands on you directly.', advanced: true },
    ],
  },
  iolite: {
    label: 'Iolite',
    court: 'blue',
    recommendedArchetypes: ['scholar', 'leader'],
    weapons: [
      { name: 'Trichroic blade',   tags: ['finesse', 'piercing'], toHit: 'Form',    damage: '1' },
      { name: 'Twin batons',       tags: ['paired', 'heavy'],     toHit: 'Form',    damage: '2 each' },
      { name: 'Analysis construct',tags: ['area', 'finesse'],     toHit: 'Clarity', damage: '1' },
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
      { name: 'Combat staff',       tags: ['reach', 'heavy'],  toHit: 'Form', damage: '2' },
      { name: 'Energy blade',       tags: ['finesse', 'reach'],toHit: 'Form', damage: '1' },
      { name: 'Throwing constructs',tags: ['area', 'reach'],   toHit: 'Form', damage: '1' },
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
      { name: 'Warp Intercept', desc: 'Calculate where a gem went if you reach the pad they used before the signature dissipates. Roll Clarity. On a 6, the GM tells you the destination precisely. On a 4–5, approximate — you know the region or colony but not the exact pad. On a 1–3, you know they went somewhere but not where.', advanced: true },
    ],
  },

  // ── Pink Diamond's Court ──────────────────────────────────────────────────
  roseQuartz: {
    label: 'Rose Quartz',
    court: 'pink',
    recommendedArchetypes: ['diplomat', 'soldier'],
    weapons: [
      { name: 'Shield', tags: ['area', 'heavy'],   toHit: 'Form', damage: '2' },
      { name: 'Sword',  tags: ['reach', 'finesse'],toHit: 'Form', damage: '1' },
      { name: 'Unarmed',tags: ['heavy'],           toHit: 'Form', damage: '2' },
    ],
    corePower: {
      name: 'Healing',
      desc: 'Heal physical damage to gem forms — closing cracks, restoring poofed gems more quickly, partially repairing cracked gems. Requires physical contact. No roll required — the cost is the box you mark. Marks one Form damage box on the healer; a scene of contact healing clears two Form damage boxes on the target.',
    },
    developedPowers: [
      { name: 'Healing Tears', desc: 'Your healing extends to emotional damage — not erasing it, but making it survivable. A gem in crisis can function through something that would otherwise incapacitate them.' },
      { name: 'Protective Bubble', desc: 'Generate a hard-light shield around another gem or group. It holds as long as you maintain it and you don\'t attack. It breaks if you\'re hit with a Heavy-tagged weapon or if you choose to drop it. No roll to maintain — the cost is the constraint on your action.' },
    ],
    advancedPowers: [
      { name: 'Deep Heal', desc: 'Clears all Form damage boxes and addresses the underlying crack in the same scene. Costs the healer two Form damage boxes. One scene of full contact. The GM determines how much of the crack is addressed.' },
      { name: 'Shared Stability', desc: 'Transfer a portion of your own Form stability to another gem as a buffer. You mark the Form damage box they would have taken — they don\'t mark it. Simultaneously, in the fiction, they feel the hit land and you feel it too. Entirely voluntary. Cannot be used on yourself.' },
      { name: 'Heal the Past', desc: 'A single use per campaign: you repair a cracked gem enough to restore one stat point lost to the crack. The time, the scene, and the cost are significant. It is not reversible.', advanced: true },
    ],
  },
  emerald: {
    label: 'Emerald',
    court: 'pink',
    recommendedArchetypes: ['diplomat', 'leader'],
    weapons: [
      { name: 'Command whip',     tags: ['reach', 'binding'],   toHit: 'Radiance', damage: '1' },
      { name: 'Emerald blade',    tags: ['finesse', 'piercing'],toHit: 'Form',     damage: '1' },
      { name: 'Ship-based weapons',tags: ['area', 'heavy'],     toHit: 'Clarity',  damage: '2', note: 'Requires the Emerald to be aboard or in direct tactical range of a Homeworld vessel.' },
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
      { name: 'Whip',               tags: ['reach', 'binding'],  toHit: 'Form',     damage: '1' },
      { name: 'Elegant baton',      tags: ['finesse', 'heavy'],  toHit: 'Form',     damage: '2' },
      { name: 'Dismissal construct',tags: ['binding', 'area'],   toHit: 'Radiance', damage: '—' },
    ],
    corePower: {
      name: 'Oversight',
      desc: 'Know the official status, assignment, and recorded history of any gem you\'ve interacted with through Homeworld\'s systems. Know when a gem\'s actual behavior deviates from their recorded function.',
    },
    developedPowers: [
      { name: 'Reassignment Order', desc: 'Issue a reassignment that Homeworld-conditioned gems feel compelled to follow. They roll Resolve to defy it. On a 6, they resist and act freely. On a 4–5, they comply with visible reluctance — they follow the reassignment but make clear to anyone watching that something is wrong. On a 1–3, they comply without apparent resistance.' },
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
      { name: 'Dual fans',          tags: ['paired', 'finesse'],  toHit: 'Form',      damage: '1 each' },
      { name: 'Elegant blade',      tags: ['finesse', 'concealed'],toHit: 'Form',     damage: '1' },
      { name: 'Emotional construct',tags: ['area', 'binding'],    toHit: 'Resonance', damage: '—' },
    ],
    corePower: {
      name: 'Emotional Fluency',
      desc: 'Read emotional states with precision through observation. Always know the general emotional state of any gem you\'re in direct conversation with, and can identify when they\'re suppressing something significant.',
    },
    developedPowers: [
      { name: 'Mirror Affect', desc: 'Reflect a gem\'s emotional state back at them with amplified clarity. Roll Resonance. On a 6, their suppressed emotional state surfaces completely — they cannot maintain their performed affect for the rest of the scene, and the GM describes what they actually feel. On a 4–5, it partially surfaces — the performance cracks visibly and one gem present notices, but they recover composure by next exchange. On a 1–3, the reflection lands wrong — they feel seen in a way that makes them defensive or hostile rather than open.' },
      { name: 'Neutral Ground', desc: 'Establish a conversational space in which neither party can escalate without visibly breaking something. Roll Resonance. On a 6, the space holds cleanly — the first party to escalate to physical conflict is seen doing it, and the fiction reflects that. On a 4–5, it holds but one party is straining against it — they\'re listening but they want to leave or fight; one more provocation and it breaks. On a 1–3, the attempt reads as manipulation — the GM makes a move. While maintaining it, you cannot do anything that would be read as hostile or deceptive. If you do, it breaks immediately.' },
    ],
    advancedPowers: [
      { name: 'Emotional Anchor', desc: 'Provide a gem in crisis with a stable focal point — your own emotional state, steady and legible. They may add your Resolve as bonus dice — up to a maximum of 4 — to any roll where emotional steadiness is what\'s holding them together, once per scene per target. This counts as their Bond source for that roll if they use it.' },
      { name: 'Read the Room (Expanded)', desc: 'Read the emotional architecture of a gathering rather than an individual — what\'s suppressed collectively, what\'s close to the surface, what everyone is performing versus what\'s underneath. Not individuals. The field.' },
      { name: 'Dissipate', desc: 'Identify the specific emotional state driving a situation — the fear, the grief, the anger — and create enough space around it that it loses its grip on the scene. Not resolved. Set down for now.', advanced: true },
    ],
  },
  tourmaline: {
    label: 'Tourmaline',
    court: 'pink',
    recommendedArchetypes: ['diplomat', 'rebel'],
    weapons: [
      { name: 'Color-shifting blade',    tags: ['finesse', 'concealed'], toHit: 'Form',     damage: '1' },
      { name: 'Multi-spectrum construct',tags: ['area', 'finesse'],      toHit: 'Radiance', damage: '1' },
      { name: 'Twin weapons',            tags: ['paired', 'finesse'],    toHit: 'Form',     damage: '1 each' },
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
      { name: 'Spectrum Split', desc: 'Simultaneously present as two different gem types to different observers in the same scene. Requires a Radiance roll each time a new observer enters or the scene shifts significantly. On a 6, both readings hold cleanly. On a 4–5, both hold but one observer senses something slightly off — they can\'t name it. On a 1–3, both readings collapse and everyone in the scene knows something was wrong.' },
      { name: 'Register Shift', desc: 'Abruptly change your social presentation mid-interaction — the gem you\'re speaking with must reorient completely. Whatever authority or familiarity they were operating from has to be rebuilt. Their next social action is made with one fewer die.' },
      { name: 'Full Spectrum', desc: 'Your presentation becomes genuinely unreadable — no gem type reads clearly, no court affiliation registers, no caste signal lands consistently. You are whoever the scene needs. Lasts one scene. Under direct scrutiny, roll Radiance to maintain. On a 6, it holds. On a 4–5, it holds but the scrutinizing gem senses a gap they can\'t quite articulate — one more examination and it won\'t hold. On a 1–3, it collapses entirely.', advanced: true },
    ],
  },
  turquoise: {
    label: 'Turquoise',
    court: 'pink',
    recommendedArchetypes: ['diplomat', 'scholar'],
    weapons: [
      { name: 'Ancient blade',       tags: ['finesse', 'heavy'],  toHit: 'Form', damage: '2' },
      { name: 'Protective construct',tags: ['area', 'binding'],   toHit: 'Form', damage: '—' },
      { name: 'Staff',               tags: ['reach', 'heavy'],    toHit: 'Form', damage: '2' },
    ],
    corePower: {
      name: 'Ancient Knowing',
      desc: 'You have existed through multiple eras of Homeworld\'s history. Once per session identify a precedent, loophole, or historical exception that technically applies — something that predates current law and hasn\'t been formally rescinded.',
    },
    developedPowers: [
      { name: 'Cultural Memory', desc: 'Know histories that predate current Homeworld records. The GM tells you one true suppressed historical fact per session.' },
      { name: 'Weathered Form', desc: 'Your long existence has made your physical form exceptionally stable. Once per conflict re-enter a scene after being poofed at Form 1 for the next exchange, regardless of Form damage boxes.' },
    ],
    advancedPowers: [
      { name: 'Historical Precedent (Extended)', desc: 'Invoke a law, tradition, or agreement that predates current Diamond authority and technically supersedes current policy. You know before you use it whether it will hold. The GM determines how much weight it carries in this specific context.' },
      { name: 'Witnessed', desc: 'Share something you personally observed from before current Homeworld history — something that predates most living gems\' experience of the empire. Gems who hear it must roll Resolve to dismiss what it implies. On a 6, they dismiss it — they can set it aside and act without its weight, at least for now. On a 4–5, they can\'t fully dismiss it — it stays with them; they act, but the GM may invoke it again before the scene ends. On a 1–3, they cannot dismiss it at all — what it implies changes something about how they understand their current situation. You have carried this for a very long time.' },
      { name: 'Survivor\'s Knowledge', desc: 'Once per session declare you\'ve personally encountered a situation structurally identical to this one before and ask the GM what happened the last time — what worked, what failed, and what the cost was.', advanced: true },
    ],
  },

  // ── Cross-Court Gems ──────────────────────────────────────────────────────
  pearl: {
    label: 'Pearl',
    court: 'cross',
    recommendedArchetypes: ['leader', 'scholar', 'diplomat', 'rebel'],
    weapons: [
      { name: 'Spear',                tags: ['reach', 'finesse'],   toHit: 'Form',    damage: '1' },
      { name: 'Sword',                tags: ['finesse', 'paired'],  toHit: 'Form',    damage: '1 each' },
      { name: 'Holographic constructs',tags: ['area', 'concealed'], toHit: 'Clarity', damage: '1' },
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
      { name: 'Training Sequence', desc: 'Compress the teaching of a physical or technical skill into one scene of focused instruction. The student gains temporary competence — a single bonus die on their next relevant roll, used within this scene or the next; after that, the competence fades.' },
      { name: 'Complete Archive', desc: 'Once per campaign produce a holographic record of something that happened before you were assigned to anyone — from your earliest formation. The GM determines what you witnessed before your memory was considered relevant to anyone.', advanced: true },
    ],
  },
  peridot: {
    label: 'Peridot',
    court: 'cross',
    recommendedArchetypes: ['scholar', 'soldier'],
    weapons: [
      { name: 'Limb enhancers',        tags: ['reach', 'heavy'],  toHit: 'Form',    damage: '2' },
      { name: 'Ferrokinetic constructs',tags: ['area', 'reach'],  toHit: 'Clarity', damage: '1' },
      { name: 'Tech blade',            tags: ['finesse', 'reach'],toHit: 'Form',    damage: '1' },
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
      { name: 'Twin short swords',tags: ['paired', 'finesse'], toHit: 'Form', damage: '1 each' },
      { name: 'Jade construct',   tags: ['heavy', 'binding'],  toHit: 'Form', damage: '2' },
      { name: 'Staff',            tags: ['reach', 'heavy'],    toHit: 'Form', damage: '2' },
    ],
    corePower: {
      name: 'Durability',
      desc: 'Your physical form is exceptionally dense and stable. Once per conflict when you would be poofed, remain present at Form 1 for this exchange, regardless of Form damage boxes — the boxes are still marked, but the power forces your form to hold for one more moment (unlike Relentless, this prevents the poof rather than returning from it).',
    },
    developedPowers: [
      { name: 'Grounding Presence', desc: 'Allies in your immediate vicinity gain a bonus die on Resolve rolls to resist being poofed, or to shake off a destabilizing effect at the start of their next action, while you\'re standing.' },
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
      { name: 'Energy sword',tags: ['finesse', 'reach'],  toHit: 'Form', damage: '1' },
      { name: 'War hammer',  tags: ['heavy', 'area'],     toHit: 'Form', damage: '2' },
      { name: 'Dual blades', tags: ['paired', 'finesse'], toHit: 'Form', damage: '1 each' },
    ],
    corePower: {
      name: 'Adaptability',
      desc: 'Once per conflict switch which stat you\'re rolling for an action that would normally call for Form — using Clarity instead of Form for a precise strike, Resolve instead of Form to push through on willpower.',
    },
    developedPowers: [
      { name: 'Read the Assignment', desc: 'Once per session the GM tells you what this scene most needs from the party.' },
      { name: 'Warm Presence', desc: 'Gems who have just met you treat you as though they\'ve known you slightly longer than they have. Especially useful in infiltration and first contact situations.' },
    ],
    advancedPowers: [
      { name: 'Role Shift', desc: 'Adopt a functional role completely for a scene, temporarily accessing the instincts that go with it: Scholar gains Read the Room, Soldier gains First Strike, Diplomat gains Open Channel, Leader gains Hold the Line, Rebel gains Improvise. Once per session.' },
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
export const STAT_ABBR: Record<StatKey, string> = {
  form:      'FOR',
  clarity:   'CLA',
  resonance: 'RSN',
  radiance:  'RAD',
  resolve:   'RSV',
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
