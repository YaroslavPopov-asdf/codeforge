# Циклы в Rust

## loop

```rust
loop {
    println!("бесконечный цикл");
    break;
}
```

## while

```rust
let mut i = 0;
while i < 10 {
    println!("{}", i);
    i += 1;
}
```

## for

```rust
for i in 0..10 {
    println!("{}", i);
}

for i in (1..=10).rev() {
    println!("{}", i);
}
```
