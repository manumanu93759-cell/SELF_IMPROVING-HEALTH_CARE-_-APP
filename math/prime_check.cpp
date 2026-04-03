#include <iostream>
#include <cassert>
#include <cmath>

namespace math {

bool is_prime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i * i <= n; i += 6)
        if (n % i == 0 || n % (i + 2) == 0) return false;
    return true;
}

static void test() {
    assert(is_prime(2) == true);
    assert(is_prime(3) == true);
    assert(is_prime(4) == false);
    assert(is_prime(17) == true);
    assert(is_prime(20) == false);
    assert(is_prime(1) == false);
    assert(is_prime(0) == false);
    std::cout << "All tests passed successfully!\n";
}

}  // namespace math

int main() {
    math::test();
    return 0;
}
