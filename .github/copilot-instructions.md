# Copilot / AI agent instructions for BYTEWEBNEST

Краткий обзор и практические указания для бота/агента, чтобы стать продуктивным в этом репозитории.

- **Главная идея**: это статический одностраничный сайт (HTML/CSS/JS) с содержимым модулей, хранящимся в JSON-файлах под `data/`. JS (`js/app.js`) загружает данные через `fetch()` и рендерит страницы модулей, навигацию и прогресс.

- **Ключевые файлы/директории**:
  - `js/app.js` — единственный большой клиентский контроллер приложения (навигация, рендер, локальное хранилище, прогресс, unlock).
  - `data/content.{lang}.json` — основное содержание курсов (tracks, modules, topics, practice, outcomes). Примеры: `data/content.en.json`, `data/content.ru.json`.
  - `data/module-status.{lang}.json` — мета‑статусы треков (поля `showComingSoon`, `availableDate`, `title`, `description`).
  - `partials/{lang}/roadmap.{lang}.html` — HTML для карты курса, подгружается динамически при `#map`.
  - `index.html`, `ru/index.html`, `uk/index.html` — страницы для разных языков. Логика путей зависит от языка.

- **Пути / префиксы**: `js/app.js:getBasePrefix()` возвращает `"./"` для `en` и `"../"` для `ru`/`uk`. При изменении структуры папок обязательно проверять `getAssetPath()` и `getContentPath()`.

- **Запуск локально / отладка**:
  - Контент загружается через `fetch()` — сайт нужно запускать через HTTP (Live Server, `python -m http.server`, или эквивалент). Пример:

```bash
python -m http.server 8000
# затем открыть http://localhost:8000/
```

- Для проверки загрузки JSON используйте вкладку Network и console (сообщения об ошибках формирует `showFallbackError()` и локализованные строки в `js/app.js`).

- **Навигация / маршруты**:
  - Хешы: `#map` — показывает карту; `#module-<id>` — открывает модуль с данным `id`.
  - Чтобы перейти к конкретной теме: `#module-<id>` + внутренняя скролл логика по `id="topic-<n>"`.

- **Добавление/обновление контента (practical examples)**:
  - Добавить новый модуль:
    1. Открыть `data/content.{lang}.json` (каждый язык отдельно).
    2. Добавить объект модуля в `modules` с полями `id`, `hero`, `summary`, `stats`, `topics`, `practice`, `outcomes` (следовать структуре существующих модулей, например `module-1`).
    3. Добавить строку `"module-<n>"` в массив `modules` внутри соответствующего `tracks` (например `starter`).
    4. Положить связанные изображения в `images/` и указывать путь относительно языка (см. `getAssetPath`).

  - Пометка «скоро»: управляется `data/module-status.{lang}.json` — выставьте `tracks[<id>].showComingSoon` и `availableDate`.

- **Политика доступа / unlock**:
  - Свободный модуль и количество открытых тем — в `data/content.{lang}.json` → `access.freeModuleId` и `access.freeTopicsCount`.
  - Код разблокировки: `access.unlockCode`. При тестировании можно установить `localStorage.setItem('bytewebnest_access_unlocked','true')` или заполнить код в модальном окне.

- **Конвенции и важные зависимости**:
  - Идентификаторы модулей и тем должны соответствовать строгим именам: `module-<n>` и `topic-<index>` — от этого зависят `getModuleById()` и прогресс система.
  - Изменение ID элементов в `index.html` (или в partials) ломает выборки в `js/app.js` — избегать спонтанных переименований DOM id.
  - Прогресс хранится в `localStorage` под ключом `bytewebnest_progress_{lang}`; last open — `bytewebnest_last_track_{lang}` / `bytewebnest_last_module_{lang}`.

- **Отладка специфичных ошибок**:
  - Ошибки загрузки JSON показываются локализованными сообщениями (функция `t`) и в консоли. Если видите `checkContentFile` — начать с проверки соответствующего `data/content.{lang}.json`.
  - Проверяйте корректность JSON (валидность синтаксиса, наличие `tracks`/`modules` массивов).

- **Паттерны кода, которые важно учитывать**:
  - Шаблонизация делается через строковые шаблоны в `render*` функциях (менять осторожно — XSS защищён через `escapeHtml`).
  - Lazy-load partials: карта курса загружается только при переходе на `#map` (`fetch(getRoadmapPath())`).
  - IntersectionObserver используется для reveal-анимаций и автозавершения тем (progress). Не удаляйте связанный CSS-класс `.fade-up` и `.is-visible`, иначе поведение изменится.

- **CI / Deploy**:
  - Деплой на GitHub Pages: ветка `main`, как описано в `README.md`.

Если хотите, могу: добавить примеры PR-шаблона, покрывающего изменения в `data/*.json`, или расширить этот файл с чеклистом для добавления модулей. Нужны ли дополнительные детали или примеры?
