# Введение в C++

C++ — это язык программирования, созданный Бьёрном Страуструпом в 1985 году как расширение языка C. Он поддерживает объектно-ориентированное, обобщённое и функциональное программирование.

## Основные отличия от C

- **Объектно-ориентированное программирование** — классы, наследование, полиморфизм
- **Стандартная библиотека** — STL (контейнеры, алгоритмы, итераторы)
- **Перегрузка функций и операторов**
- **Шаблоны (templates)**
- **Исключения**
- **Пространства имён**

## Базовая структура программы

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

- `#include <iostream>` — подключает потоки ввода-вывода
- `std::cout` — вывод в консоль
- `std::endl` — перевод строки
- `using namespace std;` — позволяет не писать `std::` (не рекомендуется в больших проектах)

## Переменные и типы данных

```cpp
int age = 25;
double pi = 3.14159;
char letter = 'A';
std::string name = "Alice";
bool isReady = true;
```

## Классы и объекты

```cpp
class Rectangle {
private:
    double width, height;

public:
    Rectangle(double w, double h) : width(w), height(h) {}

    double area() {
        return width * height;
    }
};

int main() {
    Rectangle rect(5.0, 3.0);
    std::cout << rect.area() << std::endl;
    return 0;
}
```

## STL Контейнеры

```cpp
#include <vector>
#include <map>
#include <algorithm>

std::vector<int> vec = {3, 1, 4, 1, 5};
std::sort(vec.begin(), vec.end());

std::map<std::string, int> ages;
ages["Alice"] = 30;
ages["Bob"] = 25;
```

## Шаблоны

```cpp
template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    std::cout << max(3, 7) << std::endl;        // 7
    std::cout << max(3.14, 2.71) << std::endl;   // 3.14
    return 0;
}
```

## Работа с файлами

```cpp
#include <fstream>

std::ofstream file("example.txt");
file << "Hello, file!" << std::endl;
file.close();

std::ifstream in("example.txt");
std::string content;
std::getline(in, content);
```
