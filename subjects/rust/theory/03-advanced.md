## Структуры

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("{}", rect.area());
}
```

## Перечисления (Enums)

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

let msg = Message::Move { x: 10, y: 20 };
```

## Обработка ошибок

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Деление на ноль"))
    } else {
        Ok(a / b)
    }
}

match divide(10.0, 2.0) {
    Ok(result) => println!("{}", result),
    Err(e) => println!("Ошибка: {}", e),
}
```

## Сопоставление с образцом (Pattern Matching)

```rust
let number = 3;
match number {
    1 => println!("Один"),
    2 | 3 => println!("Два или три"),
    _ => println!("Что-то ещё"),
}
```
