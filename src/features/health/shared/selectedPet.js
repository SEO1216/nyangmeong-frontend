import { createContext, useContext } from 'react';

/**
 * [건강기록 공통 반려동물 선택값] (※신규 정책)
 * - 값: { pets, pet, selectPet(petSn), isPending, isError, refetch }(refetch: 반려동물 목록 다시 조회)
 * - pet은 공통 카드에서 고른 반려동물. 반려동물이 0마리면 null
 */
export const SelectedPetContext = createContext(null);

export const useSelectedPet = () => useContext(SelectedPetContext);
