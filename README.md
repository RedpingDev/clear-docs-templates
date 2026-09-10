<a id="readme-top"></a>

**English** · [한국어](README.ko.md)

# Clear Docs Templates

Reusable Korean Markdown templates you can copy into your projects.

Clear Docs Templates helps readers grasp the essentials first through concise summaries, clear sections, and editable diagrams. Templates, guides, and examples are written in Korean; feedback in Korean or English is welcome.

**[User guide](docs/usage.md)** · **[Example](examples/concept.md)** · **[Global Codex setup](docs/codex-setup.md)** · **[Send feedback](https://github.com/RedpingDev/clear-docs-templates/issues/new/choose)**

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

These templates help readers understand a document's purpose and key points, whether they are opening it for the first time or returning later. Concept, architecture, and reference documents each have a distinct reading order, with short summaries, section dividers, and explanatory images.

GitHub is the primary reading environment, with Zed Editor as a secondary option. See the [verification record](docs/verification.md) for completed checks and remaining validation.

### Built With

Reading the documents requires only Markdown and PNG support. Diagrams have editable Mermaid sources, and the optional authoring and validation tools use Node.js.

## Getting Started

### Prerequisites

You only need GitHub or a Markdown editor to read and copy the documents. Node.js 22 or later and Chromium are required only to regenerate PNGs or run the validation tools.

### Installation

Clone the repository or download it using **Code → Download ZIP** on GitHub.

```bash
git clone https://github.com/RedpingDev/clear-docs-templates.git
cd clear-docs-templates
```

1. Copy the appropriate [template](docs/usage.md#양식-선택) into your project's Docs folder.
2. For the architecture template, also copy the accompanying `assets` folder.
3. Replace placeholders and diagrams with information from your project, then check the relative links.

See [updating images](docs/usage.md#이미지-갱신) for tool installation and diagram regeneration commands.

To use these templates as the default across Codex projects on your computer, follow the [global setup guide](docs/codex-setup.md). You can also copy the templates for manual writing or use with other tools.

## Usage

| Document purpose | Blank template | Completed example |
| --- | --- | --- |
| Explain concepts and principles | [Concept](templates/concept.md) | [Backup vs. synchronization](examples/concept.md) |
| Describe components and processing | [Architecture](templates/architecture.md) | [File backup tool architecture](examples/architecture.md) |
| Look up settings and commands | [Reference](templates/reference.md) | [Backup tool configuration](examples/reference.md) |

To draft with AI, add your project material to the reusable prompt in the [AI writing guide](docs/ai-writing-guide.md). Review the draft yourself, then save the document together with its images and editable sources.

## Roadmap

The first version focuses on concept, architecture, and reference documents. Discuss additional templates and improvements in [Issues](https://github.com/RedpingDev/clear-docs-templates/issues); accepted changes are recorded in the [changelog](CHANGELOG.md).

## Contributing

Follow the [contribution guide](CONTRIBUTING.md) to report a problem or submit a pull request. Check both blank templates and completed examples against the [style guide](docs/style-guide.md), and regenerate PNGs whenever diagram sources change.

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 RedpingDev. Dependencies and reference materials retain their respective licenses.

## Contact

Use [GitHub Issues](https://github.com/RedpingDev/clear-docs-templates/issues/new/choose) for display or tooling problems, template suggestions, and usage questions. Feedback in Korean or English is welcome.

Project: [RedpingDev/clear-docs-templates](https://github.com/RedpingDev/clear-docs-templates)

## Acknowledgments

- [Best-README-Template](https://github.com/othneildrew/Best-README-Template): the section structure used for this README.
- [The Good Docs Project](https://www.thegooddocsproject.dev/template): a reference for classifying documents by purpose. The Docs content and examples were written specifically for this collection.
- [Mermaid](https://mermaid.js.org/): editable diagram sources.

[Back to top](#readme-top)
