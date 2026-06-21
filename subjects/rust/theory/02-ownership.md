## Владение (Ownership)

Три правила владения:
1. У каждого значения в Rust есть владелец
2. Одновременно может быть только один владелец
3. Когда владелец выходит из области видимости, значение удаляется

```rust
fn main() {
    let s = String::from("hello");
    takes_ownership(s);
    // s больше не доступен
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
}
```

## Заимствование (Borrowing)

```rust
fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);  // заимствование
    println!("{}", len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```
