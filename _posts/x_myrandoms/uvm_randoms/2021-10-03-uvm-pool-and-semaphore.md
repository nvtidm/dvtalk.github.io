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
Uvm support `uvm_pool`, which can be understood as a global associative array.
We can define the the type of index and value of this array.
{: .fs-5 .fw-500 }

By default, uvm has two pools using string as index for `uvm_event` and `uvm_barrier`, which are `uvm_event_pool` and `uvm_barrier_pool`, respectively.
In this post, let's go through examples of using `uvm_pool` for Systemverilog semaphore.
{: .fs-5 .fw-500 }

---
## uvm_pool and Systemverilog semaphore 101
First up, let's briefly cover the semaphore and `uvm_pool`.

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

To create a pool of Systemverilog semaphore, we just need to define our pool for semaphore as below:
{% highlight verilog %}
   typedef uvm_pool #(.KEY(string), .T(semaphore)) uvm_semaphore_pool;
{% endhighlight %}

Then we contruct a pool then add/get semaphore object to this pool.
{% highlight verilog %}
   ...
   // To use this uvm_semaphore_pool, we must first construct it.
   // This pool is a singleton class, 
   // which will be constructed only one time by calling get_global_pool();
   uvm_semaphore_pool m_pool = uvm_semaphore_pool::get_global_pool();

   ...
   // Now we can add/get semaphore object to the pool
   semaphore m_port_avail_sem = new(2);                         //create semaphore with 2 keys
   uvm_semaphore_pool::add("port_avail_sem", m_port_avail_sem); //add this semaphore to pool with name "port_avail_sem"

   ...
   // Get the semaphore "port_avail_sem" key from the pool
   uvm_semaphore_pool::get("port_avail_sem").get(1);

   //
{% endhighlight %}


### Creating uvm_semaphore to use with uvm_object_string_pool
We can create our own `uvm_semaphore` class, wrap around the `semaphore` of Systemverilog.
This allow us having more control over the semaphore, also more information when debugging.

Let's create the `uvm_semaphore` class as below. You can get the full class here: [ uvm_semaphore ]( https://gist.github.com/dvtalk/692f45bba567aaeae98f61f63d867058 )
{% highlight verilog %}
   class uvm_semaphore extends uvm_object;
      protected semaphore m_semaphore;

      function new (string name="", int keyCount=0);
         super.new(name);
         m_semaphore = new(keyCount);
      endfunction

      virtual function void put(int keyCount=1);
         m_semaphore.put(keyCount);
         ...
      endfunction

      virtual task get(int keyCount=1);
         m_semaphore.get(keyCount);
         ...
      endtask
      
      virtual function void set_keyCount(int keyCount=0);
         ...
      endfunction
      ...
   endclass
{% endhighlight %}

Then we can use this `uvm_semaphore` with `uvm_object_string_pool`, similar to the `uvm_event_pool` and `uvm_barrier_pool`.

{% highlight verilog %}
   typedef uvm_object_string_pool #(uvm_semaphore) uvm_semaphore_pool;
{% endhighlight %}

It will be a little more simple when using this pool:
* We can call the `get_global()` function to get the semaphore in the pool, 
and if the semaphore object does not exist, the pool will automatically construct a semaphore object for us.
* Also, we do not need to construct the pool manually, it will be construct automatically when we call `get_global()` the first time.

{% highlight verilog %}
   // When we call the get_global("port_avail_sem") the first time:
   //    the pool will be constructed automatically. 
   //    the semaphore object "port_avail_sem" will be constructed automatically 
   //    The keyCount might be set as default to 0 (depend on your uvm_semaphore class), we might put more key to the bucket to use.

   //add more 2 keys in semaphore bucket
   uvm_semaphore_pool::get_global("port_avail_sem").put(2); 
   
   ...
   // Get semaphore key
   uvm_semaphore_pool::get_global("port_avail_sem").get(1); //get key
   
{% endhighlight %}

---
## Finding more information
1. Systemverilog LRM, section 15.3 Semaphores
1. Systemverilog LRM, Annex G Std package
1. [ uvm_pool ](https://verificationacademy.com/verification-methodology-reference/uvm/docs_1.2/html/files/base/uvm_pool-svh.html)


