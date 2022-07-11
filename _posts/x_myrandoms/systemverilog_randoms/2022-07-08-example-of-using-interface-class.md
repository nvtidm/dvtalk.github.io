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

* The **interface** in Systemverilog is a group of signals, or methods,
and is used for connecting the signals between the blocks (hardware module and software obj).
* The **interface class** in the other hand, is a very common term in Object Oriented Programming.
It is used to define a set of methods that are used for a specific purpose.
Think of it as a template, when a class implements an interface class, that class must follow this template
and construct all the required methods.

To understand the interface class concept, let's look at an example below,
where interface class is not used at first and
how it helps the issue when coming into use in the later implementation.

---
## A Problem Needed to Be Solved
Let's consider this case:
* We have memory manager component `mem_mgr` in our simulation env.
* This `mem_mgr` will have a function `backdoor_obj_data` to write data to the memory backdoor.
* In the the test we will call this function to write a data from our obj to SoC memory.
* Assuming in current env, we need to support 2 type of data packets: `aes_pkt` and `uart_pkt`.
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

So when designing the `mem_mgr` class, not using interface class, we might implement it as below:
{% highlight verilog %}
class mem_mgr extends uvm_component;
...
   function void backdoor_obj_data(uvm_object m_obj);
      bit[31:0] m_addr;
      bit[31:0] m_data[$];

      aes_pkt  m_aes_obj;
      uart_pkt m_uart_obj;

      if($cast(m_aes_obj, m_obj)) begin
         m_addr = m_aes_obj.m_addr;
         m_data = m_aes_obj.m_data;
         //...
         //some statements to backdoor data
      end

      if ($cast(m_uart_pkt, m_obj)) begin
         m_addr = m_uart_obj.m_addr;
         m_data = m_uart_obj.m_data;
         //...
         //some statements to backdoor data
      end
   endfunction
...
endclass
{% endhighlight %}

In the above implementation of the `backdoor_obj_data()` function, there are some rules that must be followed:
* Firstly, the input argument of the function `backdoor_obj_data` need to be `uvm_object`.
Since all transaction objects in the uvm env will be extends from this base class.
We cannot let the argument as `backdoor_obj_data(aes_pkt m_obj)` because we also need to run this function with `uart_pkt` obj.
* Secondly, each class `uart_pkt` and `aes_pkt` must have the `m_addr` variable and `m_data` queue.
* Thirdly, we need to cast the `m_obj` from type `uvm_object` to either `uart_pkt` or `aes_pkt`.
Otherwise we will meet an error since `uvm_object` type does not have `m_addr` and `m_data` in it.

This implementation has several issues:
* The `mem_mgr` job is to backdoor data to memory,
it should not need to be aware of which class it supports, which is `aes_pkt` and `uart_pkt`.
* If we need to support more type of data, we must modify the function `backdoor_obj_data()` as we what we do for `aes_pkt` and `uart_pkt`.
* The `aes_pkt` and `uart_pkt` are usually mantained by different programmers working in the same verification environment.
So letting all verification engineers modifying 1 file is not a good idea.
If just one of the programmers does not follow the rules above, such as using different variable name instead of `m_addr`,
the whole simulation environment will be break. And other engineers will not be able to run simulation.
* This implementation makes the `mem_mgr` become very messy later when more and more class type need to be suppported to backdoor to memory.

---
## Using an Interface Class
Now, let's implement the `mem_mgr` using interface class and see how it solves this issue.

### Define a Interface Class
Firstly, we need to define an interface class.
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

Any object wishes to have data backdoored by the memory manager must implement this interface class and create this function.

### Implement an Interface Class
{% highlight verilog %}
class aes_pkt extends uvm_object implements memory_backdoorable;
...
   virtual function get_data_info(output bit[31:0] addr, output bit[31:0] data[$]);
      bit[31:0] addr;
      bit[31:0] data[$];

      addr = 32'hea00_0010;

      data.push_back(32'habab_cdcd);
      data.push_back(32'hffff_0000);
   endfunction
endclass
{% endhighlight %}

### Using Interface Class as Input Arguments
Back to the implementation of `mem_mgr`, now we will use the `memory_backdoorable` as the input argument for `backdoor_obj_data()` function.
{% highlight verilog %}
class mem_mgr extends uvm_component;
...
   function void backdoor_obj_data(memory_backdoorable m_obj);
      bit[31:0] m_addr;
      bit[31:0] m_data[$];

      m_obj.get_data_info(m_addr, m_data);

      // some backdoor statements using m_addr and m_data
   endfunction
...
endclass
{% endhighlight %}

We can clearly see that:
* The `mem_mgr` will not need to know which class type it is getting backdoor data from.
Therefore, no need to casting and checking if the type is supported as another implementation.
* We can also avoid any modification if new type of class is needed to be backdoor by `mem_mgr`.
If new class type needs to be backdoor by `mem_mgr`, it need to implements the `memory_backdoorable`
and create the `get_data_info` function.
* Also, by using the interface class, we can eliminate the implicit coding conventions
such as backdoorable class must have `m_addr` and `m_data` variable. All the requirements are defined explicit
in the interface class. So it is easier for any verification engineer to follow.

If we look at the `test_a` where the `backdoor_obj_data` action is triggered, it's still the same as the requirements,
but the code of `mem_mgr` is much more simplier, and more importantly, the `mem_mgr` is totally independant from the `aes_pkt` and `uart_pkt`.
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

---
## Further reading


