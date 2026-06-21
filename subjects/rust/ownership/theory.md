# Владение и строки в Rust

## Владение (Ownership)

Три правила:
1. У каждого значения есть владелец
2. Одновременно может быть только один владелец
3. Когда владелец выходит из области видимости, значение удаляется

```rust
let s = String::from("hello");
let t = s;       // s перемещается в t
// println!("{}", s);  // ОШИБКА: s больше не владеет значением
```

## Заимствование (Borrowing)

```rust
fn calculate_length(s: &String) -> usize {
    s.len()  // s — ссылка, не забирает владение
}

let s = String::from("hello");
let len = calculate_length(&s);
println!("{}", len);  // можно использовать s, она не перемещена
```

## Изменяемое заимствование

```rust
let mut s = String::from("hello");
fn add_world(s: &mut String) {
    s.push_str(" world");
}
add_world(&mut s);
```

## Строки

```rust
let s1 = String::from("hello");
let s2 = "world";           // строковый срез (&str)
let s3 = s1 + " " + s2;    // конкатенация

// Итерация по символам
for c in "привет".chars() {
    println!("{}", c);
}
```
