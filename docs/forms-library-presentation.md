---
marp: true
theme: default
size: 16:9
paginate: true
header: 'LambdaCurry Forms Library'
footer: 'Built with ❤️ by Lambda Curry'
style: |
  section {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    color: #ffffff;
    font-size: 18px;
    line-height: 1.6;
  }
  h1, h2, h3 {
    color: #ffffff;
    text-shadow: none;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #f7fafc;
    font-weight: 700;
    padding-bottom: 0 !important;
  }
  h2 {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    margin-top: .5rem !important;
  }
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  p, li {
    font-size: 1.125rem;
    line-height: 1.7;
    margin-bottom: 0.75rem;
  }
  code {
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 4px;
    padding: 4px 8px;
    color: #ffffff;
    font-size: 1rem;
    font-weight: 500;
  }
  pre {
    background: #0d1117;
    border-radius: 8px;
    padding: 24px;
    border: 2px solid #30363d;
    font-size: 1rem;
    line-height: 1.5;
    color: #ffffff;
  }
  pre code {
    background: transparent;
    border: none;
    padding: 0;
    color: #ffffff;
  }
  .columns {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    align-items: start;
  }
  .highlight {
    background: #2d3748;
    border: 2px solid #63b3ed;
    padding: 24px;
    border-radius: 8px;
    margin: 1rem 0;
  }
  .architecture-box {
    background: #2d3748;
    border: 2px solid #68d391;
    padding: 20px;
    border-radius: 8px;
    margin: 1rem 0;
  }
  .success-checkmark {
    color: #68d391;
    font-weight: bold;
  }
  .warning-icon {
    color: #fbd38d;
    font-weight: bold;
  }
  .info-icon {
    color: #63b3ed;
    font-weight: bold;
  }
  ul, ol {
    padding-left: 1.5rem;
  }
  li {
    margin-bottom: 0.5rem;
  }
  strong {
    color: #e2e8f0;
    font-weight: 600;
  }
  em {
    color: #cbd5e0;
    font-style: italic;
  }
  /* High contrast focus indicators */
  button:focus, a:focus {
    outline: 3px solid #63b3ed;
    outline-offset: 2px;
  }
  /* Ensure good contrast for links */
  a {
    color: #63b3ed;
    text-decoration: underline;
  }
  a:hover {
    color: #90cdf4;
  }
  /* Header and footer styling */
  header {
    color: #f7fafc !important;
    font-weight: 600;
    font-size: 1.1rem;
  }
  footer {
    color: #f7fafc !important;
    font-weight: 500;
    font-size: 1rem;
  }
  /* High-Contrast Highlight.js Syntax Theme */
  .hljs {
    color: #ffffff;
    background: transparent;
  }
  .hljs-comment, .hljs-quote {
    color: #9ca3af; /* Gray - comments */
  }
  .hljs-string, .hljs-template-string {
    color: #a7f3d0; /* Green - strings */
  }
  .hljs-keyword, .hljs-selector-tag, .hljs-built_in, .hljs-name {
    color: #c084fc; /* Purple - keywords */
  }
  .hljs-title.function_, .hljs-title.class_, .hljs-function {
    color: #fbbf24; /* Yellow - functions and classes */
  }
  .hljs-attr, .hljs-attribute, .hljs-property {
    color: #60a5fa; /* Blue - attributes/properties */
  }
  .hljs-number, .hljs-literal {
    color: #f87171; /* Red - numbers and literals */
  }
  .hljs-variable, .hljs-params {
    color: #fb7185; /* Pink - variables */
  }
  .hljs-tag {
    color: #34d399; /* Green - HTML/JSX tags */
  }
  .hljs-punctuation, .hljs-operator {
    color: #e5e7eb; /* Light Gray - punctuation */
  }
  .hljs-regexp {
    color: #fde047; /* Bright Yellow - regex */
  }
  .hljs-meta, .hljs-meta-keyword {
    color: #a78bfa; /* Light Purple - meta */
  }
---

# 🚀 **LambdaCurry Forms Library**

## **Modern React Forms with Accessibility & Type Safety**

### Built on the shoulders of giants:
- **Remix Hook Form** for state management
- **Radix UI** for accessible primitives
- **Zod** for schema validation
- **TypeScript** for developer experience

