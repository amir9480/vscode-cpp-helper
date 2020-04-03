# C++ Helper

![Screen Shot](/images/screenshot.gif)
C++ Helper extension for [vscode](https://code.visualstudio.com/).

## Features
* Generating implementation for c++ declarations.
* Generating header guard for headers.

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
> If you don't want a relative pattern then put a `/` as first character.

### CppHelper.HeaderGuardPattern:
The pattern of header guard.
Example:
```json
"CppHelper.SourcePattern": "{FILE}_H"
```
Where {FILE} is your active header file name in UPPERCASE format.

## Known Issues
If you implement a previously implemented function duplicate implementation will happen.

This extension created using regex and there is no parser/compiler.
so any wrong implementation may happen.
If you found any wrong implementation please let me know in [issues](https://github.com/amir9480/vscode-cpp-helper/issues) and also don't forget to send your code sample.

## Change Log

### 0.0.6
* Bug #4 fixed.

### 0.0.5
* Fix bug in linux. (#1, #2)

### 0.0.4
* Argument with default value implemention bug fixed.
* Class template specialization support added.
* Regex to find previous implemention improved.
* Bug with `operator()` fixed.
* `SourcePattern` configuration bug fixed.

### 0.0.3
* Keeping the order of implementations synced to declarations as much as possible.
