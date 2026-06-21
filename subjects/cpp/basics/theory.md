# Основы C++

C++ — это язык, созданный как расширение C, добавляющий объектно-ориентированное и обобщённое программирование.

## Базовая структура

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

- `#include <iostream>` — подключает потоки ввода-вывода
- `std::cout` — вывод в консоль
- `std::cin` — ввод с клавиатуры
- `std::endl` — перевод строки

## Переменные и типы

```cpp
int age = 25;
double pi = 3.14159;
char letter = 'A';
std::string name = "Alice";
bool isReady = true;
```

## Ввод и вывод

```cpp
int x;
std::cout << "Введите число: ";
std::cin >> x;
std::cout << "Вы ввели: " << x << std::endl;
```
