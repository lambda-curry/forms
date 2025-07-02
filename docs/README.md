# LambdaCurry Forms Library Documentation

This directory contains documentation and presentations for the LambdaCurry Forms Library.

## 📋 Contents

### Presentations

- **[forms-library-presentation.md](./forms-library-presentation.md)** - Comprehensive Marp presentation showcasing the library architecture, design decisions, and benefits

## 🎤 Viewing the Presentation

The presentation is built using [Marp](https://marp.app/), a markdown-based presentation framework.

### Option 1: VS Code with Marp Extension

1. Install the [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode) extension
2. Open `forms-library-presentation.md` in VS Code
3. Use the preview pane to view the slides
4. Export to PDF, HTML, or PowerPoint as needed

### Option 2: Marp CLI

```bash
# Install Marp CLI
npm install -g @marp-team/marp-cli

# Convert to HTML
marp docs/forms-library-presentation.md --html

# Convert to PDF
marp docs/forms-library-presentation.md --pdf

# Convert to PowerPoint
marp docs/forms-library-presentation.md --pptx

# Serve with live reload
marp docs/forms-library-presentation.md --server
```

### Option 3: Online Marp Editor

1. Copy the content of `forms-library-presentation.md`
2. Paste it into the [Marp online editor](https://web.marp.app/)
3. View and export as needed

## 🎨 Presentation Features

The presentation includes:

- **Custom styling** with gradient backgrounds and professional typography
- **Code syntax highlighting** for TypeScript examples
- **Two-column layouts** for comparing concepts
- **Architecture diagrams** using ASCII art
- **Interactive examples** and real code snippets
- **Comprehensive coverage** of:
  - Library architecture and design decisions
  - Component anatomy and patterns
  - React Router and Remix Hook Form integration
  - Storybook testing strategies
  - Accessibility features
  - Developer experience benefits

## 📚 Additional Resources

- [Main Library Documentation](../README.md)
- [Storybook Documentation](https://lambda-curry.github.io/forms/)
- [Component Patterns](.cursor/rules/form-component-patterns.mdc)