---

# 🎯 What We Built & Why

## The Challenge

- Forms are **difficult to implement correctly**
- Accessibility is often an **afterthought**
- Validation logic is **scattered everywhere** 
- **Poor developer experience** across projects
- **Inconsistent patterns** lead to bugs

---

# 🎯 Our Solution

## **Accessibility-first** design approach
- Built with WCAG 2.1 AA compliance from the ground up
- Screen reader optimization and keyboard navigation

## **Unified validation** strategy throughout
- Client-side and server-side validation harmony
- Consistent error handling patterns

## **Excellent TypeScript** support and intellisense
- Full type safety with intuitive developer experience

---

# 🏗️ Architecture Overview

<div class="architecture-box">

## Dual Layer Architecture

```
remix-hook-form/     ←  Form-aware wrapper components
    ↓ uses
ui/                  ←  Base UI components library
    ↓ uses  
@radix-ui           ←  Accessible primitive components
```

</div>

---

# 🏗️ Key Design Decisions

### **Clear separation of concerns** between UI and form logic
Clean boundaries make the codebase maintainable and testable

### **Radix UI foundation** ensures WCAG 2.1 AA compliance  
Accessibility is built-in, not bolted on

### **Component composition** pattern over rigid configuration
Maximum flexibility with minimal complexity

### **TypeScript-first** development experience
Full type safety and excellent IntelliSense support

---

# 📋 Form Anatomy Deep Dive

```
┌─────────────────────────────────────────────────────────────┐
│                   RemixFormProvider                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                fetcher.Form                         │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │              FormField                      │    │    │
│  │  │  ┌─────────────────────────────────────┐    │    │    │
│  │  │  │            FormItem                 │    │    │    │
│  │  │  │  • Generates unique IDs             │    │    │    │
│  │  │  │  • Provides accessibility context   │    │    │    │
│  │  │  │  • CSS: 'form-item grid gap-2'      │    │    │    │
│  │  │  └─────────────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

# 🎯 Input Wrapper Pattern

## TextField Components

- **FormField**: React Hook Form Controller wrapper
- **FormItem**: Accessibility context provider
- **FormControl**: ARIA attributes handler  
- **FormLabel**: Accessible labels with error states
- **FormDescription**: Help text component
- **FormMessage**: Error message display

---

# 🎯 Smart Features

## Enhanced User Experience

- **Prefix and Suffix** support for enhanced UX
- **Error state** styling with clear visual indicators
- **Focus ring** management for keyboard navigation

## Accessibility & Validation

- **Screen reader** optimization with proper ARIA
- **Validation** integration with real-time feedback
- **Automatic error announcements** for assistive technology

---

# 💻 Developer Experience

<div class="highlight">

## Simple, Intuitive API

```typescript
<TextField 
  name="username" 
  label="Username" 
  description="Enter a unique username"
  prefix="@"
  suffix=".com"
/>
```

</div>

---

# 💻 What You Get For Free

<div class="highlight">

- <span class="success-checkmark">✓</span> **Automatic validation** with Zod schemas
- <span class="success-checkmark">✓</span> **Accessibility** attributes (ARIA, labels, descriptions)  
- <span class="success-checkmark">✓</span> **Error handling** and display
- <span class="success-checkmark">✓</span> **TypeScript** intellisense and type safety
- <span class="success-checkmark">✓</span> **Server-side** validation integration

</div>

---

# 🔧 Form Setup Pattern

```typescript
const methods = useRemixForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: { username: '', email: '' },
  fetcher,
  submitConfig: { action: '/', method: 'post' }
});

