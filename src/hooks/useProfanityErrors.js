import { useEffect } from 'react';
import { PROFANITY_MESSAGE } from '@/utils/profanity';

/**
 * 서버가 금칙어로 거절한 칸에 안내 문구를 붙이고, 첫 칸으로 포커스를 옮긴다
 * - fields: 걸린 서버 필드 이름 배열(profanityFieldsOf), fieldMap: { 서버 필드: { key: errors 키, id: 입력칸 id } }(컴포넌트 밖 상수)
 * - 고치면 지워지는 것은 폼의 기존 clearError와 같다
 */
export default function useProfanityErrors(fields, fieldMap, setErrors) {
  useEffect(() => {
    const targets = fields.filter((field) => fieldMap[field]);
    if (targets.length === 0) return;
    setErrors((prev) => ({
      ...prev,
      ...Object.fromEntries(
        targets.map((field) => [fieldMap[field].key, PROFANITY_MESSAGE]),
      ),
    }));
    document.getElementById(fieldMap[targets[0]].id)?.focus();
  }, [fields, fieldMap, setErrors]);
}
