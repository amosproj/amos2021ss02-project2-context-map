# Test design specification

## TL;DR
* Implement all criteria in the user-story issue with a test
    * Except marked as manual test in the issue **TODO**
    * Add an `E2E` postfix to the test
* A testable unit is a piece of software (one/multiple types or functions) that serve a single purpose
* In general all source code must be tested
    * No general instructions for code paths that need to be tested
    * No need for tests for obviously correct code paths, but document reason
    * No need for tests for arguments checks, no reason documentation necessary
    * Decide for a code coverage rate for the contribution with a second dev
    * Favor hot code paths with tests
        * Decisions on hot code paths need to be done with a second dev
        * The decision and the reasons need to be documented in the source code
* Test code needs to follow the same quality standards as productive code
* Follow the test pattern and naming conventions below
* Design productive code in a test-able way
    * Use DDD and software architecture best-practices
    * Built small testable cohesive units
    * Use dependency injection
    * Do not code against implementations
* Do not merge pull request when tests are failing
* We encourage to use TDD 

## Objective
This document describes the reason and the way tests in the [AMOS Project2 Context Map](https://github.com/amosproj/amos-ss2021-project2-context-map) repository are structured and built. It is a starting point to get into writing tests for the repository's productive code, as well as a coordinated way of agreeing on a shared standard that is to be applied to all tests written.

## Test types: Unit tests, integration tests and acceptance tests
Although all tests use the same test runner and frameworks, we separate two types of tests. Unit tests and integration tests are technical tests that are internal to the repository and are there to support the developers to write maintainable code with a high level of quality as well as helping to refactor and adapt code to new situations without breaking existing functionality. Integration tests also make sure that single units do integrate well into the whole structure of product developed. Acceptance tests (also called end-to-end tests) and the test criteria on the other hand are defined when the user-stories are recorded for development. **START TODO** All acceptance criteria listed in a user-story **MUST** be implemented with an automatic test, except the criterion is marked in the user story's issue as manual test. **END TODO** Integration tests **MUST** be marked with the `E2E` postfix.

## Testable unit
A testable unit is a single type or function or a group of types or functions that serve a well defined single purpose. Combinations of units (integration) make up the while code base and are the implementation of the product. In the context of a test, the concrete testable unit is also called subject.

## Source code that needs test coverage
In general all source code that is written and contributed **MUST** be tested if not stated otherwise. The complexity of a unit can only be measured on a case-by-case study. It is very different in each layer of the software so that we do not define general instructions which code paths need to be tested. It is part of the development work, when a testable unit is formed and developed to identify the code paths that need to be tested. The reason which code paths are tested and which not **SHOULD** be given in the source code with a comment.  
When code paths are obvious to be correct and are not in need for a test, a test is not necessary. A special case for this are argument checks in the top of the body (the implementation part) of a method or function. This special cased do not need to be tested nor the reason for the lack of the tests need to be documented.  
An obligatory code coverage rate is not defined for the repository, but developers are urged to decide on a code coverage rate for the code part to be contributed with the help of a second developer.  
When the code clearly contains a single hot code path, this code path should be the target of most of the tests, while other code paths are only in need of coverage of a small number of tests. The decision that a code path is hot, to apply this rule, coordinate with a second developer and document the decision and the reason together with the code path via a source code comment.

## Test code standards
### The test runner
The test runner is responsible for running tests. We use the **TODO** test runner for all code in the repository, for all types of tests.  

**TODO**: Add some short description of how to execute the tests and give a link for further information and instructions.

### Test design
A test tests the behavior of a single unit (for unit tests) or the integrated set of multiple units that interact with each other (for E2E tests). All types of tests **SHOULD** only test a single condition. They are a necessary part of a source code contribution and are therefore part of the living code in the repository. While they are not part of the productive code, all rules and definitions for productive code also applies to test code. In particular, they should be clean, well documented, consistent with the productive code and maintainable.  

For a guide on test best practices have a look at the instructions at: https://github.com/mawrkus/js-unit-testing-guide  

### Test pattern
All tests **MUST** follow a certain pattern described below. It is tolerated to deviate from this pattern, when a valid reason is given with the test as a source code comment. All parts of the pattern **MUST** be marked in the source code with a source code comment.

* **Global setup**  
  Contains code that is equal for all tests in a set of tests
* **Arrange**  
  Arranges the environment of the test and prepares the test subject
* **Act**  
  Executed the functionality to be tested
* **Assert**  
  Checks the test condition. This **Should** be only a single one
* **Global teardown**  
  Disposes of artifacts that were created in the global setup step

```
describe('User', () => {
  beforeEach(() => {
    // Global setup for all tests of the unit or user story
    // Omit if not needed.
  });
  afterEach(() => {
    // Global teardown for all tests of the unit or user story
    // Omit if not needed.
  });
  describe('when calling TryChangeName', () => {
    beforeEach(() => {
      // Global setup for all tests of the function or acceptance criterion
      // Omit if not needed.
    });
    afterEach(() => {
      // Global teardown for all tests of the function or acceptance criterion
      // Omit if not needed.
    });
    it('with wrong password should return false', () => {
        // Arrange
        // Act
        // Assert
    });
    it('with correct password should return true', () => {
        // Arrange
        // Act
        // Assert
    });
  });
});
```

**TODO** Give an example. This is test-runner dependent.

All tests **MUST** follow a common naming convention. Unit and integration tests are separated by the subject that is tested. The subject for unit tests is the unit, the subject for integration tests is the group of units that are to be integrated. This separation is done by placing the test code in dedicated files. For unit and integration tests, all test code **MUST** be located in a file thats name is the name of the unit that is postfixed with `.tests`. For acceptance tests, the file name is the user-story that is tested, postfixed with `.tests.e2e`. For file names the pascal-case naming convention is mandatory. 

Example:  
Unit test code that tests the behavior of a unit named `User` is placed in a file named `User.tests.ts`.  
Acceptance test code for the user-story called `User can change own password` needs to be located in a file called `UserCanChangeOwnPassword.tests.e2e.ts`.

**TODO** The file names are test-runner dependent.

The test methods that contain the test code follow the convention:  
```
describe('[Unit or user story]', () => {
  describe('when [Function or acceptance criterion]', () => {
    it('with [Action or Parameters] should [DesiredResult]', () => {
    });

    // Other tests for the function or acceptance criterion
  });

  // Other tests for the unit or user story
});
```  

Example:
The unit-test function that tests that a users password is not changed, if the wrong current password is specified is implemented with the code 
```
describe('User', () => {
  describe('when calling TryChangeName', () => {
    it('with wrong password should return false', () => {
    });
  });
});
```

The `[Function or acceptance criterion]` component is `calling TryChangeName` as this is the method name of the `User` unit, the `[Action or Parameters]` component is `wrong password` as a description that a wrong argument is specified, the `[DesiredResult]` component is `return false`, because the test condition is that the call to the subjects function return a value of false to indicate failure.

## Productive code design
Productive code **MUST** be designed in a way to be test-able. This section lists some best practices that enable this. Please be aware that this list is not complete and use all practices from Domain-driven design (DDD) and software architecture to ensure test-ability.  

Subdivide the code into small units with a well defined behavior that match domain entities, when possible. Do not built large functions and types that do everything that a user-story needs in a single unit, but factor out everything that does not naturally fit into the unit.  

Use dependency injection with the help of the **[TODO: decide whether we use an IOC container and insert a link to the usage instructions]** inversion-of-control (IOC) container. Do not create the dependencies of your unit yourself.

Do not code against implementations but create an interface (API) with an API specification that the implementation implements instead. This will enable to mock or fake the interface in tests.

## Continuous integration - github actions
When code is contributed, all tests are run with github actions to ensure that the contributed code is doing what is expected and that no existing functionality is broken. Do not merge pull request into the `main` branch, if tests are failing. 

**TODO** Enable this in the repository settings

## Test driven development (TDD)
Test driven development is a way to write tests as a specification of the code to be implemented. It serves additionally as a guideline what code is already running correctly and where additional work is needed. It therefore also prevents over-engineering. In short, with TDD test are written before the productive code, only then the productive code is written until all test pass.
TDD practices are not mandatory to be followed when code is committed but it is highly encouraged.
