# C++ Helper

![Screen Shot](/images/screenshot.gif)
C++ Helper commands.

## Features
* Create implementation for c++ function prototypes.
* create header guard for headers.

## Configuration

### CppHelper.SourcePattern:
The array of possible patterns to find the source of a header file.

Example:
```json
"CppHelper.SourcePattern": [
    "{FILE}.cpp",
    "{FILE}.c",
    "{FILE}.inl",
    "/src/{FILE}.cpp"
]
```
Where {FILE} is your active header file name.
> If you don't want a relative pattern then add a `/` as first character.

### CppHelper.HeaderGuardPattern:
The pattern of header guard.
Example:
```json
"CppHelper.SourcePattern": "__{FILE}_H__"
```
Where {FILE} is your active header file name in UPPERCASE format.

## Known Issues
If you implement a previously implemented function then it will implement it again and duplicate implementation will happen.

Also, this extension created using regexes and there is no parser/compiler.
so any wrong implementation may happen.
If you find any wrong implementation please let me know in [issues](https://github.com/amir9480/vscode-cpp-helper/issues) and also don't forget to send your code sample.
