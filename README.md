## Описание

https://github.com/site-for-design/middle.messenger.praktikum.yandex

В этом спринте я написал тесты для компонента, роутера, стора и httpTransport. Есть такое ощущение что тестов мало. Какие еще тест-кейсы я не проработал?
Добавил пре-коммит используя husky.
У меня падает гит-тест на
Check pre-commit hook installed2/9 ✗ Check pre-commit hook installed
(from function `fatal' in file /tmp/tests-middle-frontend/tests/utils/utils.bash, line 3,
    in test file /tmp/tests-middle-frontend/tests/node_build.bats, line 19)
     `[["$output" =~ (pre-commit$)]] || fatal "$output" # Check pre-commit hook' failed
Избавиться от нее не получается. У одногрупников такая же проблема

## Будущие доработки

Отправка файлов и стикеров в чат, поиск чата, архивацию чатов, рейтинг пользователей, Oauth, ping-pong webSocket.

## Страницы

-   [Login Page](https://yaproject2.netlify.app),
-   [Registration Page](https://yaproject2.netlify.app/registration),
-   [Messenger Page](https://yaproject2.netlify.app/messenger),
-   [Settings Page](https://yaproject2.netlify.app/settings),
-   [404 Page](https://yaproject2.netlify.app/smth),
-   [500 Page](https://yaproject2.netlify.app/error500),

## Установка

-   `npm run start` — запуск сборки и превью.
-   `npm run dev` — запуск проекта в режиме разработки.
-   `npm run build` — запуск сборки.
-   `npm run preview` — запуск просмотра сборки.
