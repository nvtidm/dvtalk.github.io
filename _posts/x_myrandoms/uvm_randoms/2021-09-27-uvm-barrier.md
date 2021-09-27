---
layout: default
title: How to use uvm_barrier and uvm_barrier_pool
parent: UVM Randoms
grand_parent: My Randoms
description: How to use uvm_barrier and uvm_barrier_pool
comments: true
share: true
tags: [uvm]
nav_order: 1
toc_en: true
---

# How to use uvm_barrier and uvm_barrier_pool
`uvm_barrier` is added alongside `uvm_event` for synchronization.
This class allow us to block the specific processes until an expected number of processes reach a defined point.
After that, all the pending processes will be resumed, similar to lifting the barrier.
{: .fs-5 .fw-500 }

---
## How to use uvm_barrier and uvm_barrier_pool

### uvm_barrier class basic function
The `uvm_event` class supports several basic methods as below:
* *`new()`*: Creates a new event object
* *`set_threshold()`*: 
* *`get_threshold()`*: 
* *`wait_for()`*: 
* *`reset()`*: 
* *`set_auto_reset()`*:
* *`get_num_waiters()`*: 
* *`cancel()`*: 

### uvm_barrier_pool
When the `trigger()` method and the `wait_trigger()` method are called at the same simulation time, we call it event race condition.

When this happens, we will not know if the `trigger()` is occurred before or after the `wait_trigger()`.
If the `trigger()` is executed first, we end up in a deadlock situation.
The reason is the `wait_trigger()` will wait for the next trigger of the event, but it the `trigger()` is already processed prior to the wait.

We can also avoid race condition by having a coding convention as below:
{% highlight verilog %}
uvm_event m_my_event = new();

//for trigger,
//only trigger when the state of event is off (by reset or the event has not been trigger at all)
m_my_event.wait_off();
m_my_event.trigger();

//for wait_trigger, reset the event to off state after wait_trigger() return
m_my_event.wait_trigger();
m_my_event.reset();
{% endhighlight %}

---
## Example

### uvm_barrier basic
### uvm_barrier for counting signal pulse

---
## Finding more information
1. [ uvm_barrier ](https://verificationacademy.com/verification-methodology-reference/uvm/docs_1.2/html/files/base/uvm_barrier-svh.html)
1. [ uvm_event_callback ](https://verificationacademy.com/verification-methodology-reference/uvm/docs_1.2/html/files/base/uvm_event_callback-svh.html)
1. [ uvm_pool ](https://verificationacademy.com/verification-methodology-reference/uvm/docs_1.2/html/files/base/uvm_pool-svh.html)


