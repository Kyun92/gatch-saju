export type ElementType = "wood" | "fire" | "earth" | "metal" | "water";

export type GenderType = "male" | "female";

export interface CharacterPreset {
  element: ElementType;
  gender: GenderType;
  className: string;
  title: string;
  description: string;
  avatarUrl: string;
}

const HEAVENLY_STEM_ELEMENT: Record<string, ElementType> = {
  '甲': 'wood',  '乙': 'wood',
  '丙': 'fire',  '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
};

const ELEMENT_CLASS_NAMES: Record<ElementType, string> = {
  wood:  '숲의 현자',
  fire:  '불꽃 마법사',
  earth: '대지의 기사',
  metal: '백은 성기사',
  water: '물결의 점술사',
};

const ELEMENT_DESCRIPTIONS: Record<ElementType, string> = {
  wood:  '성장과 생명력을 지닌 숲의 지혜자. 유연하고 끈질긴 생명 에너지를 다룹니다.',
  fire:  '열정과 카리스마로 가득한 불꽃의 마법사. 빠른 직감과 강렬한 창의력을 지닙니다.',
  earth: '안정과 신뢰를 상징하는 대지의 기사. 묵직한 책임감과 포용력으로 주변을 지킵니다.',
  metal: '예리한 판단력을 지닌 백은의 성기사. 원칙과 정의를 위해 날카로운 검을 휘두릅니다.',
  water: '유려한 지혜와 통찰을 지닌 물결의 점술사. 흐르는 물처럼 상황에 맞게 변화합니다.',
};

const ELEMENT_CLASS_NAMES_BY_GENDER: Record<ElementType, Record<GenderType, string>> = {
  wood:  { male: '숲의 궁수',     female: '숲의 드루이드' },
  fire:  { male: '불꽃 전사',     female: '불꽃 마법사' },
  earth: { male: '대지의 기사',   female: '대지의 현자' },
  metal: { male: '강철 검사',     female: '백은 성기사' },
  water: { male: '바다의 마법사', female: '물결의 점술사' },
};

/**
 * Returns a character preset based on the heavenly stem (天干) and gender.
 *
 * @param dayMasterStem - Single heavenly stem character, e.g. '壬', '甲', '丁'
 * @param gender - 'male' | 'female'
 * @returns CharacterPreset or null if the stem is unrecognised
 */
export function getCharacterPreset(dayMasterStem: string, gender: GenderType = 'male'): CharacterPreset | null {
  const stem = dayMasterStem.trim().charAt(0);
  const element = HEAVENLY_STEM_ELEMENT[stem];

  if (!element) {
    return null;
  }

  const className = ELEMENT_CLASS_NAMES_BY_GENDER[element][gender];

  return {
    element,
    gender,
    className,
    title: className,
    description: ELEMENT_DESCRIPTIONS[element],
    avatarUrl: `/characters/${element}-${gender}.png`,
  };
}

export { HEAVENLY_STEM_ELEMENT, ELEMENT_CLASS_NAMES };
