---
layout: default
title: Choosing grandparent class
parent: Systemverilog Randoms
grand_parent: My Randoms
description: Using parameterized class to select parent of our parent class
tags: [systemverilog,uvm]
comments: true
toc_en: true
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
<div class ="code" markdown="1" >
{% highlight verilog %}
     class component_a (type T = uvm_component) extends T;
{% endhighlight %}
</div>



Have you got the idea yet? The parameter type T class will be the class the component_a extends from.
Now if we has some of those classes as below:

<div class ="code" markdown="1" >
{% highlight verilog %}
     class component_a (type T = uvm_component) extends T;
     class component_b (type T = uvm_component) extends T;
     class component_c (type T = uvm_component) extends T;
{% endhighlight %}
</div>

We can use `typedef` to create new class type with full control of which is parent class of which.
<div class ="code" markdown="1" >
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

In the [Paper](http://events.dvcon.org/2016/proceedings/papers/05_1.pdf), the author used this method to implement all the required methods of an interface class.

In this blog [Do You Want Sprinkles with That? - Mixing in Constraints](https://blog.verificationgentleman.com/2015/03/28/mixing-in-constraints.html),
this kind of class is used to add more constraints to an existing class.

{: .fs-6 .fw-300 }


