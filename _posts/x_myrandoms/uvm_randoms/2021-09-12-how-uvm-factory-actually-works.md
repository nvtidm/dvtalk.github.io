---
layout: default
title: How uvm factory actually works
parent: UVM Randoms
grand_parent: My Randoms
description: How uvm factory actually works
comments: true
share: true
tags: [uvm]
nav_order: 1
toc_en: true
---

# How uvm factory actually works
This post will go into detailed of the uvm factory operation.
If you have not known what uvm factory is yet, check this one:
[How to use uvm factory]({{ site.baseurl }}{% link _posts/x_myrandoms/uvm_randoms/2021-09-11-how-to-use-uvm-factory.md %}).
{: .fs-5 .fw-500 }

---
## Things to know before diving in
* Class scope operator `::`
* Abstract class
* Parameterized class
* Singleton class

---
## Registering the uvm obj/component to uvm factory
Using uvm factory, we just need to call a simple method,
then all the objects of the original class will be substitued by the new class when constructing.

### Object/Component registry class
{% highlight verilog %}
class uvm_object_registry #(type T=uvm_object, string Tname="") extends uvm_object_wrapper;

   //factory register code
   local static this_type me = get();

   static function this_type get();
      if (me == null) begin
         uvm_factory factory = uvm_coreservice_t::get().get_factory();
         me = new;
         factory.register(me);  //register to uvm factory
      end
      return me;
   endfunction

endclass
{% endhighlight %}

{% highlight verilog %}
class l2_layer extends uvm_object;
   `uvm_object_utils(l2_layer);
   ...
endclass

//generated code
class l2_layer extends uvm_object;
   typedef uvm_object_registry #(l2_layer, "l2_layer") type_id;
   ...
endclass
{% endhighlight %}
* Explain how the class is register in to the uvm_factory

---
## Constructing the new object

### The constructing object

{% highlight verilog %}
class uvm_object_registry #(type T=uvm_object, string Tname="") extends uvm_object_wrapper;
   ...
   //factory register code
   ...

   //construct T obj code
   static function T create (string name="", uvm_component parent=null, string contxt="");
      T           return_obj;
      uvm_object  obj;
      uvm_factory factory = uvm_coreservice_t::get().get_factory();

      //uvm factory will construct and return the obj
      obj = factory.create_object_by_type(get(),contxt,name);
      ...

      $cast(return_obj, obj);
      return return_obj;
   endfunction

endclass
{% endhighlight %}

Example of creating `l2_layer` object in a sequence class
{% highlight verilog %}
class sequence_a extends uvm_sequence;
...
   l2_layer m_l2_seq = l2_layer::type_id::create("l2_layer");
...
endclass
{% endhighlight %}
* Explain all the step

---
## Inside the uvm_factory

### Object/Component wrapper class
{% highlight verilog %}
virtual class uvm_object_wrapper;
   virtual function uvm_object create_object (string name="");
      return null;
   endfunction

   pure virtual function string get_type_name();
endclass

class uvm_object_registry #(type T=uvm_object, string Tname="") extends uvm_object_wrapper;
   //1. factory register code

   //2. create() function, called by user

   //3. create_object() function, called by uvm_factory
   virtual function uvm_object create_object(string name="");
      T obj;

      obj = new(name);
      return obj;
   endfunction

   const static string type_name = Tname;
   virtual function string get_type_name();
      return type_name;
   endfunction
endclass
{% endhighlight %}


### factory register() function
{% highlight verilog %}
class uvm_default_factory extends uvm_factory;

   protected bit                  m_types[uvm_object_wrapper];
   protected uvm_object_wrapper   m_type_names[string];

   function void register(uvm_object_wrapper obj);
      m_type_names[obj.get_type_name()] = obj;
   endfunction
endclass

{% endhighlight %}

### factory override function

### factory create object function


---
## Walk through


---
## Finding more information
1. [ How uvm factory actually works ](https://hungvn.test)
1. [ uvm cookbook ](https://verificationacademy.com/cookbook/factory)


