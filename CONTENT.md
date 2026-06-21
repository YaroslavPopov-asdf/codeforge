# Creating Content

All content lives under `subjects/`. The hierarchy is:

```
subjects/
  <language>/                ← a programming language (C, C++, Rust, etc.)
    meta.json                ← language metadata
    <subject>/               ← a topic within that language
      meta.json              ← subject metadata
      theory.md              ← markdown theory for this subject
      tasks/
        <task>/              ← an exercise
          meta.json          ← task metadata
          task.md            ← task description in markdown
          template.txt       ← starter code shown in the editor
          tests.json         ← test cases
```

---

## Adding a Language

Create a directory in `subjects/<language>/` with a `meta.json`:

```json
{
  "title": "Go",
  "description": "Изучите Go — язык для облачных сервисов",
  "icon": "🔵",
  "order": 4
}
```

Fields:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Display name |
| `description` | string | Short description shown on the language list |
| `icon` | string | Emoji or text icon |
| `order` | number | Sort order on the language page |

---

## Adding a Subject

Create `subjects/<language>/<subject>/` with a `meta.json`:

```json
{"title": "Основы Go", "order": 1}
```

Fields:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Display name of the subject |
| `order` | number | Sort order within the language |

Then create `theory.md` — markdown content that teaches this topic. Example:

```markdown
# Основы Go

Go — это компилируемый язык со статической типизацией.

## Базовая структура

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```
```

---

## Adding a Task

Create `subjects/<language>/<subject>/tasks/<task>/` with four files.

### `meta.json`

```json
{
  "title": "Hello, World!",
  "difficulty": 1,
  "order": 1
}
```

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Task name shown in the list |
| `difficulty` | 1–3 | 1 = easy, 2 = medium, 3 = hard |
| `order` | number | Sort order within the subject |

### `task.md`

Markdown description of the task. Keep it concise but clear. Example:

```markdown
# Hello, World!

Напишите программу, которая выводит "Hello, World!" на экран.

## Пример

```
Вывод: Hello, World!
```
```

### `template.txt`

Starter code that appears in the editor. Include boilerplate the student needs and a placeholder comment:

```c
#include <stdio.h>

int main() {
    // Напишите ваш код здесь

    return 0;
}
```

### `tests.json`

Defines the test cases. Format:

```json
{
  "type": "io",
  "timeout": 5,
  "cases": [
    {
      "name": "Приветствие",
      "stdin": "",
      "expected_stdout": "Hello, World!\n",
      "expected_exit_code": 0
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Always `"io"` |
| `timeout` | number | Max seconds per test case |
| `cases` | array | List of test cases |

Each test case:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Test name shown in results |
| `stdin` | string | Input piped to the program's stdin |
| `expected_stdout` | string | Exact expected stdout (include `\n` for newlines!) |
| `expected_exit_code` | number | Expected exit code (usually 0) |

**Important:** `expected_stdout` must match **exactly** including all newlines. Use `\n` for newlines in the JSON string. A trailing newline is required unless the program explicitly omits it.

---

## Full Example: Go Basics → Hello, World!

```
subjects/go/
  meta.json
  basics/
    meta.json
    theory.md
    tasks/
      hello-world/
        meta.json
        task.md
        template.txt
        tests.json
```

**subjects/go/basics/theory.md** — theory content in markdown.

**subjects/go/basics/tasks/hello-world/meta.json:**
```json
{"title": "Hello, World!", "difficulty": 1, "order": 1}
```

**subjects/go/basics/tasks/hello-world/task.md:**
```markdown
# Hello, World!

Напишите программу, которая выводит "Hello, World!" на экран.
```

**subjects/go/basics/tasks/hello-world/template.txt:**
```go
package main

import "fmt"

func main() {
    // Напишите ваш код здесь
}
```

**subjects/go/basics/tasks/hello-world/tests.json:**
```json
{
  "type": "io",
  "timeout": 5,
  "cases": [
    {
      "name": "Приветствие",
      "stdin": "",
      "expected_stdout": "Hello, World!\n",
      "expected_exit_code": 0
    }
  ]
}
```

---

## Notes

- Theory files are plain markdown. Use fenced code blocks with language tags for syntax highlighting.
- Template files have no language tag — they are inserted as-is into a `<textarea>`.
- Language and subject IDs are derived from directory names. Use lowercase with hyphens (e.g., `control-flow`).
- No redeploy needed — adding files to `subjects/` automatically makes them appear on the site.
- Adding a new language also requires adding its compiler to the runner's sandbox image (`runner/sandbox.Dockerfile`).
