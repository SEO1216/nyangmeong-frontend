# SJM 핸드오프

## 지금 하는 것

SCR-MYP-005 공동양육자 추가 · 보낸 초대 취소·삭제 버튼 연결 — 구현 중 (승인 2026-11-16), 시작 2026-11-16

- 기준: 기능명세서 `마이페이지_기능명세서_v0.5_20261101`(DMS 미인증이라 캐시 사용. 명세에는 취소·삭제가 아직 없다), 백엔드 `docs/api/pet.md`의 cancel·DELETE 줄. 백엔드 마일스톤의 프론트 경로 추정은 실제 파일(`features/pet/list/SentInvitations.jsx`, `features/pet/invite/InvitationClosed.jsx`)로 확인함
- 디자인: 시안 폴더의 `myp-pets-invite.html`(보낸 초대 행). 취소·삭제 버튼은 시안에 없을 수 있어 행 모양은 시안 그대로, 버튼은 `buttonStyles.js`의 `TEXT_ACTION`(취소)·`TEXT_ACTION_DANGER`(삭제), 확인 모달은 `PetUnlinkDialog`와 같은 `Modal isConfirm isSpacious` 모양
- 공통: `features/pet/shared/petCodes.js` `INVTN_STTS.CNCL = 'PETC0035'`. `features/pet/api.js` `cancelInvitation`(POST `/caregiver-invitations/{sn}/cancel`)·`deleteInvitation`(DELETE `/caregiver-invitations/{sn}`), SJM 백엔드(있음). `features/pet/queries.js` `useCancelInvitation`·`useDeleteInvitation`(성공·실패 모두 `invitationKeys.all` 무효화)
- FN-MYP-005-03 보낸 초대: `SentInvitations.jsx`에 배지 "취소됨"(gray tone) 추가. 행의 `pet.invtnSttsCd`가 대기중이면 [취소], 취소면 [삭제]. 취소·삭제는 초대 단위라 확인 모달 문구에 그 초대에 묶인 반려동물 이름을 모두 적는다("…에게 보낸 코코·나비 초대를 취소할까요?"). 새 파일 `features/pet/list/SentInvitationDialog.jsx`(취소/삭제 두 모드, 요청 중 닫기 막음). 성공 토스트 "초대를 취소했어요"·"초대를 삭제했어요"
  - 오류: 취소 409 `CAREGIVER_INVITATION_CANCELED`·`..._ALREADY_PROCESSED`, 400 `..._EXPIRED`, 403 `..._NOT_SENDER` / 삭제 409 `..._NOT_CANCELED`, 403, 404 `..._NOT_FOUND` → 모달을 닫고 서버 `message` 토스트, 목록을 다시 읽어 실제 상태로 바꾼다. 401은 화면에서 처리하지 않는다
  - 완료 조건: `명령:` `yarn -s lint`, `yarn -s build` 종료 코드 0. `화면:` tester(mbrSn 1)로 user0006 이메일에 초대 → 대기중 행 [취소] → 모달 [취소하지 않음]이면 그대로, 확인하면 배지 "취소됨"·[삭제]로 바뀜 → [삭제] 확인 → 그 초대의 행이 모두 사라짐. 한 초대 여러 마리면 행마다 같이 바뀜. 다른 탭에서 먼저 취소해 둔 뒤 [취소]하면 409 토스트와 목록 갱신. 393px에서 버튼·배지가 이메일과 겹치지 않음
- FN-MYP-005-10 만료·종료 안내: `InvitationClosed.jsx`에 `PETC0035`면 "취소된 초대예요" / "초대한 분이 이 초대를 취소했어요." / "필요하면 초대한 분께 다시 초대를 요청해 주세요." (아이콘·버튼은 만료·처리됨과 같다). `InvitationPage.jsx`는 대기중이 아니면 이미 안내로 가므로 그대로. `queries.js` `CLOSED_CODES`에 `CAREGIVER_INVITATION_CANCELED`를 넣어 수락·거절 중 취소되면 다시 읽어 안내로 바뀐다. 삭제한 초대(404)는 기존 "초대를 찾을 수 없어요" 그대로
  - 완료 조건: `화면:` 취소한 초대 링크를 user0006(mbrSn 6)으로 열면 "취소된 초대예요" 안내, [마이페이지 홈으로] 하나, 393px에서 전체 폭. 수락 화면을 열어 둔 채 tester가 취소 → [수락]하면 409 뒤 취소 안내로 바뀜. 삭제 뒤 같은 링크는 "초대를 찾을 수 없어요"
