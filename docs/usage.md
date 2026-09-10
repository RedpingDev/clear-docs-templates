# Docs 양식 사용 안내

문서 종류를 고르고 AI 초안을 검토해 프로젝트에 적용하는 방법을 안내합니다.

- **시작:** 질문의 목적에 맞는 빈 템플릿을 선택합니다.
- **작성:** 프로젝트 자료와 AI 작성 지침으로 초안을 만듭니다.
- **완성:** 사실·링크·그림을 확인하고 원본과 함께 저장합니다.

**바로가기:** [양식 선택](#양식-선택) · [파일 준비](#파일-준비) · [초안과 검토](#초안과-검토) · [이미지 갱신](#이미지-갱신) · [표시와 링크 확인](#표시와-링크-확인) · [관련 문서](#관련-문서)

---

## 양식 선택

| 독자의 질문 | 선택할 양식 | 완성 예시 |
| --- | --- | --- |
| 무엇이고 왜 필요한가? | [개념](../templates/concept.md) | [백업과 동기화](../examples/concept.md) |
| 무엇으로 구성되고 어떻게 연결되는가? | [구조](../templates/architecture.md) | [백업 도구 구조](../examples/architecture.md) |
| 설정값·조건·문법이 무엇인가? | [참조](../templates/reference.md) | [설정 참조](../examples/reference.md) |

한 문서가 세 질문을 모두 길게 다루면 종류별로 나누고 서로 연결합니다. README는 프로젝트 소개와 문서 진입점으로 사용합니다.

---

## 파일 준비

1. 필요한 템플릿을 프로젝트의 `docs` 폴더에 복사하고 주제를 드러내는 이름을 붙입니다.
2. 구조 문서는 기본 PNG와 `.mmd`가 있는 템플릿의 `assets` 폴더도 복사합니다.
3. `{{...}}`를 실제 내용으로 교체합니다. 작성 안내는 HTML 주석에 있어 소스에서 읽을 수 있습니다.

다음은 프로젝트에 적용한 뒤의 배치 예시입니다. 이 묶음의 현재 폴더 구조와는 구분하세요.

```text
docs/
  backup-concept.md
  backup-architecture.md
  backup-reference.md
  assets/
    backup-architecture.mmd
    backup-architecture.png
```

파일명은 소문자 영문과 하이픈을 기본으로 합니다. 그림과 원본은 같은 이름으로 두고, Markdown에서는 해당 문서 위치를 기준으로 상대 경로를 적습니다.

---

## 초안과 검토

1. [AI 작성 지침](ai-writing-guide.md)의 요청문과 선택한 템플릿을 AI에 전달합니다.
2. 코드·설정·기존 문서 등 근거 자료를 함께 제공합니다.
3. AI 초안의 `[확인 필요: ...]` 표시를 근거 확인으로 해결합니다. 자료가 없으면 미정이라고 명시하거나 불필요한 주장을 제거합니다.
4. 제목과 요약만 먼저 읽어 문서 목적이 드러나는지 확인한 뒤 본문을 수정합니다.
5. 자리표시자와 작성 안내 주석을 정리하고 링크·그림을 확인합니다.

예시를 바탕으로 초안을 시험하려면 [공통 자료](../examples/source-notes.md)를 입력으로 사용합니다. 완성 예시는 그 자료의 범위를 벗어나지 않는 기준본입니다.

---

## 이미지 갱신

### 준비

문서를 읽는 데 아래 도구는 필요하지 않습니다. 도식을 다시 만들 때만 이 묶음의 최상위 폴더에서 실행합니다.

```powershell
npm ci
npx playwright install chromium
```

Node.js 22 이상이 필요하며, 최초 설치에는 네트워크 연결이 필요합니다. 기존 Chromium을 사용하려면 실행 파일의 실제 경로를 `DOCS_CHROMIUM_PATH` 환경 변수로 지정할 수 있습니다.

### 다시 만들기

1. `.mmd`의 구성요소와 화살표를 수정합니다.
2. 같은 이름의 PNG를 생성합니다.
3. 문서의 대체 텍스트·그림 아래 설명·본문 관계도 함께 갱신합니다.

```powershell
npm run diagrams
```

인자 없이 실행하면 이 묶음의 `templates/assets`와 `examples/assets`에 있는 모든 `.mmd`를 처리합니다. 다른 프로젝트의 원본을 명시할 수도 있습니다.

```powershell
npm run diagrams -- "C:/Projects/my-project/docs/assets/backup-architecture.mmd"
```

입력한 원본 옆의 같은 이름 PNG를 갱신합니다. 기존 PNG는 덮어쓰므로 원본과 PNG를 함께 버전 관리합니다.

공통 색상과 글꼴 설정은 [도식 설정](../tools/mermaid-config.json)에 있습니다. Windows에서는 맑은 고딕을 사용하고, 다른 환경에서는 한국어를 지원하는 글꼴을 준비해야 합니다.

---

## 표시와 링크 확인

```powershell
npm run check
npm run preview
```

`check`는 이 묶음의 상대 링크·앵커·이미지 원본 대응과 주요 형식 규칙을 검사합니다. `preview`는 세 완성 예시의 로컬 HTML과 밝은·어두운 화면 캡처를 `.qa`에 만듭니다.

요약·구분선 같은 Docs 형식은 `docs`, `templates`, `examples`의 설명 문서에만 검사합니다. README·AGENTS·변경 기록과 루트 관리 문서·GitHub 양식은 일반 링크 검사 대상으로 구분합니다. 검사기 수정 후에는 `npm run check:scope`로 이 구분을 확인합니다.

로컬 미리보기는 GitHub Markdown CSS를 사용한 보조 검사입니다. GitHub 실제 화면이나 Zed의 렌더링을 대신 검증한 것으로 보지 않습니다.

GitHub에서는 저장소 내 파일을 열어 이미지와 링크를 확인하고, Zed에서는 Markdown 소스와 사용 중인 미리보기에서 같은 내용을 확인합니다. 실제 화면을 확인하지 못했다면 [검증 기록](verification.md)처럼 미검증으로 남깁니다.

---

## 관련 문서

- [스타일 가이드](style-guide.md): 문장과 시각 구성 규칙.
- [AI 작성 지침](ai-writing-guide.md): 자료 확인부터 초안 점검까지.
- [검증 기록](verification.md): 확인한 범위와 남은 환경 검증.
- [Codex 전역 적용](codex-setup.md): 여러 프로젝트의 작성 기본값으로 연결하는 방법.
