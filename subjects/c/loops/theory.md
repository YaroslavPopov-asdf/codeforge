# Циклы в C

## Цикл for

```c
for (int i = 0; i < 10; i++) {
    printf("%d ", i);
}
```

Три части: инициализация; условие продолжения; шаг.

## Цикл while

```c
int i = 0;
while (i < 10) {
    printf("%d ", i);
    i++;
}
```

## Цикл do-while

Выполняется хотя бы один раз:

```c
int i = 0;
do {
    printf("%d ", i);
    i++;
} while (i < 10);
```
