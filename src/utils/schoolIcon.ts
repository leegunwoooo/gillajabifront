const JOB_FIELD_ICON: Record<string, string> = {
  'IT':       '💻',
  '디자인':    '🎨',
  '미디어':    '🎬',
  '경영':      '📣',
  '과학':      '🔬',
  '기계':      '⚙️',
  '전기/전자': '⚡',
  '식품/조리': '🍳',
  '농업':      '🌱',
  '식품/농업': '🌱',
  '의료/보건': '🏥',
  '로봇':      '🦾',
};

function iconFromIndustryField(industryField: string): string {
  if (/소프트웨어|SW|게임/.test(industryField))         return '💻';
  if (/뉴미디어|미디어|콘텐츠/.test(industryField))      return '🎬';
  if (/디자인/.test(industryField))                      return '🎨';
  if (/로봇/.test(industryField))                        return '🦾';
  if (/의료|바이오/.test(industryField))                 return '🏥';
  if (/식품|조리/.test(industryField))                   return '🍳';
  if (/농|축|어업|수산|말 산업/.test(industryField))      return '🌱';
  if (/항만|물류|경영|비즈니스|통상/.test(industryField)) return '📣';
  if (/에너지|발전|원자력|전지|소방/.test(industryField)) return '🔬';
  if (/전자|반도체|나노|통신/.test(industryField))        return '⚡';
  if (/전기/.test(industryField))                        return '⚡';
  if (/기계|자동차|자동화|메카트로닉스|조선|항공|철강|건설|플랜트|스마트공장/.test(industryField)) return '⚙️';
  return '🏫';
}

export function getSchoolIcon(industryField: string, jobFields?: string[]): string {
  if (jobFields && jobFields.length > 0) {
    return JOB_FIELD_ICON[jobFields[0]] ?? iconFromIndustryField(industryField);
  }
  return iconFromIndustryField(industryField);
}
