/** 서버가 금칙어가 든 입력을 거절할 때의 오류 코드. 검사는 서버가 한다(응답 data는 [{ field, message }]) */
export const PROFANITY_CODE = 'PROFANITY_DETECTED';

export const PROFANITY_MESSAGE =
  '욕설이나 비속어가 포함되어 있어요. 표현을 바꿔 주세요';

const NO_FIELDS = [];
/** 렌더마다 새 배열이 생기지 않게 오류 하나당 한 번만 만든다(훅의 의존 값으로 쓰기 때문) */
const cache = new WeakMap();

export const isProfanityError = (error) => error?.code === PROFANITY_CODE;

/** 걸린 칸 이름 배열(서버 필드 이름, 예: ['pstTtl', 'pstCn']). 해당 오류가 아니면 같은 빈 배열 */
export const profanityFieldsOf = (error) => {
  if (!isProfanityError(error) || !Array.isArray(error.data)) return NO_FIELDS;
  if (!cache.has(error)) {
    cache.set(
      error,
      error.data.map((item) => (typeof item === 'string' ? item : item.field)),
    );
  }
  return cache.get(error);
};
