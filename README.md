# nodeforces
The only [codeforces](http://codeforces.com/) helper library you'll ever need.

nodeforces is a library written in node that helps you compile and test your codeforces contest problems on the go.

## How it Works
```
$ nodeforces init 765A

$ nodeforces test 765A
```
And that's all you need to create and test your code.

## Features
- Parse problem sample input and output
- Source file generation with required template
- Compile and Execute code
- Test your code against sample input and output (yeah `Mocha!`)
- Support for Java `javac` and C++ `g++` (More on the way!)

## Install
The package can be installed with `node.js` `npm` package manager. If you dont have `nodejs` installed you can download it [here](https://nodejs.org/en/download/)

```
$ npm install -g nodeforces
```

**Note:** The `-g` flag might require `sudo` permissons.

## Usage

The easiest way to get started is typing the below in your favourite shell

```
$ nodeforces --help
```

This outputs some useful information like
```
Usage: nodeforces [command]


Commands:

  version
  init|i [options] [problem_name]  This command initializes a codefile for you to start coding
  test|t [problem_name]            This command (compiles,) runs your code against sample test cases

Options:

  -h, --help     output usage information
  -v, --version  output the version number
```

### Initialize a problem
```
$ nodeforces init 585C -e cpp

File Created at /home/krishna/585C/585C.cpp. Get ready to start coding

```
The above command automatically creats a folder `585C` in your `home` directory and adds the source file `585C.cpp` along with sample input and output files. You can change the directory to store and other options [**(see Advanced Usage)**](#advanced-usage)

See the argument `-e cpp`. That's what tells the module to compile your code using `g++`. For specifying compiler options [**(see Advanced Usage)**](#advanced-usage)

### Test your solution
```
$ nodeforces test 585C -e cpp
```

The above command automatically compiles and tests your code against sample inputs and outputs. The output might look something like

```
$ nodeforces test 585C -e cpp


		Reporting Basic Test Results.
	However there are still pretests and finaltests that we cant see :)

  ***Tests for 585C**
    ✓ Case: 1
    1) Case: 2

  1 passing (16ms)
  1 failing

  1) ***Tests for 585C** Case: 2:

      Uncaught AssertionError: expected [] to deeply equal [ 'Impossible' ]
      + expected - actual

      -[]
      +[
      +  "Impossible"
      +]
```

The output format should be familiar to you if you've used [Mocha](https://mochajs.org/) before. It simply reports all the test results with expected output and your output.


## Advanced Usage (Experimental)
Advanced users, can create a `.cfrc` file in their `home` directory for specifying advanced options. The config should be a `json` file that looks something like

```
{
    "src": {
        "dir": "/path/to/dir/to/store/problems",
        "ext": "file extension (cpp|java)",
        "fileHeaderPath": "/path/to/file/header/to/include/in/your/source"
    },

    "compiler": {
        "options": ["-std=c++11"]
    }
}
```

## Contributing
- Branch off of `develop` into a `feature/your_feature` branch.
- Do a `npm run test` to make sure you're not breaking anything.
- Send a `pr` with a meaningful description to `develop`
