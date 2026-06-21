# Функции в Rust

## Определение

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

Последнее выражение без точки с запятой — это возвращаемое значение.

## Возврат через return

```rust
fn factorial(n: u32) -> u32 {
    if n <= 1 {
        return 1;
    }
    n * factorial(n - 1)
}
```

## Вызов

```rust
fn main() {
    let sum = add(5, 3);
    println!("{}", sum);
}
```
