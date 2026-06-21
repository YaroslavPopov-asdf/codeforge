# Основы Rust

Rust — современный системный язык программирования с фокусом на безопасность и производительность.

## Первая программа

```rust
fn main() {
    println!("Hello, World!");
}
```

## Переменные

```rust
let x = 5;          // неизменяемая
let mut y = 10;     // изменяемая
y += 5;
```

## Вывод

```rust
let name = "Alice";
println!("Hello, {}!", name);
```

## Ввод

```rust
let mut input = String::new();
std::io::stdin().read_line(&mut input).unwrap();
let n: i32 = input.trim().parse().unwrap();
```
