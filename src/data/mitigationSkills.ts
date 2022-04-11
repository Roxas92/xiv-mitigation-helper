import { MitigationSkill, MitigationSkillDescription } from "../models/MitigationSkill";
import PhysisIcon from '../assets/skills/physis.png';
import SoteriaIcon from '../assets/skills/soteria.png';
import KeracholeIcon from '../assets/skills/kerachole.png';
import IxocholeIcon from '../assets/skills/ixochole.png';
import ZoeIcon from '../assets/skills/zoe.png';
import TaurocholeIcon from '../assets/skills/taurochole.png';
import HaimaIcon from '../assets/skills/haima.png';
import HolosIcon from '../assets/skills/holos.png';
import PanhaimaIcon from '../assets/skills/panhaima.png';
import KrasisIcon from '../assets/skills/krasis.png';
import PneumaIcon from '../assets/skills/pneuma.png';
import IconCelestialIntersection from '../assets/skills/celestial_intersection.png';
import IconEssentialDignity from '../assets/skills/essential_dignity.png';
import IconCollectiveUnconscious from '../assets/skills/collective_unconscious.png';
import IconCelestialOpposition from '../assets/skills/celestial_opposition.png';
import IconEarthlyStar from '../assets/skills/earthly_star.png';
import IconHoroscope from '../assets/skills/horoscope.png';
import IconNeutralSect from '../assets/skills/neutral_sect.png';
import IconExaltion from '../assets/skills/exaltion.png';
import IconMacrocosmos from '../assets/skills/macrocosmos.png';

export const mitigationSkills: Record<MitigationSkill, MitigationSkillDescription> = {
	[MitigationSkill.WHISPERING_DAWN]: {
		id: MitigationSkill.WHISPERING_DAWN,
		cooldown: 60,
		duration: 21,
		name: 'Whispering Dawn'
	},
	[MitigationSkill.FEY_ILLUMINATION]: {
		id: MitigationSkill.FEY_ILLUMINATION,
		cooldown: 120,
		duration: 20,
		name: 'Fey Illumination'
	},
	[MitigationSkill.SACRED_SOIL]: {
		id: MitigationSkill.SACRED_SOIL,
		cooldown: 30,
		duration: 15,
		name: 'Sacred Soil'
	},
	[MitigationSkill.SUMMON_SERAPH]: {
		id: MitigationSkill.SUMMON_SERAPH,
		cooldown: 120,
		duration: 22,
		name: 'Summon Seraph'
	},
	[MitigationSkill.EXPEDIENT]: {
		id: MitigationSkill.EXPEDIENT,
		cooldown: 120,
		duration: 20,
		name: 'Expedient'
	},
	PHYSIS: {
		id: MitigationSkill.PHYSIS,
		cooldown: 60,
		duration: 15,
		name: 'Physis',
		icon: PhysisIcon,
	},
	[MitigationSkill.SOTERIA]: {
		id: MitigationSkill.SOTERIA,
		cooldown: 90,
		duration: 15,
		name: 'Soteria',
		icon: SoteriaIcon,
	},
	[MitigationSkill.KERACHOLE]: {
		id: MitigationSkill.KERACHOLE,
		cooldown: 30,
		duration: 15,
		name: 'Kerachole',
		icon: KeracholeIcon,
	},
	[MitigationSkill.IXOCHOLE]: {
		id: MitigationSkill.IXOCHOLE,
		cooldown: 30,
		duration: 0,
		name: 'Ixochole',
		icon: IxocholeIcon,
	},
	[MitigationSkill.ZOE]: {
		id: MitigationSkill.ZOE,
		cooldown: 90,
		duration: 0,
		name: 'Zoe',
		icon: ZoeIcon,
	},
	[MitigationSkill.TAUROCHOLE]: {
		id: MitigationSkill.TAUROCHOLE,
		cooldown: 45,
		duration: 15,
		name: 'Taurochole',
		icon: TaurocholeIcon,
	},
	[MitigationSkill.HAIMA]: {
		id: MitigationSkill.HAIMA,
		cooldown: 120,
		duration: 15,
		name: 'Haima',
		icon: HaimaIcon,
	},
	[MitigationSkill.HOLOS]: {
		id: MitigationSkill.HOLOS,
		cooldown: 120,
		duration: 20,
		name: 'Holos',
		icon: HolosIcon,
	},
	[MitigationSkill.PANHAIMA]: {
		id: MitigationSkill.PANHAIMA,
		cooldown: 120,
		duration: 15,
		name: 'Panhaima',
		icon: PanhaimaIcon,
	},
	[MitigationSkill.KRASIS]: {
		id: MitigationSkill.KRASIS,
		cooldown: 60,
		duration: 10,
		name: 'Krasis',
		icon: KrasisIcon,
	},
	[MitigationSkill.PNEUMA]: {
		id: MitigationSkill.PNEUMA,
		cooldown: 120,
		duration: 0,
		name: 'Pneuma',
		icon: PneumaIcon,
	},
	CELESTIAL_INTERSECTION: {
		id: MitigationSkill.CELESTIAL_INTERSECTION,
		cooldown: 30,
		duration: 0,
		name: 'Celestial Intersection',
		icon: IconCelestialIntersection,
	},
	ESSENTIAL_DIGNITY: {
		id: MitigationSkill.ESSENTIAL_DIGNITY,
		cooldown: 40,
		duration: 0,
		name: 'Essential Dignity',
		icon: IconEssentialDignity,
	},
	COLLECTIVE_UNCONSCIOUS: {
		id: MitigationSkill.COLLECTIVE_UNCONSCIOUS,
		cooldown: 60,
		duration: 15,
		name: 'Collective Unconscious',
		icon: IconCollectiveUnconscious,
	},
	CELESTIAL_OPPOSITION: {
		id: MitigationSkill.CELESTIAL_OPPOSITION,
		cooldown: 60,
		duration: 15,
		name: 'Celestial Opposition',
		icon: IconCelestialOpposition,
	},
	EARTHLY_STAR: {
		id: MitigationSkill.EARTHLY_STAR,
		cooldown: 60,
		duration: 10,
		name: 'Earthly Star',
		icon: IconEarthlyStar,
	},
	HOROSCOPE: {
		id: MitigationSkill.HOROSCOPE,
		cooldown: 60,
		duration: 30,
		name: 'Horoscope',
		icon: IconHoroscope,
	},
	NEUTRAL_SECT: {
		id: MitigationSkill.NEUTRAL_SECT,
		cooldown: 120,
		duration: 30,
		name: 'Neutral Sect',
		icon: IconNeutralSect,
	},
	EXALTATION: {
		id: MitigationSkill.EXALTATION,
		cooldown: 120,
		duration: 8,
		name: 'Exaltion',
		icon: IconExaltion,
	},
	MACROCOSMOS: {
		id: MitigationSkill.MACROCOSMOS,
		cooldown: 180,
		duration: 15,
		name: 'Macrocosmos',
		icon: IconMacrocosmos,
	},
};