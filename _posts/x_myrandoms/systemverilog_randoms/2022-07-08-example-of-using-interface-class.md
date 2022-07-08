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

---
## Using an Interface Class
### A Problem Needed to Be Solved

### Define a Interface Class
It's a good practice to use an adjective to name an interface class, and it's also should be named after what it's capable of.

In this example, let's create an `memory_backdoorable` interface class.
Since the object that implements this interface class can be backdoored by our memory manager (backdoorable).

{% highlight verilog %}

interface class memory_backdoorable;
   pure virtual function get_data_info(output bit[31:0] addr, output bit[31:0] data[$]);
endclass
In this interface, we define a `pure virtual function get_data_info`.
This function will be called by our memory manager to get the data, and its address to backdoor to the SoC memory.

Any object wishes to have data backdoored by the memory manager must implement this interface class and define this function.

{% endhighlight %}

### Implement an Interface Class

### Why Interface Class is Needed

---
## Further reading


