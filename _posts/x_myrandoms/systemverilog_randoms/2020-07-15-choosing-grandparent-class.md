---
layout: default
title: Choosing grandparent class
parent: Systemverilog Randoms
grand_parent: My Randoms
description: Using parameterized class to select parent of our parent class
tags: [systemverilog,uvm]
nav_order: 1
---

# Choosing grandparent class
Usually when defining a new class, we will choose which class we will extends from.
How about choosing the parent class of the class which we will extends from? 
It is possible, and I will call it a grandparent class.
{: .fs-5 .fw-500 }

---
## How can it possible?
Recently, I go through this wonderful paper of DVCon 2016 [Paper_link](http://events.dvcon.org/2016/proceedings/papers/05_1.pdf).

This paper talked about using Interface Classes, but when skimming through this paper, I noticed the author used a very interesting technique to decide which classes to extends from.
It simply take advantages of parameterized class as below.
<div markdown="1" >
{% highlight verilog %}
     class component_a (type T = uvm_component) extends T;
{% endhighlight %}
</div>



Have you got the idea yet? The parameter type T class will be the class the component_a extends from.
Now if we has some of those classes as below:

<div markdown="1" >
{% highlight verilog %}
     class component_a (type T = uvm_component) extends T;
     class component_b (type T = uvm_component) extends T;
     class component_c (type T = uvm_component) extends T;
{% endhighlight %}
</div>

We can use `typedef` to create new class type with full control of which is parent class of which.
<div markdown="1" >
{% highlight verilog %}
     typedef component_a #( component_b #(component_c) ) customized_component;
{% endhighlight %}
</div>

This literally means that type class customized_component is component_a extends from component_b extends from component_c extends from uvm_component.

---
## Try it on my EDAplayground
<div> You can run an example of this method on this simple code here: -->
<a href="https://www.edaplayground.com/x/2wVa" title="Choose your grandparent class">
<svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg>
</a></div>

---
## Now what
This is a very interesting method, but don't be greedy since it might be painful to debug.
It is now come to our abstract thinking level to take the most advantages of this.

In the [Paper](http://events.dvcon.org/2016/proceedings/papers/05_1.pdf), the author used this to have a based class which create all the methods of interfaces classes implemented.

We can also use this to add another class between our class and legacy base class (sometimes we just don't feel like to modify the legacy class or use the uvm overrides).
<div markdown="1" >
{% highlight verilog %}
     typedef test_class #( new_class #( legacy_test_base_class )  )
{% endhighlight %}
</div>


<div>If you think of any other ways to use this technique, please share with me and I will put it here (with your name, of course =D ).
<a href="{{ '/emailme' | absolute_url }}" title="Email me">
<svg width="25" height="25" viewBox="0 -0.1 1 1" class="customsvg"> <use xlink:href="#svg-email"></use></svg>
</a> </div>

{: .fs-6 .fw-300 }


