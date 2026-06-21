# Введение в Rust

Rust — это современный язык системного программирования, разработанный Mozilla (ныне Rust Foundation). Он обеспечивает безопасность памяти без сборщика мусора.

## Ключевые особенности

- **Безопасность памяти** — система владения (ownership) предотвращает гонки данных и висячие указатели на этапе компиляции
- **Нулевая стоимость абстракций** — высокоуровневые конструкции без накладных расходов
- **Вывод типов** — компилятор часто сам определяет тип переменной
- **Управление памятью без GC** — владение, заимствование, время жизни

## Базовая структура программы

```rust
fn main() {
    println!("Hello, World!");
}
```

- `fn main()` — точка входа
- `println!` — макрос для вывода текста

## Переменные и неизменяемость

По умолчанию переменные в Rust неизменяемы:

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
let name: &str = "Alice";
let is_ready: bool = true;
```

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
