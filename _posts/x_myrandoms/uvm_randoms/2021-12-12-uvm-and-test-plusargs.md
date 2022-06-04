---
layout: default
title: Using plusargs in uvm test
parent: UVM Randoms
grand_parent: My Randoms
description: Using plusargs in uvm test
comments: true
share: true
tags: [uvm]
nav_order: 1
toc_en: true
---

# Using plusargs in uvm testbench
Test plusargs. Does not include uvm built in plusargs
{: .fs-5 .fw-500 }

---
## Systemverilog system function for plusargs
Systemverilog has two system functions for retrived the arguments (aka plusargs) from the command line, these are `$test$plusargs` and `$value$plusargs`.

### $test$plusargs(string)
This system function receive a string as it input argument, then search through the plusargs in the command line. 
If the **prefix** of any of the plusargs is matched with the provided string of the system function, this function return **non-zero** value.
Usually, we will use this function as an expression in the consditional statement `if`-`else` as below example:

{% highlight verilog %}
// Simulator command line argument: +PLUSARGS_TEST

if($test$plusargs(PLUSARGS_TEST)) begin 
  `uvm_info([INFO], "Found plusargs +PLUSARGS_TEST", UVM_LOW )
end 
{% endhighlight %}


### $value$plusargs
#### string format for plusargs


---
## UVM built-in functions that help
Some of the function that make handling test plusargs easier

### Plusargs for enum variable
Assuming we have a enum type `sha_mode_e`, and the plusargs input value is stored in a string. 
Instead of using `switch-case` to match the string to each enum name constant,
we can use `uvm_enum_wrapper#(<enum type>)::from_name()` function to cast the plusarg string to the enum variable.

{% highlight verilog %}
 // Example simulator command line argument: +SHA_MODE=SHA_256
 //

 string     m_tmp_str;
 sha_mode_e m_sha_mode;

 if($value$plusargs("SHA_MODE=%s", m_tmp_str)) begin
    if (uvm_enum_wrapper#(sha_mode_e)::from_name(m_tmp_str, m_sha_mode)) begin
    `uvm_info([INFO], $psprintf("Sha mode: %s", m_sha_mode.name()), UVM_LOW )
    end 
 end 
{% endhighlight %}

### uvm_cmdline_processor sigleton class

### plusarg containing a list of values
{% highlight verilog %}
 // Example simulator command line argument: +QUEUE_EN_LIST=0,5,10,15
 //

 string queue_en_lst;

 if (uvm_cmdline_proc.get_arg_value("+QUEUE_EN_LIST=", queue_en_lst)) begin
    string queue_en_q[$];
    uvm_split_string(upka_en_lst, "," , queue_en_q);
    foreach (queue_en_q[i]) begin
       m_env_cfg.set_queue_en(.queue_idx(queue_en_q[i].atoi()));
    end
 end
{% endhighlight %}


### multiple plusargs with the same name 
### some uvm useful default plusargs


---
## Finding more information
1. Systemverilog LRM, section 21.6 Command line input
1. Systemverilog LRM, Annex G Std package
1. [ uvm_pool.svh ](https://verificationacademy.com/verification-methodology-reference/uvm/docs_1.2/html/files/base/uvm_pool-svh.html)


