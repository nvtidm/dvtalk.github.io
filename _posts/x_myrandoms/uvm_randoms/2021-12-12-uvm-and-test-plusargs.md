---
layout: default
title: Using Plusargs in UVM Test
parent: UVM Randoms
grand_parent: My Randoms
description: Using Plusargs in UVM Test
comments: true
share: true
tags: [uvm]
nav_order: 1
toc_en: true
---

# Using Plusargs in UVM Testbench
Test plusargs.
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
  `uvm_info([PLUSARGS], "Found plusargs +PLUSARGS_TEST", UVM_LOW )
end 
{% endhighlight %}

### $value$plusargs
Similar to `$test$plusargs`, but the plusargs now comes with a value, and we can assign that value to a variable as below example.
{% highlight verilog %}
// Simulator command line argument: +PLUSARGS_TEST=20

int m_plusargs;

if($value$plusargs("PLUSARGS_TEST=%d", m_plusargs )) begin 
  $display ("Found plusargs +PLUSARGS_TEST = %d", m_plusargs);
end 

// m_plusargs now has a value of 20

{% endhighlight %}

#### string format for plusargs
We can use below format string when get the value from plusargs
|      | |
|:-----|:--------|
|%d    |decimal conversion|
|%o    |octal conversion|
|%h,%x |hexadecimal conversion|
|%b    |binary conversion|
|%e    |real exponential conversion|
|%f    |real decimal conversion|
|%g    |real decimal or exponential conversion|
|%s    |string (no conversion)|


---
## UVM built-in functions those help
Some uvm functions those make handling test plusargs easier

### Plusargs for enum variable
Assuming we have a enum type `sha_mode_e`, and the plusargs input value is stored in a string. 
Instead of using `switch-case` to match the string to each enum name constant,
we can use `uvm_enum_wrapper#(<enum type>)::from_name()` function to cast the plusarg string to the enum variable.

{% highlight verilog %}
 //
 // Example simulator command line argument: +SHA_MODE=SHA_256
 //

 string     m_tmp_str;
 sha_mode_e m_sha_mode;

 if($value$plusargs("SHA_MODE=%s", m_tmp_str)) begin
    if (uvm_enum_wrapper#(sha_mode_e)::from_name(m_tmp_str, m_sha_mode)) begin
       `uvm_info([PLUSARGS], $psprintf("Sha mode: %s", m_sha_mode.name()), UVM_LOW )
    end 
 end 
{% endhighlight %}

### uvm_cmdline_processor sigleton class
This uvm class supports many functions that handle the plusargs.
Let's check some examples below.

### plusarg containing a list of values
{% highlight verilog %}
 //
 // Example simulator command line argument: +QUEUE_EN_LIST=0,5,10,15
 //

 string queue_en_lst;

 if (uvm_cmdline_proc.get_arg_value("+QUEUE_EN_LIST=", queue_en_lst)) begin
    string queue_en_s[$];
    int    queue_en[$]
    uvm_split_string(upka_en_lst, "," , queue_en_s);
    foreach (queue_en_s[i]) begin
       queue_en[i] = queue_en_s[i].atoi();
    end
 end
{% endhighlight %}


### multiple plusargs with the same name, but different values
Assuming we need a plusarg with this format to configure one aes encryption operation : `+AES_OPR_CFG=<AES_MODE>,<KEY_LEN>`.

We also need to have multiple aes encryption operations in 1 test, each receiving plusarg will corresponding to 1 operation.

{% highlight verilog %}
 //
 // Example simulator command line argument: +AES_OBJ_CFG=AES_CBC,128 +AES_OBJ_CFG=AES_ECB,256
 // Expect 2 aes operation:
 //               1st aes operation: aes mode is AES_CBC, key length 128
 //               2nd aes operation: aes mode is AES_ECB, key length 256
 //

 string aes_opr_lst;

 if (uvm_cmdline_proc.get_arg_value("+AES_OPR_CFG=", aes_opr_lst)) begin
    string queue_en_s[$];
    int    queue_en[$]
    uvm_split_string(upka_en_lst, "," , queue_en_s);
    foreach (queue_en_s[i]) begin
       queue_en[i] = queue_en_s[i].atoi();
    end
 end
{% endhighlight %}

### some uvm useful default plusargs


---
## Finding more information
1. Systemverilog LRM, section 21.6 Command line input
1. [uvm_cmdline_processor](https://verificationacademy.com/verification-methodology-reference/uvm/docs_1.2/html/files/base/uvm_cmdline_processor-svh.html)


