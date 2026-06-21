# Перечисления в Rust

## Определение

```rust
enum Direction {
    Up,
    Down,
    Left,
    Right,
}
```

## enum с данными

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value(c: Coin) -> u8 {
    match c {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

## Option и Result

```rust
// Option — есть значение или нет
enum Option<T> {
    Some(T),
    None,
}

// Result — успех или ошибка
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```
