# nodeforces
[![Build Status](https://travis-ci.org/kp96/nodeforces.svg?branch=master)](https://travis-ci.org/kp96/nodeforces)
[![Build status](https://ci.appveyor.com/api/projects/status/04fcvk04a1stbau0/branch/master?svg=true)](https://ci.appveyor.com/project/kp96/nodeforces)
[![Code Climate](https://codeclimate.com/github/kp96/nodeforces/badges/gpa.svg)](https://codeclimate.com/github/kp96/nodeforces)
[![Code Climate](https://codeclimate.com/github/kp96/nodeforces/badges/coverage.svg)](https://codeclimate.com/github/kp96/nodeforces)

The only [codeforces](http://codeforces.com/) helper library you'll ever need.

nodeforces is a library written in node that helps you compile and test your codeforces contest problems on the go.

## How it Works
```
$ nodeforces init 765A.cpp

$ nodeforces test 765A.cpp
```
And that's all you need to create and test your code.

## Features
- Parse problem sample input and output
- Source file generation with required template
- Compile and Execute code
- Debug lines parser
- Test your code against sample input and output
- Support for Java `javac` and C++ `g++`

## Install
The package can be installed with `node.js` `npm` package manager. If you dont have `nodejs` installed you can download it [here](https://nodejs.org/en/download/)

```
$ npm install -g nodeforces
```

**Note:** The `-g` flag might require `sudo` permisson.

## Usage

The easiest way to get started is typing the below in your favorite shell

```
$ nodeforces --help
```

This outputs some useful information like
```
Usage: nodeforces [command]


Commands:

  version
  init|i [problem_name]  This command initializes a codefile for you to start coding
  test|t [problem_name]  This command (compiles,) runs your code against sample test cases

Options:

  -h, --help     output usage information
  -v, --version  output the version number
```

### Initialize a problem
```
$ nodeforces init 585C.java

File Created at /home/krishna/585C/585C.java. Get ready to start coding

```
The above command automatically creats a folder `585C` in your `home` directory and adds the source file `585C.java` along with sample input and output files. You can change the directory to store and other options [**(see Advanced Usage)**](#advanced-usage)

See the extension `.java`. That's what tells the module to compile your code using `javac`. For specifying compiler options [**(see Advanced Usage)**](#advanced-usage)

**Note**: If you're using `Java` make sure to write your main method inside `Main class` that is not public (something like below)

```
585C.java

class Main {
    public static void main(String[] args) {
        // your code here.
    }
}
```

### Test your solution
```
$ nodeforces test 585C.java
```

The above command automatically compiles and tests your code against sample inputs and outputs. The output might look something like

```
$ nodeforces test 585C.java


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


## Advanced Usage

### Configuration

Advanced users can create a `.cfrc` file in their `home` directory for specifying advanced options. The config should be a `json` file that looks something like

```
{
    "src": {
        "dir": "/path/to/dir/to/store/problems",
        "fileHeaderPath": "/path/to/file/header/to/include/in/your/source"
    },

    "compiler": {
        "options": ["-std=c++11"]
    }
}
```

### Testing with debug flag

When you need to log something to stdout for debugging purpose, all you need to do is test with the `-d` flag. The `-d` flag parses the lines starting with `~` and automatically shows them as the debug log. For instance,


```
    888A.cpp
    if (case == 1)
        printf("~I am debug line\n");
```

Now running the below command produces something like,

```
    $ nodeforces test 888A.cpp -d
```

```
    DEBUG output for Case: 1
    I am a debug line
    ***Tests for 585C**
      ✓ Case: 1
      ✓ Case: 2

    2 passing (16ms)
```

## Contributing
- The project follows [gitflow](http://nvie.com/posts/a-successful-git-branching-model/) branching model.
- Branch off of `develop` into a `feature/your_feature` branch.
- Do a `npm run test` to make sure you're not breaking anything.
- Send a `pull request` to `develop` branch with a meaningful description.
