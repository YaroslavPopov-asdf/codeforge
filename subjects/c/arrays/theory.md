# Массивы в C

## Объявление и инициализация

```c
int numbers[5] = {1, 2, 3, 4, 5};
int arr[10];  // неинициализированный массив
```

## Доступ к элементам

```c
numbers[0] = 10;    // первый элемент
int x = numbers[2]; // третий элемент
```

## Проход по массиву

```c
int sum = 0;
for (int i = 0; i < 5; i++) {
    sum += numbers[i];
}
```

## Передача массива в функцию

```c
int sumArray(int arr[], int size) {
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += arr[i];
    }
    return sum;
}
```
