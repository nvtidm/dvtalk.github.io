---
layout: post
title: Hey There
nav_order: 0
description: "My life as a design verification engineer"
comments: true
permalink: /
---

# Hey there
{: .fs-9 }

This is where I keep my notes, my thoughts, my experiences or anything interesting which I think should belong here. :D
{: .fs-6 .fw-300 }



---
## Who am I
Well, I'm a design verification engineer and I've been in this industry for quite a while. Mostly this site is for keeping notes of what I know, and also problems big and small which I faced. I work with Systemverilog, uvm everyday and these are what I know the most. However, now and then, I also find myself struggling with formal verification, design, STA timing, =)) and the list goes on with synthesis, ECO logic, and also scripting. Talking about scripting, I have been using csh and perl for a long time before switching to zsh/bash and python recently. And I love vim, gosh, it is the best.

---
## What you'll find here
* You'll find my how to
{: .fs-5 .ls-6 }

* You'll also find my thoughts
{: .fs-5 .ls-6 }

* And you'll find my randoms
{: .fs-5 .ls-6 }
Let's just say my randoms are just a bit better organized piece of my notes.
They might be about Systemverilog or uvm or even vim.
The only first and now the main reason for me to be on this is for keeping notes. 
I usually take notes to keep tracks of things. Things that I feel interested in, things that I wanna try or spend some time.



---
OK, that's it mates.
Use the search box if you need anything.
And if you cannot find what you need, well, later then. :D
{: .fs-5 .fw-600}

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

