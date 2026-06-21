# Трейты в Rust

Трейты определяют общее поведение для разных типов.

## Определение трейта

```rust
trait Area {
    fn area(&self) -> f64;
}
```

## Реализация трейта

```rust
struct Circle { radius: f64 }

impl Area for Circle {
    fn area(&self) -> f64 {
        3.14159 * self.radius * self.radius
    }
}
```

## Использование

```rust
fn print_area(shape: &impl Area) {
    println!("{}", shape.area());
}
```
