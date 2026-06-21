# Векторы в Rust

## Создание и добавление

```rust
let mut v: Vec<i32> = Vec::new();
v.push(1);
v.push(2);

let v2 = vec![1, 2, 3, 4, 5];
```

## Доступ к элементам

```rust
let v = vec![10, 20, 30];
println!("{}", v[0]);  // 10
println!("{:?}", v.get(5));  // None

for x in &v {
    println!("{}", x);
}
```
