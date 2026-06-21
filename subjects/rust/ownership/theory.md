# Владение и заимствование

## Правила владения

1. Каждое значение в Rust имеет одну переменную-владельца
2. Когда владелец выходит из области видимости, значение удаляется

```rust
let s1 = String::from("hello");
let s2 = s1;  // s1 перемещается в s2
// println!("{}", s1);  // ошибка!
```

## Заимствование (references)

```rust
fn len(s: &String) -> usize {
    s.len()
}

let s = String::from("hello");
let l = len(&s);  // заимствование, s остаётся владельцем
```

## Изменяемое заимствование

```rust
let mut s = String::from("hello");
let r = &mut s;
r.push_str(", world");
```
