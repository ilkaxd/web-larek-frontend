# Проектная работа "Веб-ларек"

[Макет](https://www.figma.com/file/50YEgxY8IYDYj7UQu7yChb/Веб-ларёк?type=design&node-id=1-503&mode=design&t=scMpu2kscKdTdD0E-0)

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом + класс Presenter
- src/components/models/ - папка с используемыми классами Model
- src/components/views/ - папка с используемыми классами View


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

## Архитектура

Приложение реализовано по MVP архитектуре и состоит из компонентов:

<table>
    <thead>
        <tr>
            <th>№</th>
            <th>Компонент</th>
            <th>Описание</th>
            <th>Базовый класс</th>
            <th>Связанный класс</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>Model</td>
            <td>Модель данных</td>
            <td>Component</td>
            <td>
                <ul>
                    <li>AppData</li>
                    <li>LotItem</li>
                    <li>Order</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>2</td>
            <td>View</td>
            <td>Модель отображения</td>
            <td>Model</td>
            <td>
                <ul>
                    <li>Page</li>
                    <li>Modal</li>
                    <li>Card</li>
                    <li>Basket</li>
                    <li>Form</li>
                    <li>Success</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>3</td>
            <td>Presenter</td>
            <td>Модель связи</td>
            <td>-</td>
            <td>
                Реализуется в файле index.ts
            </td>
        </tr>
    </tbody>
</table>

В приложении используется событийно-ориентированный подход. В качестве инструмента, который обеспечивает данных подход, выступает EventEmitter.

## Базовый код

### 1. Класс `n`

## Ключевые типы данных

```
// Основные типы

// Модели данных
interface ILot {  // Модель лота
    id: string;  // идентификатор лота
    title: string;  // заголовок лота
    description: string;  // описание лота
    image: string;  // путь до картинки лота
    category: ILotCategory;  // используемая категория лота
    price: number;  // цена лота
    isOrdered: boolean;  // признак нахождения в корзине
    placeInBasket(): void;  // добавляем лот в корзину
    removeFromBasket(): void;  // удаляем лот из корзины
}

interface IOrder {  // Модель заказа
    payment: IPaymentType;  // способ оплаты
    address: string;
    email: string;
    phone: string;
    items: ILot[];  // лоты в заказе
    formErrors: IFormErrors;  // массив ошибок у формы
    validateOrder(): void;  // проверяем форму
    clearOrder(): void;  // очищаем форму
    postOrder(): void;  // оформление заказа
}

interface IAppState {  // Модель приложения
    catalog: ILot[];  // доступные лоты
    basket: ILot[];  // лоты в корзине
    order: IOrder;  // заказ
    preview: ILot;  // лот для модального окна
    isLotInBasket(item: ILot): boolean;  // проверка находится ли лот в корзине
    clearBasket(): void;  // очищаем корзину
    getTotalAmount(): number;  // получить стоимость корзины
    getBasketLength(): number;  // получить количество товаров в корзине
}

// Модели отображений


// Все события в ларьке
enum Events {
    // События в Model
    AddLotInBasket: 'lot:changed';  // добавили лот в корзину
    VALIDATE_ORDER: 'formErrors:changed';  // проверили всё форму заказа
    POST_ORDER: 'order:post';  // отправили заказ на сервер
    SET_CATALOG: 'catalog:changed';  // обновили доступные лоты
    SET_PREVIEW: 'preview:changed';  // обновили отображение карточки
    // События во View
    OpenBasket: 'basket:open';  // открыли корзину
    OpenLot: 'card:open';  // открыли модалку карточки
    CloseModal: 'modal:close';  // закрываем модальное окно
    OpenOrder: 'order_payment:open';  // открываем окно формы
}
```

## Размещение в сети

Код проекта доступен по адресу: [https://github.com/ilkaxd/web-larek-frontend](https://github.com/ilkaxd/web-larek-frontend)

Рабочая версия приложения доступна по адресу: тут нужно добавить адрес