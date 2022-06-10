---
layout: default
title: Systemverilog Streaming Operator Example
parent: Systemverilog Randoms
grand_parent: My Randoms
description: Hands on examples of Systemverilog Streaming Operator
tag: systemverilog
comments: true
toc_en: true
nav_order: 1

---
# Systemverilog Streaming Operator Example
A rarely used operator but very useful in many situations.
{: .fs-5 .fw-500 }
---
## What is bit-stream type
From IEEE SV 2017:

Types that can be packed into a stream of bits are called bit-stream
types. A bit-stream type is a type consisting of the following: 
* Any integral, packed, or string type
* Unpacked arrays, structures, or classes of the preceding types
* Dynamically sized arrays (dynamic, associative, or queues) of any of the preceding types
This definition is recursive so that, for example, a structure containing a queue of int is a bit-stream type

---
## Streaming operator
From IEEE SV 2017:

The streaming operators perform packing of bit-stream types into a sequence of bits in a user-specified order.

The `slice_size` determines the size of each block, measured in bits. If a `slice_size` is not specified, the default is 1.

The `stream_operator` `<<` or `>>` determines the order in which blocks of data are streamed:
* `>>` causes blocks of data to be streamed in left-to-right order, while `<<` causes blocks of data to be streamed in right-to-left order.
* Left-to-right streaming using `>>` shall cause the slice_size to be ignored and no re-ordering performed.
* Right-to-left streaming using `<<` shall reverse the order of blocks in the stream, preserving the order of bits
within each block. 
* For right-to-left streaming using `<<`, the stream is sliced into blocks with the specified
number of bits, starting with the right-most bit. If as a result of slicing the last (left-most) block has fewer
bits than the block size, the last block has the size of the remaining bits; there is no padding or truncation.

