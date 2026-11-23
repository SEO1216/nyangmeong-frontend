# SJM 핸드오프

## 지금 하는 것

SCR-MYP-020 포인트 관리/케어미션 · 포인트 내역 월 선택 창을 내역이 있는 달로 — 끝 (2026-11-23, 검증 `통과`(3회차), lint·build 0, 사람 확인 완료, 추가-1 포함. 정리 없음)

- 디자인: 없음(Figma 토큰 없음, `html/`에 SCR-MYP-020 파일 없음). 가계부 전체 내역(30-2) `ExpenseHistory`의 ◀ MonthPicker ▶ 모양을 그대로 따른다
- 기준 문서: 기능명세서 v0.5(캐시) FN-MYP-020-02는 "◀▶로 이전달·다음달(미래는 비활성) 이동"만 있고 월 선택 창은 없다. 명세 보완은 "내 문서 작업"에 남긴다
- FN-MYP-020-02 적립·사용 내역
  - 바꿀 파일:
    - `src/components/MonthPicker.jsx`: 선택 prop `emptyNotice`(기본값 "지출이 없는 달은 선택할 수 없어요")를 받아 선택 창 아래 안내에 쓴다. 다른 동작은 그대로. `ExpenseHistory`는 고치지 않는다
    - `src/features/point/api.js`: `getPointMonths` = `GET /point-ledgers/months`, 가계부 `getExpenseMonths`처럼 `yearMonth` 값 배열(`['2026-11', ...]`)로 돌려준다
    - `src/features/point/queries.js`: `pointKeys.months()` = `['points', 'months']`(건강 일지의 `pointKeys.all` 무효화에 함께 걸린다), `usePointMonths`
    - `src/features/point/history/PointHistory.jsx`: ◀▶ 사이 `<b>{formatYm(ym)}</b>`를 `<MonthPicker ym maxYm enabledYms={months ?? []} emptyNotice="포인트 내역이 없는 달은 선택할 수 없어요" onSelect>`로 바꾼다. 선택·◀▶ 모두 기존 `moveYm`과 같이 [더보기] 펼침을 접는다. 연월 목록을 받는 중이거나 실패해도 내역 카드는 그대로 보이고(선택 창의 달만 모두 비활성), ◀▶는 지금처럼 동작, 이번 달에서 ▶ 비활성
  - API: `GET /api/point-ledgers/months`(SJM, 백엔드 #287 머지됨). 로컬 백엔드는 이 커밋이 들어간 develop으로 띄운다
  - 완료 조건:
    - 명령: `yarn -s lint`, `yarn -s build` 종료 코드 0
    - 화면: `/mypage/points`(tester 로그인) 포인트 내역 헤더에 ◀ "yyyy년 M월 ⌄" ▶. 연월을 누르면 선택 창이 열리고 months API가 준 달만 고를 수 있으며(그 밖·이번 달 이후는 비활성, 연도 ◀▶는 가장 오래된 달 연도~올해), 아래 안내가 "포인트 내역이 없는 달은 선택할 수 없어요". 달을 고르면 그 달 내역·적립/사용 합계로 바뀌고 창이 닫힌다. 바깥 클릭·Esc로 변경 없이 닫힌다. ◀▶는 한 달씩 이동, 이번 달에서 ▶ 비활성. 390·760·1100·1440px에서 헤더가 겹치거나 넘치지 않고 선택 창이 화면 밖으로 나가지 않는다(나가면 `PointHistory` 헤더 배치에서 고치고 `MonthPicker` 위치는 바꾸지 않는다)
    - 화면: `/mypage/expenses/all` 전체 내역(30-2) 월 선택 창 안내가 "지출이 없는 달은 선택할 수 없어요" 그대로, 동작 그대로
- 새 의존성: 없음

### 추가 요청

| 추가-1 | `src/features/point/shared/pointFormat.js` | 명령: `yarn -s lint`·`yarn -s build` 0. 화면: 내역이 없는 달에서 적립·사용 합계가 "0P"(부호 없음), 0이 아니면 +·− 그대로. 포인트 요약(`PointSummary`) 이번 달 적립·사용도 0이면 "0"으로 나오는지 확인 | 요청 2026-11-23 "내역 없는 달 합계가 +0P로 보임, formatSignedPoint가 0이면 부호 없이 0P, 다른 사용처도 확인" |

## 다음에 할 것

### 내 코드 작업

- JAJ·LJS 알림: 공용 `components/AnalyzeProgress.jsx`를 새로 만들었다(영수증 분석 게이지, `label` prop). JAJ의 `features/ai/receipt/ReceiptUploadModal.jsx`는 함수·상수를 지우고 import만 바꿨고 화면 동작은 같다. 새 분석 화면에 게이지가 필요하면 이 컴포넌트를 쓴다
- SCR-MYP-002·005 화면 확인: 삭제 때 공동양육자에게 알림이 실제로 갔는지(백엔드 알림 테스트), 초대 → 수락 → 삭제 → 자동 해제 흐름
- (선택) SCR-MYP-030 시드 `db/seed/20261028_seed_data.sql`의 `EXPND_SN=406`(병원·공용, "병원은 공용 불가" 규칙 위반): 팀장에게 알리고 백엔드 저장소에서 고침. 서버가 저장을 막아 급하지 않음

### 내 문서 작업(설계서·명세)

- FN-MYP-020-02·화면설계서 SCR-MYP-020 5번: ◀▶ 사이 연월을 누르면 월 선택 창이 열리고 포인트 내역이 있는 달만 고를 수 있다("포인트 내역이 없는 달은 선택할 수 없어요")를 더한다(가계부 30-2와 같은 방식)
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