- 정리: 화면 확인으로 공용 DB에 초대 1~2건(`JNT_BRUP_INVTN`, 취소 뒤 `DEL_YN='Y'`)·상태 이력·user0006 인앱 알림이 생긴다. 번호와 복구 SQL은 보고에 적는다
- 문서 작업(`/end` 때 다음에 할 것): FN-MYP-005-03에 [취소]·[삭제]·"취소됨" 배지·확인 모달, FN-MYP-005-10에 취소 안내 문구 추가. 화면설계서 SCR-MYP-005 보낸 초대·5-6 안내도
- 새 의존성: 없음
- 질문: 시안 `myp-pets-invite.html`의 보낸 초대 행을 기준으로 하고 버튼만 기존 텍스트 버튼 스타일로 덧붙일까요? (추천: 그렇게 한다)
  - 결정: 추천안대로. 시안 `myp-pets-invite.html` 보낸 초대 행 기준, 버튼은 TEXT_ACTION(취소)·TEXT_ACTION_DANGER(삭제)

### 추가 요청

| 번호 | 바꿀 파일 | 완료 조건 | 요청 |
| --- | --- | --- | --- |
| 추가-1 | `features/pet/list/SentInvitations.jsx`, 새 `features/pet/list/MoreMenu.jsx`(`PetSlide.jsx`의 ⋮ 메뉴를 꺼내 공용으로), `PetSlide.jsx` | 명령: lint·build 0. 화면: 초대 1건=1행, 둘째 줄 "연탄·루루 · 발송 · 가입 · 만료"(만료는 끝), 오른쪽은 배지+⋮만([취소]·[삭제] 텍스트 버튼 없음), ⋮는 대기중 "초대 취소"·취소됨 "삭제"(빨강), 할 게 없는 행은 ⋮ 자리만 비움, 반려동물별 결과가 갈리면 배지 "일부 수락"+둘째 줄 "탄이 수락(초록) · 까미 거절(빨강)", 메뉴를 고르면 기존 확인 모달, 393px에서 이메일·배지·⋮ 안 겹침 | 요청 2026-11-16 "보낸 초대 행을 한 초대 한 행·⋮ 메뉴로 다듬기" |
| 추가-2 | `features/pet/invite/InvitationClosed.jsx`, `features/pet/invite/InvitationAccept.jsx` | 명령: lint·build 0. 화면: 취소 안내 아이콘이 ✕ 든 원, 404는 같은 카드 모양(편지+✕ 아이콘, "초대를 찾을 수 없어요", "삭제됐거나 잘못된 링크예요. 링크를 다시 확인해 주세요.", [마이페이지 홈으로]) | 요청 2026-11-16 "취소 안내 아이콘과 404 안내를 같은 카드 모양으로" |
| 추가-3 | `features/pet/list/SentInvitations.jsx` | 명령: lint·build 0. 화면: 둘째 줄 "가입 회원"·"미가입", 이메일은 "@" 뒤에서만 줄바꿈하고 넘칠 때만 글자 단위, 둘째 줄은 단어 단위(break-keep), 393·1440px | 요청 2026-11-16 "393px 보낸 초대 행 다듬기" |
| 추가-4 | `features/pet/list/SentInvitations.jsx`, `features/pet/list/MoreMenu.jsx` | 명령: lint·build 0. 화면: 둘째 줄은 이름+날짜 문구만(대기중 "N일 후 만료"·당일 "오늘 만료", 그 외 "MM-DD 보냄", 대기중+미가입은 "메일로 보냄 · N일 후 만료"), 일부 수락은 이름 자리에 "탄이 수락 · 까미 거절". 모바일(≤760px): 1줄 이메일 말줄임+테두리 없는 ⋮(없으면 생략), 2줄 배지→이름(말줄임)→오른쪽 끝 날짜(작고 흐리게). PC는 배지+⋮ 오른쪽 그대로. 393·360·1440px | 요청 2026-11-16 "보낸 초대 행 정보 줄이기·모바일 배치" |
| 추가-5 | `features/pet/list/SentInvitations.jsx` | 명령: lint·build 0. 화면: 둘째 줄 반려동물 이름이 보통 굵기(이메일은 그대로 굵게). 일부 수락의 수락 초록·거절 빨강과 기준선 정렬은 그대로 | 요청 2026-11-16 "시안대로 이름을 보통 굵기로(글자를 덜 무겁게)" |
| 문서 | FN-MYP-005-03 행 구성 변경(초대당 1행·⋮ 메뉴·일부 수락 배지, 가입 여부·만료 안내 표시를 "N일 후 만료"·"MM-DD 보냄"·"메일로 보냄"으로), FN-MYP-005-10 404 안내 | `/end` 문서 작업 | 요청 2026-11-16 |

## 다음에 할 것

### 내 코드 작업

