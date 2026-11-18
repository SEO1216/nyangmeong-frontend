# JAJ 핸드오프

## 지금 하는 것

SCR-HLT-011·002·003 건강기록 피드백 반영 — 끝남 (검증 통과·사람 확인 2026-11-18, 추가-1~25. 추가-24·25는 develop 병합 충돌 정리와 UI 통일 2-A 기준 맞춤) (2026-11-18 08:49 시작, 기획 없이 요청으로 받음). 그 전 SCR-HLT-011 AI 리포트 전체 폭 띠(추가-5·6)·SCR-HLT-003 케어리스트 개편(추가-1~21)은 끝

### 추가 요청

| 번호 | 바꿀 파일 | 완료 조건 | 요청 |
| --- | --- | --- | --- |
| 추가-1 | `pages/health/HealthSummaryPage.jsx`, `dashboard/HealthDashboard.jsx`, `dashboard/WidgetTutorialModal.jsx`, 새 `dashboard/SummaryGuideInfo.jsx`, `layouts/SubPageLayout.jsx`·`SubPageHead.jsx`(제목 옆 자리 `titleAddon` 추가만) | 명령: lint·build 0 / 화면: `/health` 제목 「종합 건강기록」 오른쪽 ⓘ, 마우스 올리면·누르면 말풍선(제목·안내 3줄·[튜토리얼 다시 보기]), 말풍선 위에선 유지, Esc·바깥 누르면 닫힘, [튜토리얼 다시 보기] → 튜토리얼 1단계 | 요청 2026-11-18 08:49 "※신규 정책 제목 옆 ⓘ 이용 안내 말풍선 + 튜토리얼 다시 보기" |
| 추가-2 | `pages/health/HealthSummaryPage.jsx`, 새 `dashboard/NoPetDashboard.jsx`, 새 `shared/registerPath.js`(`PetSwitcher.jsx`의 등록 경로 함수를 옮김) | 화면: 0마리면 대시보드 자리에 등록 안내 + [반려동물 등록](`?register=1&returnTo=`), 등록하고 돌아오면 튜토리얼 모달 | 요청 2026-11-18 08:49 "※신규 정책 0마리 빈 화면, 등록 후 돌아오면 튜토리얼" |
| 추가-3 | `dashboard/DashboardCard.jsx`, `dashboard/widgetItems.js`, `pages/health/HealthDiaryPage.jsx` | 화면: 체중·식사량·음수량·산책·배변 상태 카드(빈 카드 포함) [+ 기록하기] → 건강 일지에서 그 항목이 골라진 「오늘 기록하기」 모달 | 요청 2026-11-18 08:49 "※신규 정책 매일 기록 카드 [+ 기록하기]" |
| 추가-4 | `dashboard/DashboardCard.jsx`, `dashboard/widgetItems.js` | 화면: [더보기] 대신 항목별 이름(그래프 보기·검진 기록 보기·처방 보기·관찰 기록 보기·반려동물 정보·캘린더 보기·케어리스트), 가는 곳 그대로 | 요청 2026-11-18 08:49 "[더보기] 이름 바꾸기" |
| 추가-5 | `CareTile.jsx` | 화면: 케어 줄 동그라미 아이콘 없음, 완료는 바탕색, `aria-pressed` 유지 | 요청 2026-11-18 08:49 "케어리스트 줄 동그라미 삭제" |
| 추가-6 | `CareTile.jsx`, `CareList.jsx` | 화면: 반복 예방 연동 [반복 예방 관리 ›]·처방 연동 [처방 보기 ›]가 줄 버튼 밖 따로 된 자리에서 같은 줄에 보임, `ckupRcdSn` 없으면 숨김 | 요청 2026-11-18 08:49 "※신규 정책 연동 항목 이동 버튼" |
| 추가-7 | `UpcomingSchedules.jsx`, `pages/health/CareCalendarPage.jsx`, `docs/tc/TC_건강기록.md` | 화면: 다가오는 케어 일정 줄 → 그 달로 옮기고 그 날짜 선택·날짜 상세에 보임(다른 아이면 공통 카드 바꾸고 토스트), 수정 모달은 날짜 상세에서만 | 요청 2026-11-18 08:49 "※신규 정책 다가오는 일정 → 날짜 상세" |
| 추가-8 | `pages/health/HealthSummaryPage.jsx` | 화면: 종합 건강기록 0마리면 반려동물 카드(사이드 카드·알약)의 등록 안내 상자 없음, 건강 일지·케어 캘린더는 그대로 | 요청 2026-11-18 "종합 건강기록 0마리일 때 반려동물 카드 등록 안내 상자 숨김" |
| 추가-9 | `pages/health/HealthSummaryPage.jsx`, `layouts/SubPageLayout.jsx`·`SubPageHead.jsx`(원래대로), `dashboard/SummaryGuideInfo.jsx` 삭제 | 화면: `/health` 제목 옆 ⓘ·[튜토리얼 다시 보기] 없음, 공용 레이아웃 diff 없음 | 요청 2026-11-18 "이용 안내 ⓘ 되돌리기" |
| 추가-10 | `dashboard/DashboardCard.jsx`, `dashboard/WidgetTile.jsx`, `dashboard/widgetItems.js` | 화면: 매일 기록 5개 카드 [+ 기록하기] 없음, 오른쪽 위 「기록하기 ›」 → 건강 일지 「오늘 기록하기」 모달(그 항목 선택), 640px 미만 요약 타일도 같은 동작 | 요청 2026-11-18 "매일 기록 카드 [그래프 보기 ›] → 기록하기 ›, 휴대폰 타일 포함" |
| 추가-11 | `dashboard/HealthDashboard.jsx`, `dashboard/WidgetTutorialModal.jsx`·`WidgetPicker.jsx` | 화면: 대시보드 제목 줄 ⋮ 없음, 보조 버튼 [대시보드 편집] → 편집 모달, 모달 제목 「대시보드 편집」·새 설명 | 요청 2026-11-18 "※신규 정책 ⋮ 메뉴 → [대시보드 편집]" |
| 추가-12 | `dashboard/WidgetTutorialModal.jsx`, `dashboard/WidgetPicker.jsx`(공용 `Modal.jsx`는 develop 그대로) | 화면: 튜토리얼 2단계·대시보드 편집 1040px 두 칸(왼쪽 안내·추천·칩 4묶음, 오른쪽 sticky 미리보기 2열·AI 리포트 한 줄 전체·아래 안내), 1·3·4단계 720px(단계 넘기면 너비 바로 바뀜), 760px 미만 한 칸 | 요청 2026-11-18 "기록 고르기·대시보드 편집 모달 두 칸" |
| 추가-13 | 새 `shared/HealthGuideModal.jsx` | 화면: 「건강기록 둘러보기」 8장, 왼쪽 목차(지금·지난·남은 장 표시, 누르면 이동), 오른쪽 배지·제목·그림(`assets/health-guide`)·설명·TIP·[이전]·[다음]·[시작해 볼게요], 3장 「대시보드 편집 바로 열기 ›」는 종합 건강기록에서만, 760px 미만 「n / 8」·진행 점·그림 위아래 | 요청 2026-11-18 "※신규 정책 건강기록 둘러보기 모달" |
| 추가-14 | `shared/PetSwitcher.jsx`, `pages/health/HealthSummaryPage.jsx`·`HealthDiaryPage.jsx`·`CareCalendarPage.jsx` | 화면: 1101px 이상 사이드 카드 아래 민트 말풍선(꼬리 위, 두 줄 가운데, [같이 둘러보기]), 1100px 이하 알약 아래 한 줄 「{이름} 기록하는 법 · 같이 둘러보기 ›」, 누르면 둘러보기 1장, 0마리면 없음 | 요청 2026-11-18 "※신규 정책 사이드바 아이 말풍선" |
| 추가-15 | `shared/HealthGuideModal.jsx` | 명령: lint·build 0 / 화면: 둘러보기 8장 사진 칸이 높이 고정 대신 `w-full aspect-[16/10]`(p-3·bg-white 없음, rounded-box·overflow-hidden 유지), 1장 칸은 가운데 `max-w-md`, img `size-full object-contain`, 2장 칸 번호 동그라미 유지, 760px 이하 위아래로 쌓여도 16:10 | 요청 2026-11-18 12:33 "둘러보기 사진 칸을 16:10 비율 고정으로 통일" |
| 추가-16 | `dashboard/WidgetPicker.jsx` | 명령: lint·build 0 / 화면: 대시보드 편집 미리보기에 「기록이 없어요」·「준비 중이에요」 없음, 체중 꺾은선·식사량·음수량·산책 막대 5개·나머지와 AI 리포트 줄 2개(`PREVIEW_SHAPES`, 기본 rows), status·LONG_EMPTY_TEXT·isNew 칩 색 삭제, 진한 테두리·끌기·빈 칸·아래 안내 유지 | 요청 2026-11-18 12:33 "※신규 정책 미리보기 상태 칩 대신 데이터 모양만 표시" |
| 추가-17 | `shared/HealthGuideModal.jsx` | 명령: lint·build 0 / 화면: 둘러보기 8장 모두 「이럴 때」 배지 없음, 3장 TIP 상자 안 오른쪽 「대시보드 편집 바로 열기 ›」(종합 건강기록만, 누르면 둘러보기 닫고 편집 모달), 건강 일지·케어 캘린더 3장은 TIP 상자 없음, 4장 TIP 새 문장, 8장 안내는 footer 왼쪽 회색 글씨(다른 장에는 없음) | 요청 2026-11-18 12:56 "둘러보기 모달 문구·배치 정리(※신규 정책 3장 TIP 문장)" |
| 추가-18 | `dashboard/WidgetCard.jsx`, `diary/DailyTrendCard.jsx`, `diary/TodayRecordCard.jsx`(주석 4줄만) | 명령: lint·build 0, git diff에 세 파일 주석 줄만 바뀜 | 요청 2026-11-18 12:56 "주석 옛 이름([더보기]·기록 항목 편집) 정리" |
| 추가-19 | `dashboard/WidgetPicker.jsx` | 명령: lint·build 0 / 화면: 대시보드 편집·튜토리얼 2단계 761px 이상 5:7 두 칸, 미리보기 카드 3열(AI 리포트 한 줄 전체), 제목 「대시보드 미리보기 · 예시 값」, 아래 문구 「값은 예시예요. …」, 14칸 항목별 고정 예시 값(`PREVIEW_SAMPLES`, 정의 없으면 회색 줄 2개), text-xs 0건, 진한 테두리·끌기 유지, 760px 이하 미리보기 숨김 | 요청 2026-11-18 13:54 "※신규 정책 미리보기 3열·5:7·예시 값" |
| 추가-20 | `shared/HealthGuideModal.jsx` | 명령: lint·build 0 / 화면: 761px 이상 장 내용 세로 가운데(390 그대로), 모든 사진 칸 오른쪽 아래 「크게 보기」(칸 전체 눌러도 같음) → 모달 안 확대 화면(라벨 · 장 제목, [닫기]), [닫기]·바깥 누르면 확대만 닫힘, 포커스 [닫기]로 갔다 「크게 보기」로 돌아옴, 장 넘기면 닫힘 | 요청 2026-11-18 13:54 "※신규 정책 둘러보기 크게 보기·세로 가운데" |
| 추가-21 | `dashboard/WidgetPicker.jsx` | 명령: lint·build 0 / 화면: 대시보드 편집 미리보기 검진기록 「10.20 [정기검진]」·「09.03 [예방접종]」 잘리지 않음, 지속 관찰 둘째 줄 「1mm → 2mm」 | 요청 2026-11-18 14:05 "미리보기 예시 값 말줄임 정리" |
| 추가-22 | `shared/HealthGuideModal.jsx` | 명령: lint·build 0, 두 파일 text-xs 0건 / 화면: 둘러보기 목차 번호·사진 칸 번호 text-badge(13px)가 size-6 동그라미 가운데(1~8) | 요청 2026-11-18 14:05 "둘러보기 번호 글자 13px" |
| 추가-23 | `shared/PetSwitcher.jsx` | 명령: lint·build 0 / 화면: 1440에서 둘러보기 연 채 390으로 줄여도(390→1440도) 모달이 보이고 [이전]·[다음]·[닫기] 눌림, 닫으면 페이지 정상 클릭, 3장 「대시보드 편집 바로 열기 ›」로 편집 열림, 크게 보기·Esc 그대로, 건강 일지·케어 캘린더도 같음 | 요청 2026-11-18 14:30 "둘러보기 모달을 document.body에 portal로 그려 너비가 바뀌어도 보이게" |
| 추가-24 | develop 병합 충돌 7개(`CareTile.jsx`, `dashboard/HealthDashboard.jsx`·`WidgetPicker.jsx`·`WidgetTile.jsx`, `shared/PetSwitcher.jsx`, `pages/health/CareCalendarPage.jsx`·`HealthSummaryPage.jsx`)와 JAJ 새 코드의 화면 폭 표기(760·1100 짝) | 명령: 충돌 표시 0건, lint·build 0 / 화면: 1440·760·390 `/health` 대시보드·대시보드 편집·말풍선·둘러보기, `/health/calendar` 케어리스트 줄이 JAJ 기능 그대로 + develop 크기·색·버튼 | 요청 2026-11-18 "develop 병합 충돌 정리(기능 JAJ, 크기·색·버튼·폭 기준 develop), 병합 커밋 안 함" |
| 추가-25 | `git diff origin/develop`의 `features/health`·`pages/health` 19개 파일 중 JAJ가 바꾼 줄 | 명령: lint·build 0, JAJ가 바꾼 줄에 직접 HEX·단계 밖 글자·761/1101/640/sm 표기·4px 단위 아닌 간격·손으로 만든 버튼·`h-8!` 덮어쓰기·손으로 만든 칩 0건(같은 값 토큰 없는 대괄호 값은 목록으로 보고) / 화면: 기능·문구·동작 그대로 | 요청 2026-11-18 "병합 뒤 JAJ 코드를 UI 통일 2-A H1~H8 기준으로 점검·정리" |

