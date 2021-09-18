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
`define get_signal(ARG1, ARG2)  bit signal_``ARG1``_n = ARG2;

--> usage example:
`get_signal(1, top.module_a.signal_a)
// generated code: bit signal_1_n = top.module_a.signal_a;

`get_signal(c, top.module_a.signal_abc) 
// generated code: bit signal_c_n = top.module_a.signal_abc;
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

This argument can be used a with `$psprintf()` to form a string.
<div class="code">
{% highlight verilog %}
`define print_arg(ARG1, ARG2) $psprintf("%s signal, expected value is %s, current value: %0d ", `"ARG2`", `"ARG1`" , ARG2);

--> usage example:
`print_arg(1, top.module_a.signal_a)
// generated code:  $psprintf("%s signal, expected value is %s, current value: %0d ", "top.module_a.signal_a", "1", top.module_a.signal_a);
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

### Local macro
There is no such thing as local macro, but we can define a macro right when we need to call it,
then `undef` after use so we do not worry that it might be called by accident somewhere else.

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
### Macro to create an assertion
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

### Macro for queue/array conversion
{% highlight c %}
`define ARRAY_APPEND_TO_QUEUE(ARR,ARR_SIZE, QUEUE) \
   for (int i=0; i<ARR_SIZE; i++) begin \
      QUEUE.push_back(ARR[i]); \
   end

//
`define ARRAY_TO_QUEUE(ARR,ARR_SIZE, QUEUE) \
   QUEUE.delete(); \
   for (int i=0; i<ARR_SIZE; i++) begin \
      QUEUE.push_back(ARR[i]); \
   end

//
`define QUEUE_32_TO_8(Q_32, Q_8) \
   Q_8.delete(); \
   foreach (Q_32[i]) begin \
      bit[31:0] m_tmp = Q_32[i]; \
      Q_8.push_back(m_tmp[31:24]);\
      Q_8.push_back(m_tmp[23:16]);\
      Q_8.push_back(m_tmp[15:08]);\
      Q_8.push_back(m_tmp[07:00]);\
   end

//
`define QUEUE_8_TO_32(Q_8, Q_32) \
   Q_32.delete(); \
   for(int i=0;i<Q_8.size();i +=4) begin \
      Q_32.push_back({Q_8[i],  \
      Q_8[i+1], \
      Q_8[i+2], \
      Q_8[i+3]});\
   end

//
`define QUEUE_128_TO_32(Q_128, Q_32) \
   Q_32.delete(); \
   foreach (Q_128[i]) begin\
      bit[127:0] m_tmp = Q_128[i];\
      Q_32.push_back(m_tmp[127:96]);\
      Q_32.push_back(m_tmp[95:64]);\
      Q_32.push_back(m_tmp[63:32]);\
      Q_32.push_back(m_tmp[31:00]);\
   end

//
`define QUEUE_192_TO_32(Q_192, Q_32) \
   Q_32.delete(); \
   foreach (Q_192[i]) begin\
      bit[191:0] m_tmp = Q_192[i];\
      Q_32.push_back(m_tmp[191:160]);\
      Q_32.push_back(m_tmp[159:128]);\
      Q_32.push_back(m_tmp[127:96]);\
      Q_32.push_back(m_tmp[95:64]);\
      Q_32.push_back(m_tmp[63:32]);\
      Q_32.push_back(m_tmp[31:00]);\
   end

{% endhighlight %}


{% highlight verilog %}
{% endhighlight %}

---
## Finding more information
To have more understanding as well as more examples, you can check the IEEE Standard for SystemVerilog, chapter.22 Compilers directives.


