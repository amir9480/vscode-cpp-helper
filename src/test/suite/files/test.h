#ifndef __TEST_H__
#define __TEST_H__

#include <tuple>
#include <functional>

#define UFUNCTION(TEST)

struct Test
{
    Test();
    ~Test();

    void func();
    void func2(int a);

    UFUNCTION()
    void func3(int a, float b) const;

    template<typename T10>
    void func4(T10 a);
    template<typename T10, typename T11>
    void func4(T10 a, const T11& b);

    std::tuple<int, float> func5(std::function<void(int, float)>&& a);

    Test& operator = (const Test& _other);

    operator float () const;
};

struct TestChild : public Test
{
    void funcchild(int a);
};

template<typename T>
class TestTemplate
{
public:
    TestTemplate();
    TestTemplate(const TestTemplate<T>& a);
    TestTemplate(TestTemplate<T>&& a);

    TestTemplate<T> hello();
};

namespace TestNamespace
{
    class TestNamespace
    {
    public:
        TestNamespace();
        virtual ~TestNamespace();

        void hello(const char* str);
    };
}

#endif // __TEST_H__