- (선택) 꾸미기 슬롯 아이템 이름이 390px에서 단어 중간에서 끊긴다("방울 목걸/이"). 슬롯은 이미지 자리라 이번엔 두었다
- JAJ·LJS 알림: 공용 `components/AnalyzeProgress.jsx`를 새로 만들었다(영수증 분석 게이지, `label` prop). JAJ의 `features/ai/receipt/ReceiptUploadModal.jsx`는 함수·상수를 지우고 import만 바꿨고 화면 동작은 같다. 새 분석 화면에 게이지가 필요하면 이 컴포넌트를 쓴다
- SCR-MYP-002 10마리 보유 때 삭제하면 등록 카드로 바뀌는지 화면 확인(데이터가 없어 못 함)
- SCR-MYP-002·005 화면 확인: 삭제 때 공동양육자에게 알림이 실제로 갔는지(백엔드 알림 테스트), 초대 → 수락 → 삭제 → 자동 해제 흐름
- (선택) SCR-MYP-030 시드 `db/seed/20261028_seed_data.sql`의 `EXPND_SN=406`(병원·공용, "병원은 공용 불가" 규칙 위반): 팀장에게 알리고 백엔드 저장소에서 고침. 서버가 저장을 막아 급하지 않음

### 내 문서 작업(설계서·명세)

- FN-MYP-002-02·화면설계서 SCR-MYP-002: 슬라이드 이름 옆에 "오류 확인 중" 배지 추가(amber, 주양육/공동양육 다음), 슬라이드의 "대표" 배지 삭제(대표 지정 메뉴·API 설명은 그대로)
- FN-MYP-010-14: 보관함 탭 구성을 [전체]·머리·얼굴·목·의상·가방으로(맨 앞 [전체]가 기본이고 부위 구분 없이 보유 아이템 모두 표시, 탭 이름·순서·모양은 상점 FN-MYP-011-02와 같다). 화면설계서 10-4 보관함 설명도 맞춘다
- 화면설계서 SCR-MYP-031 1단계 "직접 입력하기" 설명 문구를 "영수증이 없는 지출"로 확인·반영(구현은 "인터넷 결제 등 영수증이 없는 지출"에서 줄였다. 360 폭에서 두 줄이 되어서)
- FN-MYP-031-02·03: 필수 라벨 * 표시와 [저장] 비활성일 때 빠진 항목 한 줄 안내("카테고리·반려동물 입력이 필요해요"). [저장] 비활성 규칙은 그대로
- FN-MYP-030-17: 편집 모드 바 `[편집 취소]` 문구를 `[나가기]`로 (`ExpenseRangeSelect`를 고쳤다. /end 때 명세에 반영)
- 설계서에 없던 문구 반영: 반려동물 삭제 성공 토스트(SCR-MYP-002), 케어미션 안내("이 날은 출제된 미션이 없어요"·"오늘 출제된 미션이 없어요"·"미션을 불러오지 못했어요"), 초대 수락·거절·만료 안내와 "초대를 찾을 수 없어요"(SCR-MYP-005), 캐릭터 생성 안내(사진 형식·용량, 중복 생성·주양육자만·실패 토스트), 목표체중 오류 "0보다 큰 숫자로 입력해 주세요"
- SCR-MYP-040 설계서: 새 비밀번호 칸 안내, 휴대폰 "미등록" 표기
- FN-MYP-030-05: "등록순 고정"을 금액순(같으면 등록순, 공용은 맨 아래)으로
- FN-MYP-030-10·FN-MYP-002-07: "이름(삭제됨)" 표기와 문구가 맞는지 확인
- FN-MYP-040-09·13: 가입 제공자 표시를 텍스트 배지에서 SNS 로고 칩으로(SNS 회원 6-3, "카카오 간편 가입" 문구는 유지). 화면설계서 6-3 그림도 맞춘다
- FN-MYP-040-09: SNS 계정 연동 버튼 추가(연동됨/가입 계정 표시, [연동하기], 해제 없음, 이메일·SNS 회원 모두 노출, 실패 시 서버 message 토스트)
- FN-MYP-003-03: 털색에 얼룩 추가
- FN-MYP-003-04: "소수 셋째 자리까지" → 소수 둘째 자리·200kg 이하, 정상범위 자동 계산('N')·직접 입력('Y') 선택과 안내 문구("현재 체중의 ±10%로 자동 계산돼요. 성장기이거나 수의사 권장 범위가 있다면 직접 입력해 주세요.") 추가
- FN-MYP-010-13: 고정 좌표 겹침 → 서버 합성(`POST /ai/characters/{pixelCharSn}/preview` PNG). 010-17·18·19는 서버 합성에 맞게 고치거나 삭제. 상점 미리보기가 다르면 FN-MYP-011-01도
- FN-MYP-004-01: 서버에 권한(`authrtNm`)이 없어 카드에서 뺀 "권한" 줄을 명세에서 고칠지

### 팀 답 기다림

