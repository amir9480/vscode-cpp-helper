# C++ Helper

![Screen Shot](/images/screenshot.gif)
C++ Helper extension for [VSCode](https://code.visualstudio.com/).

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
"CppHelper.HeaderGuardPattern": "{FILE}_H"
```
Where {FILE} is your active header file name in UPPERCASE format.

### CppHelper.ContextCreateImplementation
Show or hide "Create Implementation" in context menu.

### CppHelper.ContextCreateImplementationHere
Show or hide "Create Implementation Here" in context menu.

### CppHelper.ContextCreateHeaderGuard
Show or hide "Create Header Guard" in context menu.

## Known Issues
If you implement a previously implemented function duplicate implementation will happen.

This extension created using regex and there is no parser/compiler.
so any wrong implementation may happen.
If you found any wrong implementation please let me know in [issues](https://github.com/amir9480/vscode-cpp-helper/issues) and also don't forget to send your code sample.

## Change Log

### 0.1.0
* Add `Create Implementation Here` command. (#7)
* Add setting to hide context menu items.

### 0.0.7
* Bug #5 fixed.

### 0.0.6
* Bug #4 fixed.

### 0.0.5
* Fix bug in Linux. (#1, #2)

### 0.0.4
* Argument with default value implementation bug fixed.
* Class template specialization support added.
* Regex to find previous implementation improved.
* Bug with `operator()` fixed.
* `SourcePattern` configuration bug fixed.

### 0.0.3
* Keeping the order of implementations synced to declarations as much as possible.
