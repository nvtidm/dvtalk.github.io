---
layout: default
title: Systemverilog macro with examples
parent: Systemverilog Randoms
grand_parent: My Randoms
description: This post is about Systemverilog macro and some examples of it
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
* No space after the backslash `\` at the end of each line except for the last line of the macro.
* No space between macro name and the open parentheses for macro argument `(`. (I actually had a painful experience with this rule).

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
//
{% endhighlight %}
</div>

* \`" (a tick then double quotes): if `ARG` is put between these, the `ARG` will considered as a string, also \`" will be parsed as doubled quotes ".
<div class="code">
{% highlight verilog %}
`define print_arg(ARG1, ARG2) $display(`"ARG2 signal, expected value is ARG1, current value: %0d `", ARG2);

--> usage example:
`print_arg(1, top.module_a.signal_a)
// generated code:  $display("top.module_a.signal_a signal, expected value is 1, current value: %0d ", top.module_a.signal_a);
//
{% endhighlight %}
</div>

* \`\\`" (a tick, a backslash, a tick then double quotes): to keep the escape sequence \\" in the generated text.
{% highlight verilog %}
`define print_arg(ARG1) $display(`" `\`"ARG1 `\`" signal, current value: %0d `",ARG1);

--> usage example:
`print_arg(top.module_a.signal_a)
// generated code:  $display(" \"top.module_a.signal_a\" signal, current value: %0d ", top.module_a.signal_a);
//
// simulation output:  "top.module_a.signal_a" signal, current value: 2000
//
{% endhighlight %}

<div> <p></p>You can run an example of these macros with argument here:
<a href="https://www.edaplayground.com/x/PR3c" title="SystemVerilog Macros">
<svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg>
</a></div>
### Recommendation
* If writing a function/task is possible, avoid writing macro =D.
* Marco is usually used for coverage point definition, assertion definition.
* Write all the macros in one file, and include that file in your sv package. Since redefine macro is allowed,
write macros everywhere in your codes make debugging these macros become painful.
* Macro can call other macros or compiler directives, but be careful, should keep it simple.
* When using argument, try to use default value (similar to default value in function/task).

### Debugging
Macro is annoying when it comes to debugging. When I need to write and debug a macro, I do this:
* Open macro files in EDA tool, such as verdi, then hover the mouse over the macro to see the generated code.

---
## Examples
Create a macro to define assertion with below requirements:
1. Assertion to compare `SIGNAL` value with `EXP_VALUE`.
1. Provide clock in `CLK`, enable/reset signal in `ENA`. `ENA` default is 0 (inactive).
1. Use `EXT_ERROR_CMD` to add additional statement when assertion fail, leave it blank if no use.
{% highlight verilog %}
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

--> usage example:
`assertion_signal_check(top.mod_a.signal_a, 4'hA, x_clk, rst_n,)
// generated code:
//
//   property check_top.mod_a.signal_a_p;
//      @(posedge x_clk )
//      disable iff (! rst_n )
//      ( top.mod_a.signal_a == 4'hA  ) ;
//   endproperty
//   assert property (check_top.mod_a.signal_a_p) else begin
//      $error($psprintf("The top.mod_a.signal_a is supposed to be 4'hA, real value is 0x%x", top.mod_a.signal_a ));
//       ;
//   end
//
{% endhighlight %}

---
## Finding more information
To having more understanding as well as having more example, you can check the IEEE Standard for SystemVerilog, chapter.22 Compilers directives.