return (
  <RemixFormProvider {...methods}>
    <fetcher.Form onSubmit={methods.handleSubmit}>
      <TextField name="username" label="Username" />
      <TextField name="email" label="Email" type="email" />
      <Button type="submit">Submit</Button>
    </fetcher.Form>
  </RemixFormProvider>
);
```

---

# 🛡️ Validation Strategy: Client-Side

<div class="columns">

<div>

## Client-Side with Zod

```typescript
const formSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters'),
  email: z.string()
    .email('Invalid email address'),
});
```

</div>

</div>

---

# 🛡️ Validation Strategy: Server-Side

<div class="columns">

<div>

## Server-Side with Remix

```typescript
export const action = async ({ request }) => {
  const { data, errors } = await getValidatedFormData(
    request, 
    zodResolver(formSchema)
  );
  
  if (errors) return { errors };
  
  // Additional server validation
  if (data.username === 'taken') {
    return {
      errors: {
        username: { message: 'Username taken' }
      }
    };
  }
  
  return { message: 'Success!' };
};
```

</div>

</div>

---

# 🎨 Component Composition System

<div class="highlight">

## Flexible & Customizable

```typescript
<TextField
  name="username"
  label="Username"
  components={{
    FormLabel: CustomLabel,
    FormControl: CustomControl,
    Input: CustomInput
  }}
/>
```

</div>

---

# 🎨 Composition Benefits

<div class="highlight">

### Key Benefits:

- **Override any sub-component** while keeping functionality
- **Maintain accessibility** automatically
- **Consistent API** across all form components  
- **Easy theming** and customization

</div>

---

# 📊 Advanced Features: Data Table Filters

<div class="columns">

<div>

## Linear-Inspired UI

- **Multiple filter types**: text, option, date, number
- **URL state synchronization** for shareable filters
- **Faceted filtering** with result counts
- **Client and server-side** filtering strategies

</div>

<div>

## Usage Example

```typescript
const dtf = createColumnConfigHelper<DataType>();

