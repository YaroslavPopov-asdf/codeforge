## Функции

```c
int add(int a, int b) {
    return a + b;
}

int main() {
    int sum = add(5, 3);
    printf("Сумма: %d\n", sum);
    return 0;
}
```

## Указатели

Указатели хранят адреса памяти. Это одна из ключевых особенностей C.

```c
int x = 42;
int *ptr = &x;  // ptr хранит адрес x
printf("%d\n", *ptr);  // разыменование — получим 42
```

## Массивы

```c
int numbers[5] = {1, 2, 3, 4, 5};
printf("%d\n", numbers[0]);  // первый элемент
```
