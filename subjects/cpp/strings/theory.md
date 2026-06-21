# Работа со строками в C++

В C++ для работы со строками используется класс `std::string`:

```cpp
#include <string>

std::string s1 = "hello";
std::string s2 = " world";
std::string s3 = s1 + s2;  // конкатенация
```

## Основные методы

```cpp
std::string s = "hello";

s.length();    // длина строки (5)
s[0];          // доступ по индексу ('h')
s.at(0);       // безопасный доступ с проверкой
s.push_back('!');  // добавить символ в конец
s.pop_back();  // удалить последний символ
```

## Поиск и замена

```cpp
std::string s = "hello world";
s.find("world");     // поиск подстроки (6)
s.substr(0, 5);      // подстрока ("hello")
s.replace(0, 5, "hi"); // замена ("hi world")
```

## Итерация

```cpp
std::string s = "hello";
for (char c : s) {
    std::cout << c;
}
```
