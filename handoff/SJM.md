# SJM 핸드오프

## 지금 하는 것

SCR-MYP-002 반려동물 프로필 목록 · 인식 번호 한 줄 표시, 빈 값 "-" 통일 (명세 v0.8) — 끝 (2026-11-20, 검증 `통과` 1회차, lint·build 0, 사람 확인 완료)

- FN-MYP-002-02·03: `src/features/pet/list/PetSlide.jsx` 한 파일. `ChipNo`는 한 줄(`whitespace-nowrap`, 761~1099px `text-sm`), 빈 값은 PC·모바일 모두 흐린 "-"(`EmptyDash`, 모바일 `emptyText` "-"). 새 API·새 의존성 없음, 연결 남음 없음
- 정리(공용 DB): 없음. 기존 루루(petSn 3)·연탄(petSn 1006)을 보기만 했고 탄이(PET_SN=2)를 포함해 바뀐 행이 없다

## 다음에 할 것

### 내 코드 작업

- JAJ·LJS 알림: 공용 `components/AnalyzeProgress.jsx`를 새로 만들었다(영수증 분석 게이지, `label` prop). JAJ의 `features/ai/receipt/ReceiptUploadModal.jsx`는 함수·상수를 지우고 import만 바꿨고 화면 동작은 같다. 새 분석 화면에 게이지가 필요하면 이 컴포넌트를 쓴다
- SCR-MYP-002 10마리 보유 때 삭제하면 등록 카드로 바뀌는지 화면 확인(데이터가 없어 못 함)
- SCR-MYP-002·005 화면 확인: 삭제 때 공동양육자에게 알림이 실제로 갔는지(백엔드 알림 테스트), 초대 → 수락 → 삭제 → 자동 해제 흐름
- (선택) SCR-MYP-030 시드 `db/seed/20261028_seed_data.sql`의 `EXPND_SN=406`(병원·공용, "병원은 공용 불가" 규칙 위반): 팀장에게 알리고 백엔드 저장소에서 고침. 서버가 저장을 막아 급하지 않음

### 내 문서 작업(설계서·명세)

- FN-MYP-040-09·13: 가입 제공자 표시를 텍스트 배지에서 SNS 로고 칩으로(SNS 회원 6-3, "카카오 간편 가입" 문구는 유지). 화면설계서 6-3 그림도 맞춘다
- FN-MYP-020-04: "그날 획득 포인트·남은 미션 수(남은 포인트)를 표시"에 "남은 미션 수와 자정 정산 안내는 오늘만, 지난 날짜는 그날 획득만"을 더한다. 화면설계서 SCR-MYP-020 요약·안내도 맞춘다. v0.7은 날짜 구분 없이 남은 미션 수를 표시하게 되어 있어 이번 변경과 다르다
- FN-MYP-010-02·03·07·23·화면설계서 10-1: 카드 그림 규칙을 명세에 쓴다. 안 만든·만드는 중 = 실루엣+"?", 만든 카드 이미지 실패 = 컬러 기본 전신, 오류 확인 중 = 흑백·흐림. 지금 문서는 "종별 기본 캐릭터가 들어간 점선 카드"
- FN-MYP-010-05·화면설계서 REP 용어: 대표는 AI매니저 기준 동물만이다(케어미션 등 기본 선택 아님, 11-18 정정)
- FN-MYP-003-03 털색 "얼룩": 명세엔 있는데 DB v0.14 (8)에서 `USE_YN='N'`이다. 명세·DB 중 어느 쪽으로 맞출지 결정이 필요하다(결정 전까지 코드는 그대로)

### 팀 답 기다림

