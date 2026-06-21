# CodeForge

Интерактивная платформа для изучения C, C++ и Rust с практическими заданиями и автоматической проверкой кода.

## Архитектура

```
├── src/              # Next.js приложение (Vercel)
├── runner/           # Go сервис для выполнения кода (VPS)
├── subjects/         # Учебные материалы (маркдаун + тесты)
└── data/             # SQLite база (локально)
```

В продакшене используется PostgreSQL вместо SQLite.

## Разработка

```bash
# Войти в dev shell
nix develop

# Установить зависимости
npm install

# Запустить
npm run dev
```

## Добавление нового предмета/задания

Просто создайте файлы в `subjects/`:

```
subjects/c/tasks/new-task/
├── meta.json     # { "title": "...", "difficulty": 1, "order": 4 }
├── task.md       # Описание на русском (маркдаун)
├── template.txt  # Шаблон кода
└── tests.json    # Тест-кейсы
```

Формат `tests.json`:
```json
{
  "type": "io",
  "timeout": 5,
  "cases": [
    {
      "name": "Название теста",
      "stdin": "входные данные",
      "expected_stdout": "ожидаемый вывод\\n",
      "expected_exit_code": 0
    }
  ]
}
```

## Деплой

### Vercel (фронтенд + API)

1. Создайте проект на [vercel.com](https://vercel.com)
2. Подключите репозиторий
3. Установите переменные окружения из `.env.example`
4. Настройте GitHub OAuth приложение (callback: `https://your-domain.vercel.app/api/auth/callback/github`)
5. Укажите `DATABASE_URL` для Vercel Postgres (Neon)
6. Деплой

### Runner (VPS для выполнения кода)

Требуется отдельный VPS с Docker:

```bash
docker build -t codeforge-runner ./runner
docker run -d -p 8080:8080 codeforge-runner
```

Или через docker-compose:

```bash
docker compose up -d runner
```

На VPS должны быть установлены: `gcc`, `g++`, `rustc`.
