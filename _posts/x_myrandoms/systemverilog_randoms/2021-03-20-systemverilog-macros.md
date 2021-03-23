---
layout: default
title: Systemverilog macro with examples
parent: Systemverilog Randoms
grand_parent: My Randoms
description: This post is about systemverilog macro and some examples of it
tags: [systemverilog]
comments: true
toc_en: true
nav_exclude: false
search_exclude: false
nav_order: 3
---

# Systemverilog macro with examples
Macro is a piece of code which enable the text substitution everywhere the macro name is called. Systemverilog macro can also have argument like a function and it is actually very similar to macro in C which you may familiar with.
{: .fs-5 .fw-500 }

---
## Systemverilog macro 101
### Syntax
<div class="code">
{% highlight c %}
`define macro_name(ARG1=0, ARG2="default_string") \
   macro text1; \
   macro text2;
{% endhighlight %}
</div>
### Rules to follow
* Avoid using the macro name which is similar to any compiler directives.
* No space after the backslash \ at the end of each line except for the last line of the macro.
* No space between macro name and the open parentheses for macro argument "("    >.<

### Using macro argument
* Only the `ARG` itself: replaced as normal
* \`\` (double tick) + `ARG` : use the `ARG` to form a variable name, block name, signals, etc.
<div class="code">
{% highlight verilog %}
`define get_signal(ARG1, ARG2)  bit signal_``ARG1 = ARG2;

--> usage example: 
`get_signal(1, top.module_a.signal_a)   
// generated code: bit signal_1 = top.module_a.signal_a;

`get_signal(c, top.module_a.signal_abc) 
// generated code: bit signal_c = top.module_a.signal_abc;
{% endhighlight %}
</div>
* \`" (a tick then a double quote): if `ARG` is put between these, the `ARG` will considered as a string.
<div class="code">
{% highlight verilog %}
`define get_signal(ARG1, ARG2)  bit signal_``ARG1 = ARG2;

--> usage example: 
// generated code:

{% endhighlight %}
</div>
* \`\\`" (a tick, a backslash, a tick then a double quote): to keep the backslash in the generated text.

### Recommendation
* If writing a function/task is possible, avoid writing macro =D.
* Write all the macros in one file, and inlude that file in your sv package. Since redefine macro is allowed,
write macros everywhere in your codes make debugging these macros become painful.
* Macro can call other macros or compiler directives, or even call itself, but be careful.

### Debugging
Macro is anoying when it comes to debugging. When I need to write and debug a macro, I do this:
* Open macro files in EDA tool, such as verdi, then hover the mouse over the macro to see the generated code.


---
## Examples 









// Assertion to compare SIGNAL value with EXP_VALUE
// Provide clock in CLK, enable/reset signal in ENA. ENA default is 0(inactive).
// Use EXT_ERROR_CMD to add addtional statement when assertion fail, leave it blank if no use.
`define assertion_signal_check(SIGNAL, EXP_VALUE, CLK, ENA=0, EXT_ERROR_CMD) \
   property check_``SIGNAL``_p; \
      @(posedge CLK ) \
      disable iff (! ENA ) \
      ( SIGNAL == EXP_VALUE  ) ; \
   endproperty \
   assert property (check_``SIGNAL``_p) else begin \
      $error($psprintf(`"The SIGNAL is supposed to be EXP_VALUE, real value is 0x%x`", SIGNAL )); \
      EXT_ERROR_CMD ; \
   end

---
## Finding more information
To having more understanding as well as having more example, you can check the IEEE Standard for SystemVerilog, chapter.9 Process.


