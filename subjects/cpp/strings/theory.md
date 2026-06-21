# Строки в C++

## std::string

```cpp
#include <string>

string s = "hello";
string s2 = " " + "world";  // конкатенация
```

## Методы строк

```cpp
s.length()      // длина
s.size()        // длина (аналог)
s.substr(pos, len)  // подстрока
s.find(sub)     // поиск (возвращает позицию или npos)
s.empty()       // пустая ли строка
```

## Итерация

```cpp
for (char c : s) {
    cout << c << endl;
}
```
