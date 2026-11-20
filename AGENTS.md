# AGENTS.md — Codex 등 AI 에이전트 안내

공통 작업 규칙은 [CLAUDE.md](CLAUDE.md)입니다. 먼저 읽고 따르며, 사용자의 명시적 지시를 우선합니다.

- Claude: 지시와 조율, 독립 QC, 작업 기록, 사용자 지시에 따른 커밋·push.
- Codex: 지시된 범위의 구현과 자체 검증. 지시서가 있으면 `docs/handoff/<작업 ID>.md`를 따릅니다.
- Codex는 커밋, push, 브랜치 생성·변경을 하지 않습니다. 변경은 Claude의 QC를 위해 작업 트리에 남깁니다.
- TASKS, NEXT_SESSION, WORK_HISTORY는 원칙적으로 Claude가 QC 결과와 함께 갱신합니다. 사용자가 직접 문서 작성을 지시한 경우 그 지시를 따릅니다.
- 검증하지 못한 항목은 이유와 함께 보고합니다. QC 실패 보고를 받으면 수정하고 연관 확인 항목의 결과도 보고합니다.
