---
title: 'Learn Python in 10 minutes'
excerpt: 'Learning the basics of python and how it works in less than 10 mins. Python is a great language for web development, data science and scripting.'
coverImage: '/posts/12-awesome-cli-tools/banner.png'
date: '2021-05-16'
author:
  name: Dimitris Kapanidis
  picture: '/images/dkapanidis.jpg'
ogImage:
  url: '/posts/12-awesome-cli-tools/banner.png'
slug: 'learn-python-in-10-mins'
topic: 'coding'
---

Learning the basics of python and how it works in less than 10 mins. Python is a great language for web development, data science and scripting.

## Hello World

Let's just print a simple hello world message:

```python
# hello.py
print('hello world')
```

Type `python hello.py` to execute.

## Primitive Types

Python has four primitive types: int, float, bool, str.

```python
# primitives.py
ten = 10            # int
pi = 3.14159265359  # float
yes = True          # bool
no = False          # bool
name = "John Wick"  # str
print(ten, pi, yes, no, name, len(name))
```

```shellsession
$ python primitives.py
10 3.14159265359 True False John Wick 9
```

## Data Types

Apart from the primitive types python has the following data types:

- Sequence Types: list, tuple, range
- Mapping Types: dict
- Set Types: set, frozenset

```python
fruitsList = ["apple", "banana", "cherry"]
fruitsTuple = ("apple", "banana", "cherry")
fruitsSet = {"apple", "banana", "cherry"}
fruitsFrozenSet = frozenset({"apple", "banana", "cherry"})
x = range(6)
print ("list", fruitsList)
print ("tuple", fruitsTuple)
print ("set", fruitsSet)
print ("frozenSet", fruitsFrozenSet)
print ("range", x)
```

## Operations

```python
add = 3+2
print (add)

subtract = 3-2
print (subtract)

multiply = 3*2
print (multiply)

division = 3/2
print (division)

modulus = 3%2
print (modulus)

lessThan = 3<2
print (lessThan)

greaterThan = 3>2
print(greaterThan)

equals = 3==3
print (equals)

logicalAnd = (2==2) and (3==3) and (4==4)
print (logicalAnd)

logicalOr = (2==1) or (2==2) or (2==3)
print (logicalOr)

logicalNot = not (3==2)
print (logicalNot)
```

## Loops

```python
fruits = ["apple", "banana", "cherry"]
for x in fruits:
  print(x)

# 0,1,2,3,4,5 
for x in range(6):
  print(x)

# 5,6,7,8,9,10
for x in range(5,11):
  print(x)
```

## Decision Making

```python
x = int(input("Enter a number: "))
if x > 0:
    print(x)
else:
    print(-x)
```

## Functions

```python
def printme( str ):
   "This prints a passed string into this function"
   print(str)
   return

printme("hello")
```
