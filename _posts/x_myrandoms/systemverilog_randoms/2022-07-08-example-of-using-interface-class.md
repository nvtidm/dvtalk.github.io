---
layout: default
title: Example Usage of Interface Class in Systemverilog
parent: Systemverilog Randoms
grand_parent: My Randoms
description: An example of using interface class
tags: [systemverilog]
comments: true
toc_en: true
nav_exclude: false
search_exclude: false
nav_order: 3
---

# Example Usage of Systemverilog Interface Class
Interface class
{: .fs-5 .fw-500 }

---
## Interface Class vs Interface
The first thing we need to address here is the confusion between **interface** and **interface class** in Systemverilog.
These are two different concepts and serve different purposes.

* The interface in Systemverilog is a group of signals, or methods,
and is used for connecting the signals between the blocks (hardware module and software obj).
* The Interface class in the other hand, is a very common term in Object Oriented Programming.
It is used to define a set of methods that are used for a specific purpose.
When a class implements an interface class, that class must construct all the methods required by that interface.
To understand the interface class concept, please look at an example below.

---
## Using an Interface Class
### A Problem Needed to Be Solved
Let's consider this case:
* We have memory manager component `mem_mgr` in our simulation env.
* This `mem_mgr` will have a function `backdoor_obj_data` to write data to the memory backdoor.
* In the the test we will call this function to write a data from our obj to SoC memory.
{% highlight verilog %}
class test_a extends uvm_test;
...
   mem_mgr m_mem;
   ...
   m_mem.backdoor_obj_data(aes_obj);
   m_mem.backdoor_obj_data(uart_obj);
...
endclass
{% endhighlight %}

So when designing the `mem_mgr` class, not using interface class,
we must define as below:
{% highlight verilog %}
class mem_mgr extends uvm_component;
...
   function void backdoor_obj_data(uvm_object m_obj);
      bit[31:0] m_addr;
      bit[31:0] m_data[$];

   endfunction
...
endclass
{% endhighlight %}



### Define a Interface Class
It's a good practice to use an adjective to name an interface class, and it's also should be named after what it's capable of.

In this example, let's create an `memory_backdoorable` interface class.
Since the object that implements this interface class can be backdoored by our memory manager (backdoorable).

{% highlight verilog %}

interface class memory_backdoorable;
   pure virtual function get_data_info(output bit[31:0] addr, output bit[31:0] data[$]);
endclass
{% endhighlight %}

In this interface, we define a `pure virtual function get_data_info`.
This function will be called by our memory manager to get the data, and its address to backdoor to the SoC memory.

Any object wishes to have data backdoored by the memory manager must implement this interface class and define this function.


### Implement an Interface Class

### Why Interface Class is Needed

---
## Further reading