- 서버 기본 캐릭터 통일은 LJS 515ac29로 develop에 반영됐다. 로컬 백엔드를 develop으로 다시 띄운 뒤 오류 확인 중 카드·홈 얼굴이 도트 그림인지 확인
- 등록-삭제를 반복하면 같은 날 케어미션이 다시 출제될 수 있다(포인트 악용 여지). 막을지 백엔드와 정한다
- SCR-MYP-010 털색을 "흰색"으로 등록했는데 생성 캐릭터가 검은 강아지였다. 서버가 털색을 반영하는지(LJS)
- FN-MYP-010-12 첫 생성 실패 때 [캐릭터 만들기] 재노출과 실패 안내 문구(LJS)
- 서버 상점이 `MYPC0006` 신발 4개를 주는데 프론트 부위는 5개(`MYPC0001~0005`)라 [전체]에만 나오고 부위 이름이 빈칸. 서버 DB가 다른지(LJS)
- 초대 수락 카드(`InvitationAccept`)에서 아직 양육자가 아니라 얼굴이 403이면 기본 아이콘만 보인다. 허용할지(LJS)
- 건강 일지 병원 영수증 저장 때 자동 기록되는 가계부 1건(FN-AIM-009-10)이 `recptSn`으로 연결되는지(JAJ·YAY). 가계부 출처 영수증 다시 열기는 명세에 진입점이 없어 안 했다(필요하면 명세에서 정한다)
- 공용 DB 정리(SCR-MYP-031 검증): 회원 1 지출 `EXPND_SN=10459`(소프트 삭제), 인앱 알림 `INAPP_NOTI_SN=5297`(남김). `NOTI_SNDNG_LOG` 발송 기록, petSn 1011 케어미션(EXPENSE_CREATE) 반영이 생겼을 수 있다. 복구: `DELETE FROM EXPND WHERE EXPND_SN = 10459;`, `DELETE FROM INAPP_NOTI WHERE INAPP_NOTI_SN = 5297;`
- 스타일 결정 합의: 그림자 토큰 `shadow-depth-sm/md/lg`·`ring-focus`·`ring-error`(`OPEN_ISSUES.md`에 제안), `@theme` 토큰·Pretendard CDN·브랜드 색 #285a5c·lucide·가계부 tone·warn 토큰. 합의되면 `docs/OPEN_ISSUES.md` 스타일링 항목 갱신
- 공용 DB 정리(SCR-MYP-005 검증): tester(mbrSn 1)가 보낸 초대 `JNT_BRUP_INVTN_SN` 217~219·221~223·225~236이 남았다(화면에서 취소·삭제해 대부분 `DEL_YN='Y'`, 229는 일부 수락이고 탄이–user0006 연동은 화면에서 해제함). 상태 이력·대상 반려동물·user0006 인앱 알림·미가입 메일 발송 기록(230·234)도 있을 수 있다. 복구: `JNT_BRUP_INVTN_STTS_HSTRY` → `INVTN_TRGT_PET` → `JNT_BRUP_INVTN` 순으로 그 번호를 지운다

### 다른 사람 담당·기다리는 것

- FN-MYP-040-09 `POST /api/members/me/sns-links` 병합 뒤(YAY): 성공 토스트·"연동됨" 전환, 서버 오류 `message`를 화면으로 보고 `useSnsCallback` 오류 처리를 맞춘다
- `CHARACTER_BAKE_ENABLED`(LJS)가 켜지면 LJS와 `/mypage/characters`·홈 얼굴이 착용 모습인지 화면 확인. SCR-MYP-011 상점 미리보기 겹침도 이미지가 나오면 확인
- SCR-MYP-011 기준 문서 `v0.6_20261022`가 DMS에 올라오면 FN-MYP-011-03·04(사람이 준 수치로 만듦)와 대조
- SCR-MYP-005 진입: 알림 드롭다운(SCR-COM-004), 가입 직후 자동 노출(SCR-ACC-001, YAY·AIC), 로그인이 `redirect`를 받는지(AIC)
- 시안 v5의 페이지 배경 `#FDFCFB`·푸터 `#FCF9F7`이 `UserLayout.jsx`·`UserFooter.jsx`(LJS)에 아직 옛 값

### 리팩토링 때 맞출 것(QA 뒤)

- 공용 `components/Modal.jsx`: 가운데 모달에서 배경 오른쪽을 누르면 닫히지 않는다(왼쪽·위·아래는 닫힘, 가계부 [영수증으로 등록]에서 확인). `handleMouseDown`의 스크롤바 예외(`clientX >= rect.left + dialog.clientWidth`면 무시)가 `isTop`이 아닌 모달에도 걸려 모달 오른쪽 끝보다 오른쪽 배경 클릭이 무시된다. 고칠 방향: 스크롤바 예외는 `isTop`일 때만, 보통 모달은 클릭이 dialog 상자 밖일 때만 닫는다
