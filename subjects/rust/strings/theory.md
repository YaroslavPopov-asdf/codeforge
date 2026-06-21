# Строки: String и &str

В Rust два строковых типа:

- `String` — изменяемая, владеющая строка
- `&str` — ссылка на строку (строковый срез)

```rust
let s1 = String::from("hello");
let s2: &str = "world";
let s3 = s1 + " " + s2;
```

## Методы

```rust
let s = String::from("hello");
s.len();         // длина в байтах
s.is_empty();    // пустая ли строка
s.contains("el");// содержит ли подстроку
s.chars();       // итератор по символам
```
