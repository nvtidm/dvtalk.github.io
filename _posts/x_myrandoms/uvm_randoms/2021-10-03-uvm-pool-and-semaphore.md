---
layout: default
title: uvm_pool example with Systemverilog semaphore
parent: UVM Randoms
grand_parent: My Randoms
description: uvm_pool example with Systemverilog semaphore 
comments: true
share: true
tags: [uvm]
nav_order: 1
toc_en: true
---

# uvm_pool example with Systemverilog semaphore
uvm has
This class allow us to block the specific processes until an expected number of processes reach a defined point.
After that, all the pending processes will be resumed at the same time, similar to lifting the barrier.
{: .fs-5 .fw-500 }

---
## uvm_pool and Systemverilog semaphore 101

### What is uvm_pool
Let's take an example below:
{% highlight verilog %}
...
   uvm_barrier m_bar = new();

   // Set the threshold to 2,
   // Means the barrier will be lifted when the number of processes waiting is 2.
   m_bar.set_threshold(2);


{% endhighlight %}


### Systemverilog semaphore
Similar to [ uvm_event ]({{ site.baseurl }}{% link _posts/x_myrandoms/uvm_randoms/2021-09-20-uvm-event.md %}), we has this `uvm_barrier_pool`, which is a `uvm_pool` for `uvm_barrier` object.
And we use it exactly like the `uvm_event_pool`.

{% highlight verilog %}
typedef uvm_object_string_pool #(uvm_barrier) uvm_barrier_pool;
{% endhighlight %}

Let's think of this pool as a global associative array
where the keys are strings of barrier names, and the values are the `uvm_barrier` objects.

Also, `uvm_pool` is a [ singleton class ]({{ site.baseurl }}{% link _posts/x_myrandoms/systemverilog_randoms/2021-09-03-singleton-class-in-systemverilog.md %}),
that explains why it has global access.

`uvm_barrier_pool` support several methods, but the most commonly used is `get_global()`.
* *`get_global(<string key>)`*: Return the uvm barrier object that stored in `uvm_barrier_pool` with `<string key>`.
If no item exist by the given input string, a new `uvm_barrier` object will be created for that key.

So to create/get an `uvm_barrier` object which is shared globally, we just need to call:
{% highlight verilog %}
   // if there is no uvm_barrier stored under name "test_finish_bar",
   // a new uvm_barrier object will be created by the pool
   uvm_barrier m_finish_bar = uvm_barrier_pool::get_global("test_finish_bar");

   m_finish_bar.set_threshold(3);
{% endhighlight %}

---
## Example
### Using uvm_pool with Systemverilog semaphore directly
Firstly, let's remember the `std::semaphore` in Systemverilog is a class.
Therefore so we can construct and passing it's object handle as normal.

To create a pool of Systemverilog semaphore, we just need to call an typedef statement as below:
{% highlight verilog %}
   `typedef 
{% endhighlight %}

Then to 
{% highlight verilog %}
   ...

   ...
{% endhighlight %}


### Creating uvm_semaphore to use with uvm_object_string_pool
We can create our own `uvm_semaphore` class, wrap around the `semaphore` of Systemverilog.
This allow us having more control over the semaphore, also more information when debugging.

Let's create the `uvm_semaphore` class as below. You can get the full class [ uvm_semaphore ]( https://gist.github.com/dvtalk/692f45bba567aaeae98f61f63d867058 )

{% highlight verilog %}
   ...
   virtual status_interface m_sts_if;
   ...

   // Set the threshold to 5, 
   // If there is 5 "wait_for()" statements blocking their processes, the barrier will be lifted
   uvm_barrier_pool::get_global("wait_done_count").set_threshold(5);

   ...
   uvm_event m_done_count_ev = new();

   ...
{% endhighlight %}
* After 5 pulses of `op_done_signal_a`, there will be 5 processes blocked by `wait_for()` statement.
Since the threshold is 5, the barrier will be lifted, all 5 processes will be resumed and execute the next statement, trigger the event `m_done_count_ev`.
* So using `uvm_barrier` and an event, we can detect when the signal has asserted 5 times.

---
## Finding more information
1. [ uvm_barrier ](https://verificationacademy.com/verification-methodology-reference/uvm/docs_1.2/html/files/base/uvm_barrier-svh.html)
1. [ uvm_pool ](https://verificationacademy.com/verification-methodology-reference/uvm/docs_1.2/html/files/base/uvm_pool-svh.html)


