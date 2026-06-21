# Условные операторы в C++

## if-else if-else

```cpp
if (x > 0) {
    cout << "Positive" << endl;
} else if (x < 0) {
    cout << "Negative" << endl;
} else {
    cout << "Zero" << endl;
}
```

## Тернарный оператор

```cpp
string result = (x % 2 == 0) ? "even" : "odd";
```

## switch

```cpp
switch (day) {
    case 1: cout << "Monday" << endl; break;
    case 2: cout << "Tuesday" << endl; break;
    default: cout << "Unknown" << endl;
}
```