- 등록-삭제를 반복하면 같은 날 케어미션이 다시 출제될 수 있다(포인트 악용 여지). 막을지 백엔드와 정한다
- SCR-MYP-010 털색을 "흰색"으로 등록했는데 생성 캐릭터가 검은 강아지였다. 서버가 털색을 반영하는지(LJS)
- FN-MYP-010-12 첫 생성 실패 때 [캐릭터 만들기] 재노출과 실패 안내 문구(LJS)
- 서버 상점이 `MYPC0006` 신발 4개를 주는데 프론트 부위는 5개(`MYPC0001~0005`)라 [전체]에만 나오고 부위 이름이 빈칸. 서버 DB가 다른지(LJS)
- 초대 수락 카드(`InvitationAccept`)에서 아직 양육자가 아니라 얼굴이 403이면 기본 아이콘만 보인다. 허용할지(LJS)
- 건강 일지 병원 영수증 저장 때 자동 기록되는 가계부 1건(FN-AIM-009-10)이 `recptSn`으로 연결되는지(JAJ·YAY). 가계부 출처 영수증 다시 열기는 명세에 진입점이 없어 안 했다(필요하면 명세에서 정한다)
- 공용 DB 정리(SCR-MYP-031 검증): 회원 1 지출 `EXPND_SN=10459`(소프트 삭제), 인앱 알림 `INAPP_NOTI_SN=5297`(남김). `NOTI_SNDNG_LOG` 발송 기록, petSn 1011 케어미션(EXPENSE_CREATE) 반영이 생겼을 수 있다. 복구: `DELETE FROM EXPND WHERE EXPND_SN = 10459;`, `DELETE FROM INAPP_NOTI WHERE INAPP_NOTI_SN = 5297;`
- 스타일 결정 합의: 그림자 토큰 `shadow-depth-sm/md/lg`·`ring-focus`·`ring-error`(`OPEN_ISSUES.md`에 제안), `@theme` 토큰·Pretendard CDN·브랜드 색 #285a5c·lucide·가계부 tone·warn 토큰. 합의되면 `docs/OPEN_ISSUES.md` 스타일링 항목 갱신

### 다른 사람 담당·기다리는 것

- FN-MYP-040-09 `POST /api/members/me/sns-links` 병합 뒤(YAY): 성공 토스트·"연동됨" 전환, 서버 오류 `message`를 화면으로 보고 `useSnsCallback` 오류 처리를 맞춘다
- `CHARACTER_BAKE_ENABLED`(LJS)가 켜지면 LJS와 `/mypage/characters`·홈 얼굴이 착용 모습인지 화면 확인. SCR-MYP-011 상점 미리보기 겹침도 이미지가 나오면 확인
- SCR-MYP-011 기준 문서 `v0.6_20261022`가 DMS에 올라오면 FN-MYP-011-03·04(사람이 준 수치로 만듦)와 대조
- SCR-MYP-005 진입: 알림 드롭다운(SCR-COM-004), 가입 직후 자동 노출(SCR-ACC-001, YAY·AIC), 로그인이 `redirect`를 받는지(AIC)
- 시안 v5의 페이지 배경 `#FDFCFB`·푸터 `#FCF9F7`이 `UserLayout.jsx`·`UserFooter.jsx`(LJS)에 아직 옛 값

### 리팩토링 때 맞출 것(QA 뒤)

- SCR-MYP-002 인식 번호 여유: 1108px에서 15자리 여유가 4.13px뿐이다(Pretendard 기준, 1108~1280 원래 값). 글꼴·카드 패딩을 바꾸면 1101~1110 구간을 다시 잰다
- 공용 `components/Modal.jsx`: 가운데 모달에서 배경 오른쪽을 누르면 닫히지 않는다(왼쪽·위·아래는 닫힘, 가계부 [영수증으로 등록]에서 확인). `handleMouseDown`의 스크롤바 예외(`clientX >= rect.left + dialog.clientWidth`면 무시)가 `isTop`이 아닌 모달에도 걸려 모달 오른쪽 끝보다 오른쪽 배경 클릭이 무시된다. 고칠 방향: 스크롤바 예외는 `isTop`일 때만, 보통 모달은 클릭이 dialog 상자 밖일 때만 닫는다


## 중단 2026-11-16 11:13 (5시간 한도 95%)
- 자동 커밋한 변경 9개: handoff/SJM.md, milestones/SJM.md, src/features/pet/api.js, src/features/pet/invite/InvitationAccept.jsx, src/features/pet/invite/InvitationClosed.jsx, src/features/pet/list/PetSlide.jsx, src/features/pet/list/SentInvitations.jsx, src/features/pet/queries.js, src/features/pet/shared/petCodes.js
- 커밋 안 한 새 파일 2개 (사람이 판단): src/features/pet/list/MoreMenu.jsx, src/features/pet/list/SentInvitationDialog.jsx
- 이어서: 이 파일의 "지금 하는 것" 과 `git log -1` 을 본다
