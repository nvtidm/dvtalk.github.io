---
layout: post
title: Hey There
nav_order: 0
description: "My life as a design verification engineer"
comments: true
permalink: /
---

# Hey there
I'm a design verification engineer and this is where I keep my notes, my thoughts, my experiences or anything interesting which I think should belong here. :D
{: .fs-5 .fw-500 }

---
## Who am I
Well, I'm a design verification engineer and I've been in this industry for quite a while. Mostly this site is for keeping notes of what I know, and also problems big and small which I faced. I work with Systemverilog, uvm everyday and these are what I know the most. However, now and then, I also find myself struggling with formal verification, design, STA timing, =)) and the list goes on with synthesis, ECO logic, and also scripting. Talking about scripting, I have been using csh and perl for a long time before switching to zsh/bash and python recently. And I love vim, gosh, it is the best.

---
## What you'll find here
* You'll find my how to
* You'll also find my thoughts
* And you'll find my randoms.
Let's just say my randoms are just a bit better organized piece of my notes. They might be about Systemverilog or uvm or even vim. Just some random things that I really don't now where to post.



---
OK, that's it mates.
Use the search box if you need anything.
And if you cannot find what you need, well, later then. :D

---
Tag lists:
{% capture temptags %}
  {% for tag in site.tags %}
    {{ tag[1].size | plus: 1000 }}#{{ tag[0] }}#{{ tag[1].size }}
  {% endfor %}
{% endcapture %}
{% assign sortedtemptags = temptags | split:' ' | sort | reverse %}
<nobr>
{% for temptag in sortedtemptags %}
  {% assign tagitems = temptag | split: '#' %}
  {% capture tagname %}{{ tagitems[1] }}{% endcapture %}
  <a href="/tag/{{ tagname }}"><code class="highligher-rouge">{{ tagname }}</code></a>
{% endfor %}
</nobr>

