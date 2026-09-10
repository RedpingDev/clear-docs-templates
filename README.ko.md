<a id="readme-top"></a>

[English](README.md) · **한국어**

# 핵심이 먼저 보이는 Docs

여러 프로젝트에 복사해서 쓰는 한국어 Markdown 문서 템플릿입니다.

짧은 요약, 명확한 구역 구분, 수정 가능한 도식으로 핵심부터 파악하도록 돕습니다. 템플릿·가이드·예시는 한국어로 작성되어 있으며, 한국어와 영어 피드백을 모두 환영합니다.

**[사용 안내](docs/usage.md)** · **[완성 예시](examples/concept.md)** · **[Codex 전역 적용](docs/codex-setup.md)** · **[피드백 보내기](https://github.com/RedpingDev/clear-docs-templates/issues/new/choose)**

<details>
<summary>Table of Contents</summary>

- [About The Project](#about-the-project)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

</details>

## About The Project

문서를 처음 읽거나 오랜만에 다시 열었을 때, 목적과 핵심을 먼저 파악하도록 돕는 양식입니다. 개념·구조·참조 문서의 읽는 순서를 구분하고, 짧은 요약과 가로 구분선, 설명용 이미지로 일관된 구성을 제공합니다.

GitHub를 주 읽기 환경으로, Zed Editor를 보조 환경으로 설계했습니다. 실제 검증 범위는 [검증 기록](docs/verification.md)에 남깁니다.

### Built With

문서는 Markdown과 PNG만으로 읽을 수 있습니다. 도식 원본은 Mermaid이며, 선택적인 제작·검증 도구는 Node.js를 사용합니다.

## Getting Started

### Prerequisites

문서를 읽고 복사할 때는 GitHub 또는 Markdown 편집기만 있으면 됩니다. PNG를 다시 만들거나 검증 도구를 실행할 때만 Node.js 22 이상과 Chromium이 필요합니다.

### Installation

먼저 저장소를 복제하거나 GitHub의 **Code → Download ZIP**으로 내려받습니다.

```bash
git clone https://github.com/RedpingDev/clear-docs-templates.git
cd clear-docs-templates
```

1. 필요한 [템플릿](docs/usage.md#양식-선택)을 프로젝트의 Docs 폴더로 복사합니다.
2. 구조 템플릿은 함께 제공된 `assets` 폴더도 복사합니다.
3. 자리표시자와 그림을 프로젝트 자료로 바꾸고 상대 링크를 확인합니다.

도구 설치와 이미지 재생성 명령은 [이미지 갱신](docs/usage.md#이미지-갱신)을 참고하세요.

이 PC의 여러 Codex 프로젝트에서 기본 양식으로 사용하려면 [전역 적용 안내](docs/codex-setup.md)를 따릅니다. 수동으로 문서를 작성하거나 다른 도구를 사용할 때도 템플릿을 그대로 복사할 수 있습니다.

## Usage

| 만들 문서 | 빈 템플릿 | 완성 예시 |
| --- | --- | --- |
| 개념과 원리 설명 | [개념](templates/concept.md) | [백업과 동기화의 차이](examples/concept.md) |
| 구성요소와 처리 흐름 | [구조](templates/architecture.md) | [백업 도구의 구조](examples/architecture.md) |
| 설정값과 명령어 조회 | [참조](templates/reference.md) | [백업 도구 설정 참조](examples/reference.md) |

AI로 초안을 만들려면 [AI 작성 지침](docs/ai-writing-guide.md)의 요청문에 프로젝트 자료를 붙입니다. 사람이 검토한 뒤 문서와 이미지 원본을 함께 저장합니다.

## Roadmap

첫 버전은 개념·구조·참조에 집중합니다. 추가 양식과 개선 방향은 [Issues](https://github.com/RedpingDev/clear-docs-templates/issues)에서 논의하고, 반영된 변경은 [변경 기록](CHANGELOG.md)에 남깁니다.

## Contributing

[기여 안내](CONTRIBUTING.md)에 따라 문제를 제보하거나 개선 PR을 보내주세요. [스타일 가이드](docs/style-guide.md)를 기준으로 빈 템플릿과 완성 예시를 함께 확인하며, 도식 변경은 PNG에도 반영합니다.

## License

[MIT License](LICENSE)로 공개합니다. Copyright (c) 2026 RedpingDev. 의존성과 참고 자료의 라이선스는 각각의 원본을 따릅니다.

## Contact

[GitHub Issues](https://github.com/RedpingDev/clear-docs-templates/issues/new/choose)에서 표시·도구 문제, 양식 개선 제안, 사용 질문을 받습니다. 한국어와 영어 모두 가능합니다.

Project: [RedpingDev/clear-docs-templates](https://github.com/RedpingDev/clear-docs-templates)

## Acknowledgments

- [Best-README-Template](https://github.com/othneildrew/Best-README-Template): 이 README의 섹션 구성 기준.
- [The Good Docs Project](https://www.thegooddocsproject.dev/template): 목적별 문서 분류의 참고 자료. Docs 본문과 예시는 이 묶음에 맞춰 새로 작성했습니다.
- [Mermaid](https://mermaid.js.org/): 수정 가능한 도식 원본.

[맨 위로](#readme-top)
