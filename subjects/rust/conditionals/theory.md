# Условные операторы в Rust

## if-else

```rust
if x > 0 {
    println!("Positive");
} else if x < 0 {
    println!("Negative");
} else {
    println!("Zero");
}
```

## if как выражение

```rust
let result = if x % 2 == 0 { "even" } else { "odd" };
```
