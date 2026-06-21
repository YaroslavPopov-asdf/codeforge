# Шаблоны и STL

## Шаблоны (Templates)

Позволяют писать обобщённый код для разных типов:

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

## STL Контейнеры

### vector — динамический массив

```cpp
#include <vector>
#include <algorithm>

std::vector<int> vec = {3, 1, 4, 1, 5};
vec.push_back(9);          // добавить в конец
std::sort(vec.begin(), vec.end());  // сортировка
```

### map — ассоциативный массив

```cpp
#include <map>

std::map<std::string, int> ages;
ages["Alice"] = 30;
ages["Bob"] = 25;
```