const columnConfigs = [
  dtf.text().id('title')
    .accessor(row => row.title)
    .displayName('Title').build(),
  dtf.option().id('status')
    .accessor(row => row.status)
    .options(statusOptions).build(),
];
```

</div>

</div>

---

# 🧪 Testing: Storybook

<div class="columns">

<div>

## Storybook Stories

- **Interactive examples** for all components
- **Play functions** for automated testing
- **Real form validation** scenarios
- **Accessibility testing** built-in with axe-core

</div>

</div>

---

# 🧪 Testing: React Router

<div class="columns">

<div>

## React Router Mock

```typescript
withReactRouterStubDecorator({
  routes: [
    {
      path: '/',
      Component: FormExample,
      action: async ({ request }) => 
        handleFormSubmission(request),
    },
  ],
})
```

</div>

</div>

---

# 🎭 React Router Integration

<div class="highlight">

## Seamless Server-Side Rendering

### Key Benefits:

- **Progressive enhancement** - forms work without JavaScript
- **Server-side validation** with client-side UX
- **URL state management** for complex forms
- **Optimistic updates** with fetcher integration

</div>

---

# 🚀 Performance & Architecture

<div class="columns">

<div>

## Smart Architecture

- **Tree-shakeable** components for optimal bundles
- **Lazy loading** support for large forms
- **Minimal runtime** overhead
- **Efficient re-renders** with React Hook Form

</div>

</div>

---

# 🚀 Production Ready

<div class="columns">

<div>

## Production Grade

- **Comprehensive test coverage** with Jest and Testing Library
- **TypeScript strict mode** enabled
- **ESLint and Prettier** configured
- **Automated PR previews** for testing

</div>

</div>

---

# ♿ Accessibility First: The Core

<div class="architecture-box">

## WCAG 2.1 AA Compliance Built-In

### FormItemContext provides:

```typescript
{
  id: string,
  formItemId: string,
  formDescriptionId: string,
  formMessageId: string
}
```

</div>

---

# 📚 Documentation & Developer Experience

<div class="columns">

<div>

## Comprehensive Documentation

- **Storybook** with live interactive examples
- **TypeScript** definitions with IntelliSense support
- **Usage patterns** and best practices guide
- **Migration guides** for existing projects

</div>

<div>

## Developer Tools

- **VS Code** snippets for common patterns
- **ESLint rules** for consistent form patterns
- **Automated testing** utilities and helpers
- **PR preview** deployments for review

</div>

</div>

---

# 🏆 Key Achievements

<div class="highlight">

## <span class="success-checkmark">✓</span> Developer Experience

**Excellent TypeScript support** with full IntelliSense and type safety

**Intuitive APIs** that feel natural to use and reduce cognitive load

**Comprehensive documentation** with interactive examples and migration guides

</div>

---

# 🏆 Accessibility & Performance

<div class="highlight">

## <span class="success-checkmark">✓</span> Accessibility Excellence

**WCAG 2.1 AA compliance** built into every component from day one

**Screen reader optimization** with proper ARIA attributes and announcements

**Full keyboard navigation** support with focus management

</div>

---

# 🏆 Production Ready

<div class="highlight">

## <span class="success-checkmark">✓</span> Performance Optimized

**Built on proven libraries** (React Hook Form, Radix UI) for reliability

**Tree-shakeable architecture** to minimize bundle size impact

**Minimal runtime overhead** with efficient re-rendering strategies

</div>

---

# 🔮 Architecture Benefits

<div class="columns">

<div>

## Scalability

- **Component composition** allows infinite customization
- **Dual-layer architecture** separates concerns cleanly  
- **TypeScript** ensures maintainability at scale

</div>

<div>

## Maintainability

- **Clear patterns** for extending functionality
- **Consistent APIs** across all components
- **Automated testing** prevents regressions

</div>

</div>

---

# 🎯 Real-World Impact: Developer Benefits

<div class="highlight">

## For Development Teams

**50% faster** form development time with pre-built, tested components

**Zero accessibility bugs** in production thanks to built-in WCAG compliance

**Consistent UX** across applications with unified design patterns

**Reduced maintenance** burden with well-documented, stable APIs

</div>

---

# 🎯 Real-World Impact: User Benefits

<div class="highlight">

## For End Users

**Seamless experience** across all devices and screen sizes

**Fully accessible** to users with disabilities and assistive technologies

**Fast, responsive** interactions with optimistic updates and smart validation

**Intuitive forms** that reduce cognitive load and improve completion rates

</div>

---

# 🚀 Future Roadmap

<div class="columns">

<div>

## Short Term Goals

- **More field types** (file upload, rich text editor)
- **Advanced validation** patterns and custom rules
- **Performance optimizations** and bundle size reduction

</div>

<div>

## Long Term Vision

- **Visual form builder** UI for non-developers
- **Analytics integration** for form performance insights
- **Multi-step forms** with state persistence

</div>

</div>

---

# 💡 Key Takeaways: Smart Architecture

<div class="architecture-box">

## <span class="info-icon">🎯</span> Smart Abstractions

**We built on proven libraries** rather than reinventing the wheel

React Hook Form, Radix UI, and Zod provide the solid foundation

**Focus on integration** and developer experience over raw functionality

</div>

---

# 💡 Key Takeaways: Design Philosophy

<div class="architecture-box">

## <span class="info-icon">🔧</span> Flexible Design

**Component composition** allows infinite customization without complexity

**Dual-layer architecture** separates UI concerns from form logic

**Override any component** while maintaining accessibility automatically

</div>

---

# 💡 Key Takeaways: Core Principles

<div class="architecture-box">

## <span class="info-icon">♿</span> Accessibility First

**WCAG compliance is built into the architecture**, not bolted on

Every component designed with assistive technology in mind

**Screen readers and keyboard navigation** work perfectly out of the box

## <span class="info-icon">🚀</span> Developer Experience

**TypeScript and intuitive APIs** make forms a joy to build

Comprehensive IntelliSense support and type safety throughout

</div>

---

# 🙏 Thank You!

<div class="columns">

<div>

## Questions?

### Resources:
- 📚 [Storybook Documentation](https://lambda-curry.github.io/forms/)
- 🐙 [GitHub Repository](https://github.com/lambda-curry/forms)  
- 📦 [NPM Package](https://www.npmjs.com/package/@lambdacurry/forms)

</div>

<div>

## **Built with ❤️ by**
### **Lambda Curry Team**

**Making React forms accessible, type-safe, and delightful to use.**

</div>

</div>

---

<!-- _class: lead -->
<!-- _paginate: false -->

# 🎉 **Demo Time!**

## **Let's see the Forms Library in action**

### **Live Storybook Examples**
**Interactive components, validation, and accessibility features**

<br>

### [https://lambda-curry.github.io/forms](https://lambda-curry.github.io/forms)

