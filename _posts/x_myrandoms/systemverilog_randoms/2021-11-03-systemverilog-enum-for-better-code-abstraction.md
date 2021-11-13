---
layout: default
title: 
parent: Systemverilog Randoms
grand_parent: My Randoms
description: Use Systemverilog enum for better code abstraction
tags: [systemverilog]
comments: true
toc_en: true
nav_exclude: false
search_exclude: false
nav_order: 3
---

# Use Systemverilog enum for better code abstraction
Usually, when talking about enum, we might just think that enumeration in Systemverilog is for improving readability.
However, by using enumeration, we can replace any strong-typed value with enum type.
Thus, it will be easier for update the strong-typed value later, making the code more abstract.
In this post, let's look at examples where using the enumeration can simplify the modification steps when the requirements of the environment changed.
{: .fs-5 .fw-500 }

---
## Basic of Systemverilog enumeration
### Define an enum type
Let take an example of defining an enum type represent the index of each UART module instances in the env.
{% highlight verilog %}
`define NUM_OF_UART 4

typedef enum {UART[1:1+`NUM_OF_UART]=1} ip_idx_e;

// the corresponding explicit declared enum type of above is:
// typedef enum int {UART1=1, UART2=2, UART3=3, UART4=4} ip_idx;
...
{% endhighlight %}

Some important points from the above example:
* If we do not define the explicit type, the default data type for an enum constant is `integer`.
* We can use range to define an enum and it's very helpful when using with compiler directive as the above example.
* By default, the first enum name constant will be assign to the value of `0`, but we can override that default, as in the example, the initial value is `1`.

### Enum methods
Systemverilog enumeration provide a useful set of methods as below:
* `first()` : returns the value of the first member of the enumeration.
* `last() ` : returns the value of the last member of the enumeration.
* `next() ` : returns the next enumeration value.
* `prev() ` : returns the previous enumeration value.
* `num()  ` : returns the number of elements in the given enumeration.
* `name() ` : returns the string representation of the given enumeration label.

We can not call these functions directly on an enum type, but on the variable has it's type as an enum.
{% highlight verilog %}
`define NUM_OF_UART 4

typedef enum {UART[1:1+`NUM_OF_UART]=1} ip_idx_e;

ip_idx_e m_idx;

m_idx = ip_idx_e.first(); // error
m_idx = m_idx.first();    // no error, m_idx will be assigned to UART1
m_idx = m_idx.last();     // no error, m_idx will be assigned to UART4
{% endhighlight %}

### Iterating through an enum
Now with all of the supported methods, we can iterate through all the label in an enum.

Let's look at an example below. 
Assuming we have the base address of each UART instances, and we want to create an associative array using `ip_idx_e` as index,
and the value is the base address of each UART module instances.
Also, the range of address of each uart instance will be `16'h100`.
{% highlight verilog %}
`define NUM_OF_UART 4
`define UART0_BASE_ADDR 32'h0A00_0000;
`define UART_ADDR_RANGE 16'h1000;

typedef enum {UART[1:1+`NUM_OF_UART]=1} ip_idx_e;
...

