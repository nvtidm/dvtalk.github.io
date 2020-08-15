---
layout: default
title: std::randomization examples
parent: Systemverilog Randoms
grand_parent: My Randoms
description: std::randomization examples
tag: systemverilog
comments: true
toc_en: true
nav_order: 1
---
# std::randomization examples
Sometimes an example is just enough.
Honestly, I do search and copy a lot. It is simply because I cannot remember everything.
Sometimes I pay a lot of time to understand and get the code run perfectly and then completely forget about it after 1 year.
This post is to store some of systemverilog std::randomization examples that I created/collected, just for me to copy later. :D
{: .fs-5 .fw-500 }
---

<div>  
<input type="text" class="tablefilterinput" id="FilterInput" onkeyup="tablefilter()" placeholder="Table filter input..." title="filter input">

<table id="myTable" >
   <tr>
      <th> Description </th>
      <th> Code </th>
      <th> Link </th>
   </tr>
   <tr>
      <td> systemverilog std::randomization array with constrains on unique element, number of elements, array sum, constrains for each element value using foreach</td>
      <td>
      <div class="code">
      {% highlight verilog %}
  int d_array[]; // also works with queue d_array[$]

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
      <a href="https://www.edaplayground.com/x/5nYm" title="std::randomization example for array/queue">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>

   <tr>
      <td> systemverilog std::randomization array using sum with</td>
      <td>
      <div class="code">
      {% highlight verilog %}
    int d_array[]; //also work with queue, try d_array[$]

    std::randomize(d_array) with {
      d_array.size() == 5;
      d_array.sum() with ( item > 10 ? item:0)  == 100;
      foreach (d_array[i]) {
        d_array[i] inside {[0:100]};
      }
    };
      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/5css" title="std::randomization example for array using sum with, and also inside">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>

   <tr>
      <td> systemverilog std::randomization using implication constraints</td>
      <td>
      <div class="code">
      {% highlight verilog %}
    int d_array[]; 

    std::randomize(d_array) with {
      d_array.size() == 3;
      d_array[0] > 10 -> d_array[1] inside {0,1,2};
      d_array[0] < 10 -> d_array[1] inside {3,4,5}
                         & d_array[2] inside {6,7,8};
    };     
      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/39Hg" title="randomization example using implication constraint">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>

   <tr>
      <td> systemverilog std::randomization using condition constraints</td>
      <td>
      <div class="code">
      {% highlight verilog %}
    int d_array[]; 

    std::randomize(d_array) with {
      d_array.size() == 3;
      if (d_array[0] > 10) {
        d_array[1] inside {0,1,2};
      }
      else {
        d_array[1] inside {3,4,5};
        d_array[2] inside {6,7,8};
      }
    };     
      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/dQx" title="randomization example using condition constraint">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>

   <tr>
      <td> systemverilog std::randomization with multiple variables</td>
      <td>
      <div class="code">
      {% highlight verilog %}
  int d_array[]; 
  int num;

  std::randomize(d_array, num) with {
    num inside {[0:100]};
    d_array.size()  == 3;
    d_array.sum(item) with ( item > 10? item:0) == num;
    foreach (d_array[i]){
      d_array[i] inside {[0:100]};
    }
  };     
      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/f5g" title="std::randomization example with multiple variables">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>


   <tr>
      <td> systemverilog std::randomization with weight distribution</td>
      <td>
      <div class="code">
      {% highlight verilog %}
  int d_array[]; 

  std::randomize(d_array) with {
    d_array.size()  == 1000;
    foreach (d_array[i]){
      d_array[i] dist { [0:50]:/80, [51:99]:/20 };
    }
  }; // 80% d_array element value will be in range [0:50]
      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/5HdN" title="std::randomization example with weight distribution">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>


   <tr>
      <td> systemverilog std::randomization with solve .. before </td>
      <td>
      <div class="code">
      {% highlight verilog %}
  int d_array[]; 
  int num;

  std::randomize(d_array, num) with {
    solve num before d_array;
    num inside {[0:100]};
    d_array.size()  == 3;
    d_array.sum(item) with ( item > 10? item:0) == num;
    foreach (d_array[i]){
      d_array[i] inside {[0:100]};
    }
 };     
      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/3fJD" title="std::randomization example with solve before">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>


</table>
    <script>
      function tablefilter() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("FilterInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[0];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }
        }
      }
    </script>
</div>
