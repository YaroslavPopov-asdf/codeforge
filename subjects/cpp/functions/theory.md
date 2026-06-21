# Функции в C++

## Определение и вызов

```cpp
int add(int a, int b) {
    return a + b;
}

int main() {
    int sum = add(5, 3);
    cout << sum << endl;
}
```

## Параметры по умолчанию

```cpp
void greet(string name = "world") {
    cout << "Hello, " << name << "!" << endl;
}
```

## Перегрузка функций

C++ позволяет иметь несколько функций с одинаковым именем, но разными параметрами:

```cpp
int max(int a, int b) { return (a > b) ? a : b; }
double max(double a, double b) { return (a > b) ? a : b; }
```