## Example
Full code can be find in this gist: [Systemverilog stream operator example](https://gist.github.com/dvtalk/da85498c0599fd10cca2117068b3bc55)

<div>  
<input type="text" class="tablefilterinput" id="FilterInput" onkeyup="tablefilter()" placeholder="Table filter input..." title="filter input">

<table id="myTable" >
   <tr>
      <th> Description </th>
      <th> Code </th>
      <th> Link </th>
   </tr>

   <tr>
      <td> Streaming Operator: pack an array to an integral</td>
      <td>
      <div class="code">
      {% highlight verilog %}
    int            m_pack_var;

    m_pack_var = {>>byte{8'h06, 8'h07, 8'h08}};
    $display ("array to var %h\n",  m_pack_var );
    // output:
    // array to var 06070800

      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/YpFJ" title="std::randomize example for array/queue">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>

   <tr>
      <td> Streaming Operator: pack a queue to an integral</td>
      <td>
      <div class="code">
      {% highlight verilog %}
    automatic byte q[$] = {8'h01, 8'h02, 8'h03};
    int            m_pack_var;

    m_pack_var = {>>byte{q}};
    $display ("queue to var %h\n",  m_pack_var );
    // output
    // queue to var 01020300

      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/YpFJ" title="Systemverilog Streaming Operator">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>

   <tr>
      <td> Streaming Operator: turn an integral to a queue, 8bit slice</td>
      <td>
      <div class="code">
      {% highlight verilog %}
    byte q[$];

    q =  {>>byte{24'h060708}};
    foreach (q[i]) begin
      $display("byte queue, byte-slice 0x%0x", q[i]);
    end
    // output:
    // byte queue, byte-slice 0x6
    // byte queue, byte-slice 0x7
    // byte queue, byte-slice 0x8

      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/YpFJ" title="Systemverilog Streaming Operator">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>

   <tr>
      <td> Streaming Operator: turn an integral to a queue, 4bit slice</td>
      <td>
      <div class="code">
      {% highlight verilog %}
    bit[3:0] p[$];

    p =  {>>4{24'h060708}};
    foreach (p[i]) begin
      $display("4bit queue, 4bit-slice 0x%0x", p[i]);
    end
    // output:
    // 4bit queue, 4bit-slice 0x0
    // 4bit queue, 4bit-slice 0x6
    // 4bit queue, 4bit-slice 0x0
    // 4bit queue, 4bit-slice 0x7
    // 4bit queue, 4bit-slice 0x0
    // 4bit queue, 4bit-slice 0x8

      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/YpFJ" title="Systemverilog Streaming Operator">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>


   <tr>
      <td> Streaming Operator: re-order, 8bit slice</td>
      <td>
      <div class="code">
      {% highlight verilog %}
    $display ("byte-slice  %h",  {>>byte{24'h060708}} );
    $display ("byte-slice  %h",  {<<byte{24'h060708}} );
    // output:
    // byte-slice 060708
    // byte-slice 080706

      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/YpFJ" title="Systemverilog Streaming Operator">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>

   <tr>
      <td> Streaming Operator: reverse bit, 1bit slice</td>
      <td>
      <div class="code">
      {% highlight verilog %}
    $display ("1bit-slice %h",  {>>bit{24'h0a0a0a}} );
    $display ("1bit-slice %h",  {<<bit{24'h0a0a0a}} );
    // output:
    // 1bit-slice 0a0a0a
    // 1bit-slice 505050

      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/YpFJ" title="Systemverilog Streaming Operator">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>

   <tr>
      <td> Streaming Operator: re-order, 4bit slice</td>
      <td>
      <div class="code">
      {% highlight verilog %}
    $display ("4bit-slice %h",  {>>4{24'h0a0a0a}} );
    $display ("4bit-slice %h",  {<<4{24'h0a0a0a}} );
    // output:
    // 4bit-slice 0a0a0a
    // 4bit-slice 505050

      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/YpFJ" title="Systemverilog Streaming Operator">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>


   <tr>
      <td> Streaming operator at lhs, turn an integral to 3 different vars</td>
      <td>
      <div class="code">
      {% highlight verilog %}
    byte a, b, c;

    {<<byte{a,b,c}} = 24'h060708;
    $display("unpack a 0x%0x", a);
    $display("unpack b 0x%0x", b);
    $display("unpack c 0x%0x\n", c);

    {>>byte{a,b,c}} = 24'h060708;
    $display("unpack a 0x%0x", a);
    $display("unpack b 0x%0x", b);
    $display("unpack c 0x%0x", c);

      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/YpFJ" title="Systemverilog Streaming Operator">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>

   <tr>
      <td> Streaming Operator: use 2 Streaming Operator to turn a 32bit queue to a 8bit queue and vice versa </td>
      <td>
      <div class="code">
      {% highlight verilog %}
{% raw %}
    automatic byte      q8[$]  = {8'h01, 8'h02, 8'h03, 8'h04, 8'h05, 8'h06, 8'h07};
    automatic bit[31:0] q32[$];

    q32 = {>>32{{>>8{q8}}}}    ;
    foreach (q32[i]) begin
      $display ("q8 to q32  0x%0x",  q32[i] );
    end
    //
    // {>>8{q8}} --> pack q8 
    // {>>32{ ...}} -->  pack to q32
    //
    // output:
    // 0x1020304
    // 0x5060700

    q8.delete();
    q8 = {>>8{{>>32{q32}}}} ;
    $display ("q32 to q8  %p",  q8 );
    // output
    // '{1, 2, 3, 4, 5, 6, 7, 0}

{% endraw %}
      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/YpFJ" title="Systemverilog Streaming Operator">
      <svg width="25" height="25" viewBox="0 -0.1 2 2" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg></a>
      </td>
   </tr>

   <tr>
      <td> Streaming Operator: use 2 Streaming Operator to turn a 8bit queue to a 32bit queue with little endian </td>
      <td>
      <div class="code">
      {% highlight verilog %}
{% raw %}
    // input:
    // dd 19 df f2 83 e2 5c 4b-f3 a6 cd e0 99 7f 59 33

    // expected output
    // 0xf2df19dd -  0x4b5ce283 -  0xe0cda6f3 - 0x33597f99
    automatic byte      q8[$]  = {  'hdd , 'h19 , 'hdf , 'hf2 ,
                                    'h83 , 'he2 , 'h5c , 'h4b ,
                                    'hf3 , 'ha6 , 'hcd , 'he0 ,
                                    'h99 , 'h7f , 'h59 , 'h33};
    automatic bit[31:0] q32[$];

    q32 = {<<32{{<<8{q8}}}};
    foreach (q32[i]) begin
      $display ("q8 to q32 lit_endian  0x%0x",  q32[i] );
    end
  endfunction
  // q8 to q32 lit_endian  0xf2df19dd
  // q8 to q32 lit_endian  0x4b5ce283
  // q8 to q32 lit_endian  0xe0cda6f3
  // q8 to q32 lit_endian  0x33597f99

{% endraw %}
      {% endhighlight %}
      </div>
      </td>
      <td>
      <a href="https://www.edaplayground.com/x/YpFJ" title="Systemverilog Streaming Operator">
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

---
## Finding more information
To have more understanding as well as more examples, check below references:
1. IEEE SV 2017: 11.4.14 Streaming operators (pack/unpack)
1. [AMIQ: How to pack data using systemverilog streaming operators](https://www.amiq.com/consulting/2017/05/29/how-to-pack-data-using-systemverilog-streaming-operators/)
