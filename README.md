# Проектная работа "Веб-ларек"

[Макет](https://www.figma.com/file/50YEgxY8IYDYj7UQu7yChb/Веб-ларёк?type=design&node-id=1-503&mode=design&t=scMpu2kscKdTdD0E-0)

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

// View
// Страница
basket:open - открываем корзину
// Модальное окно
modal:close - закрываем модальное окно
// Карточка
preview:changed - открываем/закрываем модальное окно

// Model
// Общие параметры
catalog:changed - инициируем список с карточками
