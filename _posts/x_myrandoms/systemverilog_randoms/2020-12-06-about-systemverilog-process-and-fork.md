---
layout: default
title: About Systemverilog process and fork join
parent: Systemverilog Randoms
grand_parent: My Randoms
description: This post is about Systemverilog processes including using fork, wait/disable fork, fork in a loop, and also fine grain process control
tags: [systemverilog]
comments: true
toc_en: true
nav_exclude: false
search_exclude: false
nav_order: 3
---

# About Systemverilog process and fork join
In Systemverilog, we can group statements into blocks and there are two ways to do so. The first way is groups them into `begin`-`end` block, where statements are executed sequentially.
The other way is to use the `fork`-`join` block, also called parallel block. In this block, all statements are executed concurrently.
This post will share how to use this `fork`-`join` block and some of its practical cases.
{: .fs-5 .fw-500 }

---
## join/join_none/join_any
First up, let's look at the structure of the parallel block.
The block begin with the keywork `fork`, all procedure statements under this keywork will be started at the same time. When the parent process can resume its execution is depended on the closing keywork.
We have `join`, `join_none` and `join_any`.

* For `fork`-`join`, **all the procedure statements** will have to finish before the parent process can resume its execution.
* For `fork`-`join_any`, the parent process will be blocked until **one of the processes** spawned by the fork finished.
* For `fork`-`join_none`, the parent process will **continue at the same time** with all the processes spawned by the fork.

Just simple as that, start your block with `fork`, then end your block with either `join`, `join_any` or `join_none`. 
However, life is not that much easy. Let's consider some cases below, where using some other control methods alongside fork is necessary.

---
## fork join in a loop
### fork join_none in a loop
Let consider this case, we have a list of item, and we want to start a single procedure statement for each item of that list,
and we want all of those procedure statement start at the same time. Also, we need all of those processes to finish before executing
any other statement.
We can easily achieve the requirement using `fork` and `join_none` as below.
<div class ="code" markdown="1" >
{% highlight verilog %}
    int lst[5] = '{1,2,3,4,5};
    for(int i=0; i < 5; i++ )  begin
      fork
        begin
          automatic int j = i;
          $display ("%t ps, start thread %d", $time, j);
          #lst[j];
          $display("%t ps, end of thread %d", $time,j);
        end
      join_none
    end
    wait fork;
    #1;
    $display("the NEXT Statement ... ");
{% endhighlight %}
</div>
There are several things that we can notice here.
* Firstly it's the `automatic` keywork. We need to copy `i` to `j` automatic variable in each iteration of the for loop.
Since we use `join_none` here, all of 5 processes will start at the same time, and we only have one `i` variable, and after 5 iterations, `i` will hold a value 4.
This means that if we use `i` variable instead of creating local copy of it, these all 5 processes will run with the same value of `i` after 5 iterations, which is 4.
Then we'll end up having 5 exactly the same processes instead of 5 processes with 5 different values of a list.
* Secondly, it's the `wait fork` statement, this is for waiting all 5 processes to finish before executing the next statement.
* Why don't we use `fork/join` here? It's simply because when using `join` instead of `join_none` inside a loop, 
all the processes inside `fork/join` will have to finish before moving to the next iteration of the loop. In the example above, 
if the `fork/join` is used instead of `fork/join_none`, we'll have 5 thread executed sequentially, not concurrently.

### fork join_any in a loop
Similar to the example above, but this time, we need to execute the next statement ```$display("the NEXT Statement ... ");``` right after *ONE of the 5 processes* finished.
In this case, using `fork/join_any` will NOT solve the requirement.
<div class ="code" markdown="1" >
{% highlight verilog %}
    int lst[5] = '{1,2,3,4,5};
    for(int i=0; i < 5; i++ )  begin
      fork
        begin
          automatic int j = i;
          $display ("%t ps, start thread %d", $time, j);
          #lst[j];
          $display("%t ps, end of thread %d", $time,j);
        end
      join_any // --> wait until one of the processes inside the fork/join_any finished
    end
    wait fork;
    #1;
    $display("the NEXT Statement ... ");
{% endhighlight %}
</div>
* Why it does not work? What is required is to start 5 processes at the same time using a for loop, then executing the next statement right after any one of the processes finished.
Here inside the `fork/join_any`, there is only 1 procedure statment (inside `begin/end`), therefore we will need to wait for the process to finish before moving to the next iteration of the loop,
which means we will have 5 processes executed sequentially, not concurrently.
* To solve this problem, we need to use `fork/join_none` inside loop to create 5 processes executed concurrently, and then using an event to execute 
the next statement right after one of the 5 processes finished.
<div class ="code" markdown="1" >
{% highlight verilog %}
    int lst[5] = '{1,2,3,4,5};
    uvm_event finish_event;
    for(int i=0; i < 5; i++ )  begin
      fork
        begin
          automatic int j = i;
          $display ("%t ps, start thread %d", $time, j);
          #lst[j];
          $display("%t ps, end of thread %d", $time,j);

          finish_event.trigger(); //
        end
      join_none
    end
    finish_event.wait_trigger(); // wait for an event to be triggered instead of using wait fork;
    #1;
    $display("the NEXT Statement ... ");
{% endhighlight %}
</div>
* In the above example, by using `fork/join_none`, we have 5 processes executed concurrently. And by using `uvm_event`, the 
```$display("the NEXT Statement ... ");``` will be executed when one of the 5 processes finished.

