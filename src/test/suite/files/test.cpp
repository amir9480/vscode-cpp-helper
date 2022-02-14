#include "test.h"

Test::Test()
{

}

Test::~Test()
{

}

void Test::func()
{

}

void Test::func2(int a)
{

}

void Test::func3(int a, float b) const
{

}

template<typename T10>
void Test::func4(T10 a)
{

}

template<typename T10, typename T11>
void Test::func4(T10 a, const T11& b)
{

}

std::tuple<int, float> Test::func5(std::function<void(int, float)>&& a)
{

}

void Test::func6(int a)
{

}

void Test::func7(int a)
{

}

void Test::func8(int a)
{

}

void Test::func9(int a)
{

}

void Test::func10(int a, float b)
{

}

Test Test::func11(int row, int column, const Test& parent) const
{

}

Test& Test::operator = (const Test& _other)
{

}

Test::operator float() const
{

}

void TestChild::funcchild(int a)
{

}

void TestFinal::test(int a)
{

}

void TestFinalChild::test(int a)
{

}

template<typename T>
TestTemplate<T>::TestTemplate()
{

}

template<typename T>
TestTemplate<T>::TestTemplate(const TestTemplate<T>& a)
{

}

template<typename T>
TestTemplate<T>::TestTemplate(TestTemplate<T>&& a)
{

}

template<typename T>
TestTemplate<T> TestTemplate<T>::hello()
{

}

namespace TestNamespace
{
    TestNamespace::TestNamespace()
    {

    }

    TestNamespace::~TestNamespace()
    {

    }

    void TestNamespace::hello(const char* str)
    {

    }
}
