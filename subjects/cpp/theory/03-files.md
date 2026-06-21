## Работа с файлами

```cpp
#include <fstream>

std::ofstream file("example.txt");
file << "Hello, file!" << std::endl;
file.close();

std::ifstream in("example.txt");
std::string content;
std::getline(in, content);
```