### fork join_none in a forever loop
We can also put the fork in side a forever loop.
I sometimes do this when monitoring a signal.
However, we should be careful about the content of the `fork-join_none` block, because it might hang our simulator.
Never write any code with no statement to control the process in forever loop like below:
<div class ="code" markdown="1" >
{% highlight verilog %}
    forever begin
      fork
        begin
          $display ("%t ps, start thread %d", $time, j);
          #1;
          $display("%t ps, end of thread %d", $time,j);
        end
      join_none
    end
{% endhighlight %}
</div>
* The above code will hang our simulator. Because we're using `fork/join_none`, and the 2 `$display` tasks will be executed right away, then move to the next interation of the forever loop.
This loop will create infinite number of process and hang the simulator. We should at least have some control inside the `fork-join_none` like below:
{% highlight verilog %}
    forever begin
      fork
        begin
          $display ("%t ps, start thread %d", $time, j);
          #10;
          //
          // Wait for some signal to trigger.
          ...
          //
          $display("%t ps, end of thread %d", $time,j);
        end
      join_none
    end
{% endhighlight %}


---
## Process control
Systemverilog supplies us several ways to control processes, those methods are especially useful when it comes to using `fork/join` statement.
Besides, we can also use other methods such as `uvm_event` as above to tackle the problem.

### wait fork statement
`wait fork` might be the statement that is used the most when controlling processes in `fork join`. It's pretty simple, all the child subprocesses will have to finish before executing the next statement.
<div class ="code" markdown="1" >
{% highlight verilog %}
    fork
        #1 $display("%t ps, end of thread %d", $time,j);
        #3 $display("%t ps, end of thread %d", $time,j);
        #2 $display("%t ps, end of thread %d", $time,j);
    join_any
    $display("the first process has finished");

    wait fork; // wait for all the processes inside fork/join_any to finished

    $display("the NEXT Statement ... ");
{% endhighlight %}
</div>

### disable fork statement
`disable fork`, in the other hand, will terminates all active descendants (subprocesses).
<div class ="code" markdown="1" >
{% highlight verilog %}
    fork
        #1 $display("%t ps, end of thread %d", $time,j);
        #3 $display("%t ps, end of thread %d", $time,j);
        #2 $display("%t ps, end of thread %d", $time,j);
    join_any

    $display("the first process has finished");

    disable fork; // disable all the processes inside fork/join_any after  the first subprocesses finished.

    $display("the NEXT Statement ... ");
{% endhighlight %}
</div>

### disable statement
We also have a `disable` statement, which can disable the processes of the entire block or task (cannot be used to disable a function).

Let's use above example with new requirement: disable all remaining active process after one of the processes finished.

We have a list of item, and we want to start a single procedure statement for each item of that list
and we want all of those procedure statement start at the same time.

<div class ="code" markdown="1" >
{% highlight verilog %}
    int lst[5] = '{1,2,3,4,5};
    uvm_event finish_event;
    for_loop_block_1: for(int i=0; i < 5; i++ )  begin
      fork
        begin
          automatic int j = i;
          $display ("%t ps, start thread %d", $time, j);
          #lst[j];
          $display("%t ps, end of thread %d", $time,j);
          finish_event.trigger(); //
        end
      join_none
    end

    finish_event.trigger();
    disable for_loop_block_1; //
    #1;
    $display("the NEXT Statement ... ");
{% endhighlight %}
</div>

* Here we have the for loop an block name, `for_loop_block_1`, then when the first process finished, we kill all remaining active processes by using `disable for_loop_block_1`.

### fine-grain process control
Systemverilog also provide us this built-in `process` class (in the built-in `std` package) to control the active processes.
Mostly, I use this `process` class for debugging purpose, to check the status of all the processes in the `fork/join` block.
Check the example below:

<div class ="code" markdown="1" >
{% highlight verilog %}
  std::process p1,p2,p3;
  
  initial begin
        fork
          begin
            $display("%t ps, start of thread %d", $time,1);
            p1 = std::process::self();
            #1 
            $display("%t ps, end of thread %d", $time,1);
          end
          begin
            $display("%t ps, start of thread %d", $time,2);
            p2 = std::process::self();
             #3 
            $display("%t ps, end of thread %d", $time,2);
          end
          begin
            $display("%t ps, start of thread %d", $time,3);
            p3 = std::process::self();
             #2 
            $display("%t ps, end of thread %d", $time,3);
          end
    join_any

    $display("the first process has finished");
    $display("thread 1 process status: %s", p1.status().name());
    $display("thread 2 process status: %s", p2.status().name());
    $display("thread 3 process status: %s", p3.status().name());

    wait fork; // wait for all the processes inside fork/join_any to finished

    $display("the NEXT Statement ... ");
  end 
{% endhighlight %}
</div>
* The p1, p2, p3 has the variable type as `process` class, 
then we use the static function `self()` of the `process` class to get the handle to the current processes of thread 1, 2, 3 respectively.
* After that, we can use the `status()` method to check the status of the process.
* We can also have other control over the process using these built-in methods of the `process` class: `kill()`, `suspend()`, `resume()`, etc.

<div> You can run an example of this fine grain control here:
<a href="https://www.edaplayground.com/x/fc2c" title="SystemVerilog fine grain control">
<svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg>
</a></div>

Let's take another example of using fine grain process control with forever loop:
{% highlight verilog %}
   std::process m_process_q[$];
   ...
   forever begin
      fork
         begin
            m_process_q.push_back(std::process::self());
            @(posedge signal_a);
            //... other statements
         end 
      join_none
   end 

   ...
   foreach (m_process_q[i]) begin
      m_process_q[i].kill();
   end 

   //
{% endhighlight %}
* In above example, we get all the handles of any process created in the forever loop and store in the queue `m_process_q[$]`.
* Then later, when necessary, by iterating through that queue, we can kill all those processes.

---
## Finding more information
To have more understanding as well as more examples, you can check the IEEE Standard for Systemverilog, chapter.9 Process.


