# Структуры в Rust

## Определение

```rust
struct Rectangle {
    width: u32,
    height: u32,
}
```

## Создание

```rust
let rect = Rectangle {
    width: 10,
    height: 20,
};
```

## Методы

```rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}
```

`&self` — ссылка на экземпляр структуры.
