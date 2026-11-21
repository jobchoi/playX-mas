# 작업 지시서 P3-QCFIX — QC 발견 사항(콘텐츠 무관 항목)

- 지시: Claude Code · 구현: Codex · 검증: Claude Code(실제 폰 크기 브라우저 시나리오)
- 브랜치: `feature/P2-adventure` (변경·커밋·push 금지)
- 먼저 읽을 것: AGENTS.md, CLAUDE.md, docs/TASKS.md의 P3-QCFIX, app.js, logic.js, games/*.js, missions.json, style.css, test/

## 요구사항(TASKS P3-QCFIX 중 콘텐츠·행사 조건과 무관한 5개)

1. 기억 게임: 이미 완료한 지점을 다시 열면 짝을 맞춘 카드(그림)를 모두 앞면으로 보여 주고 "완료" 상태가 보이게. 다시 하기 버튼으로 새로 섞어 도전 가능.
2. 암호 게임 아이용(child): 글자 입력 대신 보기 버튼(3~4개 중 고르기). missions.json의 child 미션에 `choices` 배열 추가(정답 포함). 어른용(adult)은 지금처럼 입력 유지. 데이터에 choices가 없으면 입력 방식으로 대체.
3. 기억 게임 난이도: child 3쌍(6장), adult 4쌍(8장) 이상이 되도록 missions.json 데이터 조정(기존 그림 단어 재사용·추가 가능, 성경 본문은 바꾸지 않음).
4. 하단 "리더용 QR 주소 목록"·"처음으로" 링크: 터치 대상 최소 44px. 리더용 링크는 아이 화면에서 눈에 덜 띄게(작은 '리더' 영역으로 분리).
5. "이 기기의 기록 삭제" 버튼: 지점 화면에서 빼고 시작 화면의 리더 영역에만 둠(확인 창 유지).
- 모든 버튼 터치 대상 44px 이상, 375px에서 가로 스크롤 없음.
- 테스트(`node --test`) 추가: 암호 보기 정답/오답, 기억 게임 쌍 수 데이터 검증, 완료 상태 표시 로직(가능한 범위의 순수 함수).
- docs/PLAN.md 또는 ADVENTURE_CONCEPT.md의 해당 설명 갱신.

## 하지 말 것
- 지점 4·5·숨은 별 문제 교체, 말씀 본문 확정(교사 검토 대상), 외부 라이브러리 추가
- 커밋·push·브랜치 변경, docs/TASKS.md·NEXT_SESSION.md·WORK_HISTORY.md 수정

## 보고
1. 수정 파일 2. 요구사항 1~5 충족/미충족/미검증 + 근거 3. 실행한 명령과 결과
