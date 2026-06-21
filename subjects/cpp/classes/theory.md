# Классы в C++

## Определение класса

```cpp
class Rectangle {
private:
    int width, height;

public:
    Rectangle(int w, int h) {
        width = w;
        height = h;
    }

    int area() {
        return width * height;
    }
};
```

## Создание объекта

```cpp
Rectangle rect(5, 3);
cout << rect.area() << endl;  // 15
```

## Конструктор и деструктор

`Конструктор` вызывается при создании объекта, `деструктор` — при его уничтожении.