- 결과(2026-11-18): lint·build 0. 화면 확인(Playwright, 로그인 회원): 1440 ⓘ 마우스 올림·[튜토리얼 다시 보기] → 1단계, 2단계 처음 체크 = 저장된 6개, Esc로 닫으면 카드 그대로 / 체중 [+ 기록하기] → `/health/diary#hlt002-graph` 「오늘 기록하기」 체중 선택, history state에 isRecordOpen 안 남음 / 케어 줄 동그라미 없음, 반복 예방 연동 2줄 [반복 예방 관리 ›] `?tab=prevention` 같은 줄 / 다가오는 일정 다른 아이(봄이) 줄 → 모달 없이 11.20 선택·토스트·공통 카드 봄이 / 640·390 가로 스크롤 없음, 390 말풍선 16~347px, 바깥 누르면 닫힘 / 0마리(`/pets` 빈 응답 route) 빈 화면·등록 링크 `returnTo=/health?tutorial=1` / `/health?tutorial=1&petSn=20` → 튜토리얼 열림, 주소 `/health`로 정리 / 추가-8: 0마리 `/health` 1440·390 반려동물 카드 등록 안내 상자 없음, `/health/diary`는 그대로 있음
- 결과 추가-9~14(2026-11-18): lint·build 0. 화면 확인(Playwright): 1440 제목 옆 ⓘ 없음, 공용 레이아웃 diff 없음 / 체중 「기록하기 ›」·390 체중 타일 → `/health/diary#hlt002-graph` 「오늘 기록하기」 체중 선택 / ⋮ 없음, [대시보드 편집] → 「대시보드 편집」 1040px 두 칸(1100 두 칸, 640 한 칸·미리보기 없음) / `?tutorial=1` 1단계 720 → 2단계 1040 → 3단계 720, Esc 저장 없이 닫힘 / 사이드 말풍선 [같이 둘러보기] → 둘러보기 1장, 목차 이동, 3장 「대시보드 편집 바로 열기 ›」 → 편집 모달 / 1100·640·390 알약 아래 한 줄(세 화면), 가로 스크롤 없음, 390 「2 / 8」·진행 점·그림 위아래 / 0마리 말풍선 없음(`/health`·`/health/diary`·`/health/calendar`)
- 확인 못 함: 처방 연동 [처방 보기 ›](처방 연동 케어 항목 있는 아이 없음, 코드로만), 다른 달 일정으로 달 이동(다가오는 3건이 모두 이번 달), 실제 등록 뒤 돌아오기·터치 기기

## 다음에 할 것

- 없음. 연결 남음 없음
