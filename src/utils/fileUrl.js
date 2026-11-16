/**
 * [공용 파일 주소]
 * - 게시글 사진처럼 로그인 회원 누구나 여는 첨부 파일을 <img src>로 바로 그릴 주소(비로그인 401)
 * - 도메인 API 전용 파일(채팅·문의·영수증 등)은 도메인 API를 blob으로 받는 @/hooks/useFileImage
 */

/** 공용 파일 주소: 번호가 없으면 null */
export const publicFileUrl = (atchFileSn) =>
  atchFileSn == null ? null : `/api/files/${atchFileSn}`;
