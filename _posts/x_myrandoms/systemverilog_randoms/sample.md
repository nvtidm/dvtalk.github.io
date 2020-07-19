---
layout: default
title: <title>
parent: Systemverilog Random
grand_parent: My Randoms
tag: systemverilog
nav_order: 1
---

{: .fs-6 .fw-300 }


#link to posts in this site:
       [Customization]({{ site.baseurl }}{% link _posts/2020-07-10-email-me.md %}) 
       --> Customization is what show on the post with link will be open when click it

#link to other weblink:
       [Paper_link](http://events.dvcon.org/2016/proceedings/papers/05_1.pdf)
#adding a <hr> line
       ---
#adding a link with svg logo:
       <div> You can run an example of this method on this simple code. --> Click:
       <a href="https://www.edaplayground.com/x/2wVa" title="Choose your grandparent class">
       <svg width="25" height="25" viewBox="0 0 1 1" class="customsvg"> <use xlink:href="#svg-edaplay"></use></svg>
       </a></div>
#adding a code
       <div markdown="1" >
       ```verilog
            typedef test_class #( new_class #( legacy_test_base_class )  )
       ```
       </div>
#add a inline code:
       `typedef`
