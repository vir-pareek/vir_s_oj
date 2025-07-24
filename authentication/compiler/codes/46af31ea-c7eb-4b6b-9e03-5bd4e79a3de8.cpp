#include <iostream>
#include <string>
#include <algorithm>

int main() {
    std::string s;
    std::cin >> s;
    std::string reversed_s = s;
    std::reverse(reversed_s.begin(), reversed_s.end());
    if (s == reversed_s) {
        // Use std::endl to ensure the output is flushed
        std::cout << "Yes" << std::endl;
    } else {
        // Use std::endl here as well
        std::cout << "No" << std::endl;
    }
    return 0;
}