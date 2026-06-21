# Массивы в C++

## Статические массивы

```cpp
int arr[5] = {1, 2, 3, 4, 5};
int arr[] = {1, 2, 3};  // размер выводится автоматически
```

## Динамические массивы (std::vector)

```cpp
#include <vector>
vector<int> v = {1, 2, 3, 4, 5};
v.push_back(6);  // добавляет элемент
cout << v.size();  // размер
```

## Range-based for

```cpp
for (int x : v) {
    cout << x << " ";
}
```
