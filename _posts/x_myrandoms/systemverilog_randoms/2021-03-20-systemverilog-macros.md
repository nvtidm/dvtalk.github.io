---
layout: default
title: Systemverilog macro with examples
parent: Systemverilog Randoms
grand_parent: My Randoms
description: This post is about systemverilog macro and some examples of it
tags: [systemverilog]
comments: true
toc_en: true
nav_exclude: true
search_exclude: true
nav_order: 3
---

# Systemverilog macro with examples
Blah blah blah
{: .fs-5 .fw-500 }

---
## Systemverilog macro 101
### Rules to follow
### Macro substitution and argument substitution
### Recommendation
### Debugging
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
Examples 

---
## Finding more information
To having more understanding as well as having more example, you can check the IEEE Standard for SystemVerilog, chapter.9 Process.