bit[31:0] m_uart_base_addr[ip_idx_e];
...
function new ();
   ip_idx_e m_tmp_idx;
   m_tmp_idx = m_tmp_idx.first();

   for (int i=0; i< `NUM_OF_UART; i++ ) begin
      m_uart_base_addr[m_tmp_idx] = `UART0_BASE_ADDR + i * `UART_ADDR_RANGE;
      if (m_tmp_idx != m_tmp_idx.last()) begin
         m_tmp_idx = m_tmp_idx.next();
      end
   end 
endfunction

// --> the expected associative array will be:
// m_uart_base_addr[ip_idx_e] = '{
//     UART1 : 32'h0A00_0000,
//     UART2 : 32'h0A00_1000,
//     UART3 : 32'h0A00_2000,
//     UART4 : 32'h0A00_3000
// };

{% endhighlight %}

---
## Enumeration examples
### Creating associative array of base addresses
Let's look at the associative array with enum as index example in above section.
* Assuming that the design has been changed, instead of 4 UARTs, the SoC now supports up to 10 UART instances,
and we need to update the associative array of base addresses (in the above example).
* All we need to update in this case is the compiler directive `NUM_OF_UART`,
the `ip_idx_e` enum will automatically have constant label from `UART1` to `UART10`,
thus expected associative array of base addresses is created.

{% highlight verilog %}
`define NUM_OF_UART 10 // --> only update here
`define UART0_BASE_ADDR 32'h0A00_0000;
`define UART_ADDR_RANGE 16'h1000;

typedef enum {UART[1:1+`NUM_OF_UART]=1} ip_idx_e;
...

bit[31:0] m_uart_base_addr[ip_idx_e];
...
function new ();
   ip_idx_e m_tmp_idx;
   m_tmp_idx = m_tmp_idx.first();

   for (int i=0; i< `NUM_OF_UART; i++ ) begin
      m_uart_base_addr[m_tmp_idx] = `UART0_BASE_ADDR + i * `UART_ADDR_RANGE;
      if (m_tmp_idx != m_tmp_idx.last()) begin
         m_tmp_idx = m_tmp_idx.next();
      end
   end 
endfunction

// --> the expected associative array will be:
// m_uart_base_addr[ip_idx_e] = '{
//     UART1 : 32'h0A00_0000,
//     UART2 : 32'h0A00_1000,
//     ...
//     UART9  : 32'h0A00_8000
//     UART10 : 32'h0A00_9000
// };

{% endhighlight %}

### Constructing configure obj for each ip instances
For this example, let's assume that we're creating an uvm env with several different types of ip.
Each of those ip instances will need a configuration object, and provided with a base address of that instance.
* In this example, we will create an enum of base address directly.
* We will use `uvm_pkg::uvm_re_match()` to perform string pattern matching.
* Assuming we already have these cfg class `uart_cfg`, `spi_cfg` and `i2c_cfg`.
And these class are extended form `base_cfg` class.
* Also this `base_cfg` will have `add_base_address()` method to add the base address of ip instance.

{% highlight verilog %}
typedef enum {
   UART0 = 32'h0A00_0000 
  ,UART1 = 32'h0A00_1000 
  ,SPI0  = 32'h0B00_0000 
  ,SPI1  = 32'h0B00_1000 
  ,I2C0  = 32'h0C00_0000 
  ,I2C1  = 32'h0C00_1000 
} ip_base_addr_e;
...

// queue to store handles of cfg objects
base_cfg m_cfg_obj[$];

function new ();
   ip_base_addr_e  m_ip_addr = m_ip_addr.first();

   for (int i=0; i < m_ip_addr.num(); i++ ) begin
      base_cfg m_ip_cfg_obj;
      string   m_ip_name = m_ip_addr.name();

      if (!uvm_re_match("UART.*", m_ip_name)) begin
         m_ip_cfg_obj = uart_cfg::type_id::create($psprintf("%s_cfg", m_ip_name.tolower()));
      end 
      if (!uvm_re_match("SPI.*", m_ip_name)) begin
         m_ip_cfg_obj = spi_cfg::type_id::create($psprintf("%s_cfg", m_ip_name.tolower()));
      end 
      if (!uvm_re_match("I2C.*", m_ip_name)) begin
         m_ip_cfg_obj = i2c_cfg::type_id::create($psprintf("%s_cfg", m_ip_name.tolower()));
      end 

      m_ip_cfg_obj.add_base_address(m_ip_addr);
      m_cfg_obj.push_back(m_ip_cfg_obj);

      if (m_ip_addr != m_ip_addr.last()) m_ip_addr = m_ip_addr.next();
   end 
endfunction

{% endhighlight %}
* The `uvm_re_match()` is actually a DPI-C function. It will return 0 if the input string matches the pattern.
* Instead of using `base_cfg m_cfg_obj[$]`, we can create an associative array as the first example to store the configuration object.

<div>You can try this example on edaplayground here:
<a href="https://www.edaplayground.com/x/btJN" title="Systemverilog enum example">
<svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg>
</a></div>

### Benefit of using enumeration
As those above examples, by using the enumeration, we can easily update the environment when the design specification updated.
* In the first example, if the number of UART instances is changed, we just need to update the compiler directive `NUM_OF_UART`.
* In the second example, when either the number of UART/SPI/I2C instances or the base address of those ip instances changed,
we just need to update the `ip_base_addr_e` enum.

Thus, it's a good practice to put all compiler directive and enum in one file,
so that when the environment need to update, we just need modify that file only.

---
## Finding more information
To have more understanding as well as more examples, you can check the IEEE Standard for Systemverilog, chapter.6.19 Enumeration.

