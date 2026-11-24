import { PATHS } from '@/routes/paths';

/** 마이페이지 반려동물 등록 모달 주소. 등록을 마치면 returnTo로 돌아오고 새 아이가 선택됨(마이페이지 PetListPage가 읽음) */
export const getRegisterPath = (returnTo) =>
  `${PATHS.MYPAGE_PETS}?${new URLSearchParams({ register: '1', returnTo })}`;
