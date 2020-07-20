---
layout: default
title: std::randomization examples
parent: Systemverilog Randoms
grand_parent: My Randoms
description: std::randomization examples
tag: systemverilog
nav_order: 1
---
# std::randomization examples
Sometimes an example is just enough.
Honestly, I do search and copy a lot. It is simply because I cannot remember everything.
Sometimes I pay a lot of time to understand and get the code run perfectly and then completely forgot about it after 1 year.
This post is to store some of std::randomization examples that I created/collected, just for me to copy later. :D
{: .fs-5 .fw-500 }
---

<div> <ul> <table>
   <tr>
      <th> Description </th>
      <th> Code </th>
      <th> Link </th>
   </tr>
   <tr>
      <td> array randomization with constrains on unique element, size(), sum, element value constrains </td>
      <td>
      <div class="code">
      {% highlight verilog %}
  int d_array[i] < 100;

  std::randomize(d_array) with {                                
    unique {d_array};
    d_array.size() == 10;
    d_array.sum    == 150;
    foreach (d_array[i]) {
      d_array[i] < 100;
      d_array[i] > 1;
      d_array[i] != i;
    } };
      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/5nYm" title="std::randomization example for array">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>
</table></ul></div>



