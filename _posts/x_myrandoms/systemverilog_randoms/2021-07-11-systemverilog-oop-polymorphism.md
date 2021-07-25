---
layout: default
title: Systemverilog OOP - Polymorphism
parent: Systemverilog Randoms
grand_parent: My Randoms
description: What to know about polymorphism in Systemverilog
tags: [systemverilog]
comments: true
toc_en: true
nav_exclude: false
search_exclude: false
nav_order: 3
---

# What to know about polymorphism in SystemVerilog
Polymorphism is one of very crucial concepts of any OOP languages. Since SystemVerilog is an OOP, it is important for us to understand this.
{: .fs-5 .fw-500 }

---
## Basic knowledge about variable
### Three properties of a variable in Systemverilog
A variable in general has several properties.
However let's just focus on three important things below for this post.

1. Name: The name of the variable.
1. Object that variable points to: The memory which the hold the data of the variable.
1. Type: The data type of the variable. This will define the structure of the variable and how it is stored in the memory.
* Systemverilog is the static typed programming language, which means in the same scope, after the variable is defined, the type cannot be changed, similar to C or Java.
There are several programming languages those have dynamic typed such as Python, JavaScript, ...
* For example: if the type of the variable is a class, then when the compiler read the memory pointed by the variable, it will handle the data based on this type.

### Typecasting and upcasting
* Typecasting is also called type conversion. This is the act of parsing the data in memory in the other way.
It is important to understand that the structure of the data in the memory will not be changed. Instead, the data is only read in a different manner.
* For class-typed variable, upcasting means reading the Child object in the memory and point that object to the Parent class variable.
(a Child object is typecasted to Parent class variable). Remember, as above explanation, the object still has the structure defined by Child class, but read/parsing using the Parent class.

### Which function can be called?
Let's take an example:
* There is `base_sequence` class, which has `base_write()` function.
* `aes_sequence` class is extended from the `base_sequence` and add new function `aes_write()`.
* Now, Parent class is `base_sequence`, Child class is `aes_sequence`, we create a variable as below:
{% highlight verilog %}
  base_sequence m_base_seq;
  aes_sequence  m_aes_seq   = new();  // Construct an object of aes_sequence class (Child class)

  m_base_seq = m_aes_seq;     // Upcasting
                              // m_base_seq and m_aes_seq point to the same obj of aes_sequence (Child class)
  ...

  m_aes_seq.base_write();     // Legal
  m_aes_seq.aes_write();      // Legal

  m_base_seq.base_write();    // Legal
  m_base_seq.aes_write();     // Illegal, compilation error.
  ...
{% endhighlight %}

* After upcasting, we now have the `m_base_seq` points to an object of a child class `aes_sequence`, but has the type of a parent class `base_sequence`.
* The statement `m_base_seq.aes_write()` will generate compilation error. As discussed earlier, the obj will have the data structure of `aes_sequence` Child class 
but will be read and handled using `base_sequence` Parent class, and in the `base_sequence`, there is no `aes_write()` function, that's why compilation error occurs.
* A simple way to remember this is: *The type of the variable will decide which function can be called, and the object that variable points to will decide which data to return.*

### Some cases when upcasting occur
* Passing object as function/task argument.
{% highlight verilog %}
  aes_sequence  m_aes_seq   = new();  // Construct an object of aes_sequence class (Child class)
  ...
  // Upcasting, cast any Child obj to Parent base_sequence variable m_obj
  virtual function void obj_write(base_sequence m_obj);
    m_obj.base_write();
  endfunction
  ...
  obj_write(m_aes_seq); // Upcasting, cast the Child aes_sequence obj to Parent base_sequence variable
{% endhighlight %}
<p></p>
* Adding object to an array/queue of parent class type of that object
{% highlight verilog %}
  base_sequence m_seq[$]; // a queue of handle of base_sequence obj
  aes_sequence  m_aes_seq   = new();  // Construct an object of aes_sequence class (Child class)
  ...

  // Upcasting, adding the Child obj's handle to a queue of Parent class base_sequence
  m_seq.push_back(m_aes_seq);
  ...
{% endhighlight %}


---
## Polymorphism in SystemVerilog
### What does it mean?
Simply speaking, polymorphism means many possible ways. This means that we can achieve different tasks but using the same interface.
Take this example below:
{% highlight verilog %}
  base_sequence m_seq[$]; // a queue of handle of base_sequence obj has base_write() function

  aes_sequence  m_aes_seq   = new();  // Where aes_sequence is extended from base_sequence
  rsa_sequence  m_rsa_seq   = new();  // Where rsa_sequence is extended from base_sequence
  sha_sequence  m_sha_seq   = new();  // Where sha_sequence is extended from base_sequence
  ...
  m_seq.push_back(m_aes_seq);
  m_seq.push_back(m_rsa_seq);
  m_seq.push_back(m_sha_seq);
  ...
  foreach (m_seq[i]) begin
     m_seq[i].base_write();  // using the same line of code, we can call 3 different functions.
                             // the result will depend on the object that m_seq[i] point to.
  end
  ...
{% endhighlight %}
* In above example, using only 1 line of code, we can have up to three ways of execution, based on the object that `m_seq[i]` point to.
This is the most common example of polymorphism.
* Actually, when talking about polymorphism, there are even 3 major classes as below.


### Three major classes of polymorphism
As [wikipedia](https://en.wikipedia.org/wiki/Polymorphism_(computer_science)), polymorphism has three major classes:
1. Ad hoc polymorphism: Function overloading/Operator overloading.
* Function overloading meaning we can define many functions with the same name, but with different arguments.
This is **not supported** in Systemverilog. You may find this very common in other languages such as Java.
1. Parametric polymorphism:
* Simply understand as *Generic Programming*. Systemverilog supports this as *Parameterized classes*.
1. Subtype polymorphism:
* The most well known kind of polymorphism. This whole post including the variable type explanation and the example above are actually to explain this type.
However, in Systemverilog, to achieve polymorphism, we must define methods as `virtual`.

### Virtual vs non-virtual methods

---
## Finding more information
To having more understanding as well as having more example, you can check the IEEE Standard for SystemVerilog, Chapter.8 Classes.


