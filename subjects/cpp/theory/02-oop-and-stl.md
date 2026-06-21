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
