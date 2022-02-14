#ifndef __TEST_H__
#define __TEST_H__

#include <tuple>
#include <functional>

#define UFUNCTION(TEST)

struct [[nodiscard]] Test
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

    [[nodiscard]]
    void func6(int a);

    [[using CC: opt(1), debug]]
    void func7(int a);

    [[debug]]
    [[nodiscard]]
    void func8(int a);

    /**
     * Function with comment
     */
    void func9(int a = int(10));

    void func10(int a = int(10), float b = float(3.14f)); // Comment about func10

    Test func11(int row, int column, const Test& parent = Test()) const;

    Test& operator = (const Test& _other);

    operator float () const;
};

struct TestChild : public Test
{
    void funcchild(int a);
};

class TestFinal final
{
public:
    void test(int a);
};

class TestFinalChild final : public Test
{
public:
    void test(int a);
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
