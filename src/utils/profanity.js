/** 욕설 거르기(화면 쪽 1차 검사). 서버 검사를 대신하지 않는다 */
const BAD_WORDS = [
  '시발',
  '씨발',
  '씨바',
  '시바',
  '쓰발',
  '병신',
  '븅신',
  '개새끼',
  '개세끼',
  '개색기',
  '좆',
  '존나',
  '지랄',
  '염병',
  '미친놈',
  '미친년',
  '느금마',
  '니애미',
  'ㅅㅂ',
  'ㅆㅂ',
  'ㅂㅅ',
  'ㅄ',
  'ㅈㄹ',
  'fuck',
  'shit',
  'bitch',
];

/** 띄어쓰기·기호·숫자를 끼워 넣어 피하는 것을 막기 위해 한글·영문만 남긴다 */
const normalize = (text) =>
  text.toLowerCase().replaceAll(/[^ㄱ-ㆎ가-힣a-z]/g, '');

export const PROFANITY_MESSAGE =
  '욕설이나 비속어가 포함되어 있어요. 표현을 바꿔 주세요';

export const hasProfanity = (text) => {
  const normalized = normalize(text);
  return BAD_WORDS.some((word) => normalized.includes(word));
};
