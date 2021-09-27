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
Systemverilog already has `event`, used for communication and synchronization. However if using uvm, my opinion is we should use `uvm_event` instead.
It's a class, so we can easily to manage the event in oop style. And thanks to that, `uvm_event_pool` is created to support us.
{: .fs-5 .fw-500 }

---
## What is uvm_barrier
My opinion is, always use the `uvm_event`, because it has many advantages over the Systemverilog `event`:
1. Supporting more functions, easier to control the event and also more readable.
For example, given the event named `func_done`, trigger the event with `func_done.trigger()` is much more clear than `->func_done`.

---
## How to use uvm_barrier and uvm_barrier_pool

### uvm_barrier class basic function
The `uvm_event#(T)` class supports several basic methods as below:
* *`new()`*: Creates a new event object
* *`trigger()`*: Trigger the event.
* *`wait_trigger()`*: Waits for the next trigger of the event.
* *`wait_ptrigger()`*: Waits for a persistent trigger of the event, avoids the event race conditions.
* *`is_on()`*: Returns 1 if the event has triggered.
* *`is_off()`*: Returns 1 if the event has not been triggered since created or reset.
* *`wait_on()`*: Waits for the event to be triggered for the *first* time, returns if the event is already triggered.
* *`wait_off()`*: When the event is triggered and "*on*", this method wait for the event to be "*off*" by reset method.
* *`reset()`*: Resets the event, turns its state to "*off*".
* *`get_trigger_time()`*: Returns the time when the event was last triggered.
* *`get_num_waiters()`*: Returns the number of processes currently waiting on the event.

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
1. [ uvm_event ](https://verificationacademy.com/verification-methodology-reference/uvm/docs_1.2/html/files/base/uvm_event-svh.html)
1. [ uvm_event_callback ](https://verificationacademy.com/verification-methodology-reference/uvm/docs_1.2/html/files/base/uvm_event_callback-svh.html)
1. [ uvm_pool ](https://verificationacademy.com/verification-methodology-reference/uvm/docs_1.2/html/files/base/uvm_pool-svh.html)


