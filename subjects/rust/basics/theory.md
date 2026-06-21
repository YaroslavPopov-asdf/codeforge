# Основы Rust

Rust — современный язык системного программирования с безопасной работой с памятью.

## Базовая структура

```rust
fn main() {
    println!("Hello, World!");
}
```

- `fn main()` — точка входа
- `println!` — макрос для вывода текста
- `let` — объявление переменной

## Переменные

По умолчанию неизменяемы:

```rust
let x = 5;        // неизменяемая
let mut y = 10;   // изменяемая
y += 5;
```

## Типы данных

```rust
let age: i32 = 25;
let pi: f64 = 3.14159;
let letter: char = 'A';
let is_ready: bool = true;
```

## Ввод с клавиатуры

```rust
use std::io;

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let n: i32 = input.trim().parse().unwrap();
    println!("{}", n);
}
```
