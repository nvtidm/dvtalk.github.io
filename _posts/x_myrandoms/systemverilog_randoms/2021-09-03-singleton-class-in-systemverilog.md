---
layout: default
title: Singleton class in Systemverilog
parent: Systemverilog Randoms
grand_parent: My Randoms
description: How to create a Singleton class and it's usage in Systemverilog
tags: [systemverilog, uvm]
comments: true
toc_en: true
nav_exclude: false
search_exclude: false
nav_order: 3
---

# Singleton class in Systemverilog
Singleton class
{: .fs-5 .fw-500 }

---
## How to create a singleton class in Systemverilog
### Creating a protected constructor
{% highlight verilog %}
class example_singleton_class;

   protected function new(string name = "example_singleton_class")
      super.new(name);
   endfunction

endclass
{% endhighlight %}

### Adding static m_self variable and get_inst() function
{% highlight verilog %}
class example_singleton_class;
   ...
   static example_singleton_class m_self;
   ...
   protected function new(string name = "example_singleton_class")
      super.new(name);
   endfunction

   static function example_singleton_class get_inst();
      if (m_self == null) begin
         m_self = new("example_singleton_class");
      end
      return m_self;
   endfunction

endclass

{% endhighlight %}


### Constructing a singleton class
{% highlight verilog %}
...
   example_singleton_class m_singl_class = example_singleton_class::get_inst();
...
{% endhighlight %}

---
## Is it any good?
### Which class can be singleton

### Some uvm singleton classes


---
## Finding more information
To have more understanding as well as more examples, check below references:
1. [Singleton Pattern - Creational Design Patterns](https://refactoring.guru/design-patterns/singleton)

