---
layout: default
title: Virtual in Systemverilog
parent: Systemverilog Randoms
grand_parent: My Randoms
description: What virtual keyword means.
tags: [systemverilog]
comments: true
toc_en: true
nav_exclude: false
search_exclude: false
nav_order: 3
---

# Summarize: virtual in Systemverilog
The keyword `virtual` is used in different several ways in Systemverilog, and the annoying things is that the meaning of each usage is totally differents from the others.
Let's just sum it up.
{: .fs-5 .fw-500 }

---
## Virtual methods
Inside a class, a `virtual` method (function or task) will allow overriding the implementation of the method in a derived class.
We must define a method as `virtual` to achieve polymorphism in Systemverilog.

To understand more about polymorphism and what's the different between virtual and non-virtual method, check out this post: 

## Virtual class and pure virtual methods
Virtual class is also known as Abstract class (which you might be familiar with when programming in other languages).
This kind of class can only be inherited, it cannot be instantiated.

Inside a virtual class, we must define methods as `pure virtual`, and as well as the virtual class itself, the virtual method must not contain any body code.
All the class extended from virtual class must implement all the pure virtual method.

Think about it as a template that all the child class must follow.

## Virtual interface
Interface, as defined in Systemverilog LRM, is a "bundle of nets or variables" and it is created to "encapsulate the communication between blocks".

Below is an example of interface, and how it is construct to an interface object.
{% highlight verilog %}
   interface bus_signals;
      logic [7:0] signal_a;
      logic       signal_b;
      logic       signal_c;
   endinterface: bus_signals
   ...
   module top;
     bus_signals bus_xyz(); // instantiate bus_signals interface

     subtopMod subtop(bus_xyz); // create an module instance and connect the interface object bus_xyz.

   endmodule
{% endhighlight %}

Now, to get the handle of that `bus_xyz` interface object, we define a `virtual interface`.
This is similar to construct a class object, then assign the handle of that object to a variable.
{% highlight verilog %}
   virtual bus_signals m_handle;
   ...
   m_handle = bus_xyz;  // m_handle now will point to the bus_xyz interface object
   ...
{% endhighlight %}

## Virtual uvm sequence
If 
