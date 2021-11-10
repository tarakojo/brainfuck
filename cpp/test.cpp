#include<emscripten/bind.h>
using namespace emscripten;

int simple_add(int a, int b) { return a + b; }

EMSCRIPTEN_BINDINGS(my_module) {
    function("simple_add", &simple_add);
}